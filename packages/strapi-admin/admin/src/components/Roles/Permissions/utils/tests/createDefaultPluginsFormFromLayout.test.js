import createDefaultPluginsFormFromLayout, {
  createSubCategoryForm,
  createChildrenDefaultForm,
} from '../createDefaultPluginsFormFromLayout';

const conditions = [
  {
    id: 'admin::is-creator',
    displayName: 'Is creator',
    category: 'default',
  },
  {
    id: 'admin::has-same-role-as-creator',
    displayName: 'Has same role as creator',
    category: 'default',
  },
];

describe('ADMIN | COMPONENTS | Permissions | utils', () => {
  describe('createSubCategoryForm', () => {
    it('should return an object with all the leafs set to false', () => {
      const actions = [
        {
          displayName: 'Update and delete',
          action: 'plugins::documentation.settings.update',
          subCategory: 'settings',
          plugin: 'plugin::documentation',
        },
        {
          displayName: 'Regenerate',
          action: 'plugins::documentation.settings.regenerate',
          subCategory: 'settings',
          plugin: 'plugin::documentation',
        },
      ];

      const expected = {
        'plugins::documentation.settings.update': {
          properties: {
            enabled: false,
          },
          conditions: {
            'admin::is-creator': false,
            'admin::has-same-role-as-creator': false,
          },
        },
        'plugins::documentation.settings.regenerate': {
          properties: {
            enabled: false,
          },
          conditions: {
            'admin::is-creator': false,
            'admin::has-same-role-as-creator': false,
          },
        },
      };

      expect(createSubCategoryForm(actions, conditions, [])).toEqual(expected);
    });

    it('should return an object with all the leafs set to true when the permission exists', () => {
      const actions = [
        {
          displayName: 'Update and delete',
          action: 'plugins::documentation.settings.update',
          subCategory: 'settings',
          plugin: 'plugin::documentation',
        },
        {
          displayName: 'Regenerate',
          action: 'plugins::documentation.settings.regenerate',
          subCategory: 'settings',
          plugin: 'plugin::documentation',
        },
      ];

      const permissions = [
        {
          action: 'plugins::documentation.settings.update',
          subject: null,
          conditions: ['admin::has-same-role-as-creator'],
        },
      ];

      const expected = {
        'plugins::documentation.settings.update': {
          properties: {
            enabled: true,
          },
          conditions: {
            'admin::is-creator': false,
            'admin::has-same-role-as-creator': true,
          },
        },
        'plugins::documentation.settings.regenerate': {
          properties: {
            enabled: false,
          },
          conditions: {
            'admin::is-creator': false,
            'admin::has-same-role-as-creator': false,
          },
        },
      };

      expect(createSubCategoryForm(actions, conditions, permissions)).toEqual(expected);
    });
  });

  describe('createChildrenDefaultForm', () => {
    it('should return an object with all the leafs set to false', () => {
      const chilrenForm = [
        {
          subCategoryName: 'general',
          subCategoryId: 'general',
          actions: [
            {
              displayName: 'Access the Documentation',
              action: 'plugins::documentation.read',
              subCategory: 'general',
              plugin: 'plugin::documentation',
            },
          ],
        },
        {
          subCategoryName: 'settings',
          subCategoryId: 'settings',
          actions: [
            {
              displayName: 'Update and delete',
              action: 'plugins::documentation.settings.update',
              subCategory: 'settings',
              plugin: 'plugin::documentation',
            },
            {
              displayName: 'Regenerate',
              action: 'plugins::documentation.settings.regenerate',
              subCategory: 'settings',
              plugin: 'plugin::documentation',
            },
          ],
        },
      ];
      const expected = {
        general: {
          'plugins::documentation.read': {
            properties: {
              enabled: false,
            },
            conditions: {
              'admin::is-creator': false,
              'admin::has-same-role-as-creator': false,
            },
          },
        },
        settings: {
          'plugins::documentation.settings.update': {
            properties: {
              enabled: false,
            },
            conditions: {
              'admin::is-creator': false,
              'admin::has-same-role-as-creator': false,
            },
          },
          'plugins::documentation.settings.regenerate': {
            properties: {
              enabled: false,
            },
            conditions: {
              'admin::is-creator': false,
              'admin::has-same-role-as-creator': false,
            },
          },
        },
      };

      expect(createChildrenDefaultForm(chilrenForm, conditions, [])).toEqual(expected);
    });
  });

  describe('createDefaultPluginsAndSettingsFormFromLayout', () => {
    it('should return an object with all the leafs set to false', () => {
      const data = [
        {
          category: 'plugin::content-type-builder',
          categoryId: 'plugin::content-type-builder',
          childrenForm: [
            {
              subCategoryName: 'general',
              subCategoryId: 'general',
              actions: [
                {
                  displayName: 'Read',
                  action: 'plugins::content-type-builder.read',
                  subCategory: 'general',
                  plugin: 'plugin::content-type-builder',
                },
              ],
            },
          ],
        },
        {
          category: 'plugin::documentation',
          categoryId: 'plugin::documentation',
          childrenForm: [
            {
              subCategoryName: 'general',
              subCategoryId: 'general',
              actions: [
                {
                  displayName: 'Access the Documentation',
                  action: 'plugins::documentation.read',
                  subCategory: 'general',
                  plugin: 'plugin::documentation',
                },
              ],
            },
            {
              subCategoryName: 'settings',
              subCategoryId: 'settings',
              actions: [
                {
                  displayName: 'Update and delete',
                  action: 'plugins::documentation.settings.update',
                  subCategory: 'settings',
                  plugin: 'plugin::documentation',
                },
                {
                  displayName: 'Regenerate',
                  action: 'plugins::documentation.settings.regenerate',
                  subCategory: 'settings',
                  plugin: 'plugin::documentation',
                },
              ],
            },
          ],
        },
      ];

      const expected = {
        'plugin::content-type-builder': {
          general: {
            'plugins::content-type-builder.read': {
              properties: {
                enabled: false,
              },
              conditions: {
                'admin::is-creator': false,
                'admin::has-same-role-as-creator': false,
              },
            },
          },
        },
        'plugin::documentation': {
          general: {
            'plugins::documentation.read': {
              properties: {
                enabled: false,
              },
              conditions: {
                'admin::is-creator': false,
                'admin::has-same-role-as-creator': false,
              },
            },
          },
          settings: {
            'plugins::documentation.settings.update': {
              properties: {
                enabled: false,
              },
              conditions: {
                'admin::is-creator': false,
                'admin::has-same-role-as-creator': false,
              },
            },
            'plugins::documentation.settings.regenerate': {
              properties: {
                enabled: false,
              },
              conditions: {
                'admin::is-creator': false,
                'admin::has-same-role-as-creator': false,
              },
            },
          },
        },
      };

      expect(createDefaultPluginsFormFromLayout(data, conditions, [])).toEqual(expected);
    });
  });
});
