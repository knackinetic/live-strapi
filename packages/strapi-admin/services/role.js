'use strict';

const _ = require('lodash');
const { set } = require('lodash/fp');
const { generateTimestampCode, stringIncludes } = require('strapi-utils');
const { SUPER_ADMIN_CODE } = require('./constants');
const { createPermission } = require('../domain/permission');

const ACTIONS = {
  publish: 'plugins::content-manager.explorer.publish',
};

const sanitizeRole = role => {
  return _.omit(role, ['users', 'permissions']);
};

/**
 * Create and save a role in database
 * @param attributes A partial role object
 * @returns {Promise<role>}
 */
const create = async attributes => {
  const alreadyExists = await exists({ name: attributes.name });

  if (alreadyExists) {
    throw strapi.errors.badRequest('ValidationError', {
      name: [`The name must be unique and a role with name \`${attributes.name}\` already exists.`],
    });
  }

  const autoGeneratedCode = `${_.kebabCase(attributes.name)}-${generateTimestampCode()}`;

  const rolesWithCode = {
    ...attributes,
    code: attributes.code || autoGeneratedCode,
  };

  return strapi.query('role', 'admin').create(rolesWithCode);
};

/**
 * Find a role in database
 * @param params query params to find the role
 * @param populate
 * @returns {Promise<role>}
 */
const findOne = (params = {}, populate = []) => {
  return strapi.query('role', 'admin').findOne(params, populate);
};

/**
 * Find a role in database with usersCounts
 * @param params query params to find the role
 * @param populate
 * @returns {Promise<role>}
 */
const findOneWithUsersCount = async (params = {}, populate = []) => {
  const role = await strapi.query('role', 'admin').findOne(params, populate);

  if (role) {
    role.usersCount = await getUsersCount(role.id);
  }

  return role;
};

/**
 * Find roles in database
 * @param params query params to find the roles
 * @param populate
 * @returns {Promise<array>}
 */
const find = (params = {}, populate = []) => {
  return strapi.query('role', 'admin').find(params, populate);
};

/**
 * Find all roles in database
 * @returns {Promise<array>}
 */
const findAllWithUsersCount = async (populate = []) => {
  const roles = await strapi.query('role', 'admin').find({ _limit: -1 }, populate);
  for (let role of roles) {
    role.usersCount = await getUsersCount(role.id);
  }

  return roles;
};

/**
 * Update a role in database
 * @param params query params to find the role to update
 * @param attributes A partial role object
 * @returns {Promise<role>}
 */
const update = async (params, attributes) => {
  const sanitizedAttributes = _.omit(attributes, ['code']);

  if (_.has(params, 'id') && _.has(sanitizedAttributes, 'name')) {
    const alreadyExists = await exists({
      name: sanitizedAttributes.name,
      id_ne: params.id,
    });
    if (alreadyExists) {
      throw strapi.errors.badRequest('ValidationError', {
        name: [
          `The name must be unique and a role with name \`${sanitizedAttributes.name}\` already exists.`,
        ],
      });
    }
  }

  return strapi.query('role', 'admin').update(params, sanitizedAttributes);
};

/**
 * Check if a role exists in database
 * @param params query params to find the role
 * @returns {Promise<boolean>}
 */
const exists = async params => {
  const foundCount = await strapi.query('role', 'admin').count(params);

  return foundCount > 0;
};

/**
 * Count the number of roles based on search params
 * @param params params used for the query
 * @returns {Promise<number>}
 */
const count = async (params = {}) => {
  return strapi.query('role', 'admin').count(params);
};

/**
 * Delete roles in database if they have no user assigned
 * @param ids query params to find the roles
 * @returns {Promise<array>}
 */
const deleteByIds = async (ids = []) => {
  const superAdminRole = await getSuperAdmin();
  if (superAdminRole && stringIncludes(ids, superAdminRole.id)) {
    throw strapi.errors.badRequest('ValidationError', {
      ids: ['You cannot delete the super admin role'],
    });
  }

  for (let roleId of ids) {
    const usersCount = await getUsersCount(roleId);
    if (usersCount !== 0) {
      throw strapi.errors.badRequest('ValidationError', {
        ids: ['Some roles are still assigned to some users.'],
      });
    }
  }

  await strapi.admin.services.permission.deleteByRolesIds(ids);

  let deletedRoles = await strapi.query('role', 'admin').delete({ id_in: ids });

  if (!Array.isArray(deletedRoles)) {
    deletedRoles = [deletedRoles];
  }

  return deletedRoles;
};

/** Count the number of users for some roles
 * @returns {Promise<integer>}
 * @param roleId
 */
const getUsersCount = async roleId => {
  return strapi.query('user', 'admin').count({ roles: [roleId] });
};

/** Returns admin role
 * @returns {Promise<role>}
 */
const getSuperAdmin = () => findOne({ code: SUPER_ADMIN_CODE });

/** Returns admin role with userCount
 * @returns {Promise<role>}
 */
const getSuperAdminWithUsersCount = () => findOneWithUsersCount({ code: SUPER_ADMIN_CODE });

/** Create superAdmin, Author and Editor role is no role already exist
 * @returns {Promise<>}
 */
const createRolesIfNoneExist = async ({ createPermissionsForAdmin = false } = {}) => {
  const someRolesExist = await exists();
  if (someRolesExist) {
    return;
  }

  const allActions = strapi.admin.services.permission.actionProvider.getAll();
  const contentTypesActions = allActions.filter(a => a.section === 'contentTypes');

  // create 3 roles
  const superAdminRole = await create({
    name: 'Super Admin',
    code: 'strapi-super-admin',
    description: 'Super Admins can access and manage all features and settings.',
  });

  await strapi.admin.services.user.assignARoleToAll(superAdminRole.id);

  const editorRole = await create({
    name: 'Editor',
    code: 'strapi-editor',
    description: 'Editors can manage and publish contents including those of other users.',
  });

  const authorRole = await create({
    name: 'Author',
    code: 'strapi-author',
    description: 'Authors can manage the content they have created.',
  });

  // create content-type permissions for each role
  const editorPermissions = strapi.admin.services['content-type'].getPermissionsWithNestedFields(
    contentTypesActions,
    {
      restrictedSubjects: ['plugins::users-permissions.user'],
    }
  );

  const authorPermissions = editorPermissions
    .filter(({ action }) => action !== ACTIONS.publish)
    .map(set('conditions', ['admin::is-creator']));

  editorPermissions.push(...getDefaultPluginPermissions());
  authorPermissions.push(...getDefaultPluginPermissions({ isAuthor: true }));

  // assign permissions to roles
  editorPermissions.forEach(p => {
    p.role = editorRole.id;
  });
  authorPermissions.forEach(p => {
    p.role = authorRole.id;
  });
  await strapi.admin.services.permission.createMany(editorPermissions);
  await strapi.admin.services.permission.createMany(authorPermissions);

  if (createPermissionsForAdmin) {
    await strapi.admin.services.permission.resetSuperAdminPermissions();
  }
};

const getDefaultPluginPermissions = ({ isAuthor = false } = {}) => {
  const conditions = isAuthor ? ['admin::is-creator'] : null;

  // add plugin permissions for each role
  return [
    { action: 'plugins::upload.read', conditions },
    { action: 'plugins::upload.assets.create' },
    { action: 'plugins::upload.assets.update', conditions },
    { action: 'plugins::upload.assets.download' },
    { action: 'plugins::upload.assets.copy-link' },
  ].map(createPermission);
};

/** Display a warning if the role superAdmin doesn't exist
 *  or if the role is not assigned to at least one user
 * @returns {Promise<>}
 */
const displayWarningIfNoSuperAdmin = async () => {
  const superAdminRole = await getSuperAdminWithUsersCount();
  const someUsersExists = await strapi.admin.services.user.exists();
  if (!superAdminRole) {
    strapi.log.warn("Your application doesn't have a super admin role.");
  } else if (someUsersExists && superAdminRole.usersCount === 0) {
    strapi.log.warn("Your application doesn't have a super admin user.");
  }
};

module.exports = {
  sanitizeRole,
  create,
  findOne,
  findOneWithUsersCount,
  find,
  findAllWithUsersCount,
  update,
  exists,
  count,
  deleteByIds,
  getUsersCount,
  getSuperAdmin,
  getSuperAdminWithUsersCount,
  createRolesIfNoneExist,
  displayWarningIfNoSuperAdmin,
};
