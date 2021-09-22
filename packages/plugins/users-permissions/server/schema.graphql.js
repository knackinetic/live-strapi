'use strict';

const _ = require('lodash');

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
  if (_.get(contextBody, 'statusCode', 200) !== 200) {
    const message = _.get(contextBody, 'error', 'Bad Request');
    const exception = new Error(message);
    exception.code = _.get(contextBody, 'statusCode', 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  type: {
    UsersPermissionsPermission: false, // Make this type NOT queriable.
  },
  definition: /* GraphQL */ `
    type UsersPermissionsMe {
      id: ID!
      username: String!
      email: String!
      confirmed: Boolean
      blocked: Boolean
      role: UsersPermissionsMeRole
    }

    type UsersPermissionsMeRole {
      id: ID!
      name: String!
      description: String
      type: String
    }

    input UsersPermissionsRegisterInput {
      username: String!
      email: String!
      password: String!
    }

    input UsersPermissionsLoginInput {
      identifier: String!
      password: String!
      provider: String = "local"
    }

    type UsersPermissionsLoginPayload {
      jwt: String
      user: UsersPermissionsMe!
    }

    type UserPermissionsPasswordPayload {
      ok: Boolean!
    }
  `,
  query: `
    me: UsersPermissionsMe
  `,
  mutation: `
    login(input: UsersPermissionsLoginInput!): UsersPermissionsLoginPayload!
    register(input: UsersPermissionsRegisterInput!): UsersPermissionsLoginPayload!
    forgotPassword(email: String!): UserPermissionsPasswordPayload
    resetPassword(password: String!, passwordConfirmation: String!, code: String!): UsersPermissionsLoginPayload
    emailConfirmation(confirmation: String!): UsersPermissionsLoginPayload
  `,
  resolver: {
    Query: {
      me: {
        resolver: 'plugin::users-permissions.user.me',
      },
      role: {
        resolverOf: 'plugin::users-permissions.users-permissions.getRole',
        async resolver(obj, options, { context }) {
          context.params = { ...context.params, ...options.input };

          await strapi
            .plugin('users-permissions')
            .controller('users-permissions')
            .getRole(context);

          return context.body.role;
        },
      },
      roles: {
        description: `Retrieve all the existing roles. You can't apply filters on this query.`,
        resolverOf: 'plugin::users-permissions.users-permissions.getRoles', // Apply the `getRoles` permissions on the resolver.
        async resolver(obj, options, { context }) {
          context.params = { ...context.params, ...options.input };

          await strapi
            .plugin('users-permissions')
            .controller('users-permissions')
            .getRoles(context);

          return context.body.roles;
        },
      },
    },
    Mutation: {
      createRole: {
        description: 'Create a new role',
        resolverOf: 'plugin::users-permissions.users-permissions.createRole',
        async resolver(obj, options, { context }) {
          await strapi
            .plugin('users-permissions')
            .controller('users-permissions')
            .createRole(context);

          return { ok: true };
        },
      },
      updateRole: {
        description: 'Update an existing role',
        resolverOf: 'plugin::users-permissions.users-permissions.updateRole',
        async resolver(obj, options, { context }) {
          context.params = { ...context.params, ...options.input };
          context.params.role = context.params.id;

          await strapi
            .plugin('users-permissions')
            .controller('users-permissions')
            .updateRole(context);

          return { ok: true };
        },
      },
      deleteRole: {
        description: 'Delete an existing role',
        resolverOf: 'plugin::users-permissions.users-permissions.deleteRole',
        async resolver(obj, options, { context }) {
          context.params = { ...context.params, ...options.input };
          context.params.role = context.params.id;

          await strapi
            .plugin('users-permissions')
            .controller('users-permissions')
            .deleteRole(context);

          return { ok: true };
        },
      },
      createUser: {
        description: 'Create a new user',
        resolverOf: 'plugin::users-permissions.user.create',
        async resolver(obj, options, { context }) {
          context.params = _.toPlainObject(options.input.where);
          context.request.body = _.toPlainObject(options.input.data);

          await strapi
            .plugin('users-permissions')
            .controller('user')
            .create(context);

          return {
            user: context.body,
          };
        },
      },
      updateUser: {
        description: 'Update an existing user',
        resolverOf: 'plugin::users-permissions.user.update',
        async resolver(obj, options, { context }) {
          context.params = _.toPlainObject(options.input.where);
          context.request.body = _.toPlainObject(options.input.data);

          await strapi
            .plugin('users-permissions')
            .controller('user')
            .update(context);

          return {
            user: context.body,
          };
        },
      },
      deleteUser: {
        description: 'Delete an existing user',
        resolverOf: 'plugin::users-permissions.user.destroy',
        async resolver(obj, options, { context }) {
          // Set parameters to context.
          context.params = _.toPlainObject(options.input.where);
          context.request.body = _.toPlainObject(options.input.data);

          // Retrieve user to be able to return it because
          // Bookshelf doesn't return the row once deleted.
          await strapi
            .plugin('users-permissions')
            .controller('user')
            .findOne(context);
          // Assign result to user.
          const user = context.body;

          // Run destroy query.
          await strapi
            .plugin('users-permissions')
            .controller('user')
            .destroy(context);

          return {
            user,
          };
        },
      },
      register: {
        description: 'Register a user',
        resolverOf: 'plugin::users-permissions.auth.register',
        async resolver(obj, options, { context }) {
          context.request.body = _.toPlainObject(options.input);

          await strapi
            .plugin('users-permissions')
            .controller('auth')
            .register(context);

          let output = context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },
      login: {
        resolverOf: 'plugin::users-permissions.auth.callback',
        async resolver(obj, options, { context }) {
          context.params = {
            ...context.params,
            provider: options.input.provider,
          };
          context.request.body = _.toPlainObject(options.input);

          await strapi
            .plugin('users-permissions')
            .controller('auth')
            .callback(context);

          let output = context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },
      forgotPassword: {
        description: 'Request a reset password token',
        resolverOf: 'plugin::users-permissions.auth.forgotPassword',
        async resolver(obj, options, { context }) {
          context.request.body = _.toPlainObject(options);

          await strapi
            .plugin('users-permissions')
            .controller('auth')
            .forgotPassword(context);

          let output = context.body;

          checkBadRequest(output);

          return {
            ok: output.ok || output,
          };
        },
      },
      resetPassword: {
        description: 'Reset user password. Confirm with a code (resetToken from forgotPassword)',
        resolverOf: 'plugin::users-permissions.auth.resetPassword',
        async resolver(obj, options, { context }) {
          context.request.body = _.toPlainObject(options);

          await strapi
            .plugin('users-permissions')
            .controller('auth')
            .resetPassword(context);

          let output = context.body;

          checkBadRequest(output);

          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },
      emailConfirmation: {
        description: 'Confirm an email users email address',
        resolverOf: 'plugin::users-permissions.auth.emailConfirmation',
        async resolver(obj, options, { context }) {
          context.query = _.toPlainObject(options);

          await strapi
            .plugin('users-permissions')
            .controller('auth')
            .emailConfirmation(context, null, true);

          let output = context.body;

          checkBadRequest(output);

          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },
    },
  },
};
