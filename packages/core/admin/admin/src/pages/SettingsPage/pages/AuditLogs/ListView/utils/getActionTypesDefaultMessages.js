const actionTypes = {
  'entry.create': 'Create entry',
  'entry.update': 'Update entry',
  'entry.delete': 'Delete entry',
  'entry.publish': 'Publish entry',
  'entry.unpublish': 'Unpublish entry',
  'media.create': 'Create media',
  'media.update': 'Update media',
  'media.delete': 'Delete media',
  'user.create': 'Create user',
  'user.update': 'Update user',
  'user.delete': 'Delete user',
  'admin.auth.success': 'Admin login',
  'admin.logout': 'Admin logout',
  'content-type.create': 'Create content type',
  'content-type.update': 'Update content type',
  'content-type.delete': 'Delete content type',
  'component.create': 'Create component',
  'component.update': 'Update component',
  'component.delete': 'Delete component',
  'role.create': 'Create role',
  'role.update': 'Update role',
  'role.delete': 'Delete role',
  'permission.create': 'Create permission',
  'permission.update': 'Update permission',
  'permission.delete': 'Delete permission',
};

const getDefaultMessage = (value) => {
  return actionTypes[value] || value;
};

export default getDefaultMessage;
