module.exports = {
  user: {
    actions: {
      create: 'User.create', // Use the User plugin's controller.
      update: 'User.update',
      destroy: 'User.destroy',
      deleteall: 'User.destroyAll',
    },
  },
};
