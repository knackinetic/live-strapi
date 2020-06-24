export const permissions = {
  'application::address.address': {
    contentTypeActions: {
      'plugins::content-manager.explorer.delete': true,
    },
    attributes: {
      city: {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
      cover: {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
      closing_period: {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
      'closing_period.start_date': {
        actions: ['plugins::content-manager.explorer.create'],
      },
      'closing_period.dish.description': {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
    },
  },
  'application::places.places': {
    attributes: {
      like: {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
      country: {
        actions: [
          'plugins::content-manager.explorer.create',
          'plugins::content-manager.explorer.read',
        ],
      },
    },
  },
};

export const contentTypes = [
  {
    uid: 'application::address.address',
    schema: {
      options: {
        timestamps: ['updated_at', 'created_at'],
      },
      modelType: 'contentType',
      attributes: {
        id: { type: 'integer' },
        city: { type: 'string', required: false },
        cover: { type: 'media', multiple: false, required: false },
        closing_period: {
          component: 'default.closingperiod',
          type: 'component',
        },
        label: { type: 'string' },
        updated_at: { type: 'timestamp' },
      },
    },
  },
  {
    uid: 'application::places.places',
    schema: {
      options: {
        timestamps: ['updated_at', 'created_at'],
      },
      modelType: 'contentType',
      attributes: {
        id: { type: 'integer' },
        like: { type: 'string', required: false },
        country: { type: 'string', required: false },
        image: { type: 'media', multiple: false, required: false },
        custom_label: { type: 'string' },
        updated_at: { type: 'timestamp' },
      },
    },
  },
];

export const components = [
  {
    uid: 'default.closingperiod',
    schema: {
      attributes: {
        id: { type: 'integer' },
        start_date: { type: 'date', required: true },
        dish: {
          component: 'default.dish',
          type: 'component',
        },
        media: { type: 'media', multiple: false, required: false },
      },
    },
  },
  {
    uid: 'default.dish',
    schema: {
      attributes: {
        description: { type: 'text' },
        id: { type: 'integer' },
        name: { type: 'string', required: true, default: 'My super dish' },
      },
    },
  },
  {
    uid: 'default.restaurantservice',
    schema: {
      attributes: {
        is_available: { type: 'boolean', required: true, default: true },
        id: { type: 'integer' },
        name: { type: 'string', required: true, default: 'something' },
      },
    },
  },
];
