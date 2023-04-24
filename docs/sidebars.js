/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docs: [
    'index',
    {
      type: 'category',
      label: 'Admin',
      items: [
        {
          type: 'doc',
          label: 'Link Strapi Design System',
          id: 'core/admin/link-strapi-design-system',
        },
      ],
    },
    {
      type: 'category',
      label: 'Core',
      link: {
        type: 'generated-index',
      },
      collapsible: false,
      items: [
        {
          type: 'category',
          label: 'Admin',
          items: [
            {
              type: 'doc',
              label: 'Link Strapi Design System',
              id: 'core/admin/link-strapi-design-system',
            },
          ],
        },
        {
          type: 'category',
          label: 'Content Manager',
          link: {
            type: 'doc',
            id: 'core/content-manager/intro',
          },
          items: [
            {
              type: 'category',
              label: 'Hooks',
              items: [
                {
                  type: 'doc',
                  label: 'useCallbackRef',
                  id: 'core/content-manager/hooks/use-callback-ref',
                },
                {
                  type: 'doc',
                  label: 'useDragAndDrop',
                  id: 'core/content-manager/hooks/use-drag-and-drop',
                },
              ],
            },
            {
              type: 'doc',
              label: 'Relations',
              id: 'core/content-manager/relations',
            },
            {
              type: 'doc',
              label: 'Review Workflows',
              id: 'core/content-manager/review-workflows',
            },
          ],
        },
        {
          type: 'category',
          label: 'Content Type Builder',
          link: {
            type: 'doc',
            id: 'core/content-type-builder/intro',
          },
          items: [
            {
              type: 'doc',
              label: 'Review Workflows',
              id: 'core/content-type-builder/review-workflows',
            },
          ],
        },
        {
          type: 'category',
          label: 'Database',
          link: {
            type: 'doc',
            id: 'core/database/intro',
          },
          items: [
            {
              type: 'category',
              label: 'Relations',
              items: [
                {
                  type: 'doc',
                  label: 'Reordering',
                  id: 'core/database/relations/reordering',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Helper Plugin',
          items: [
            {
              type: 'category',
              label: 'Hooks',
              items: [
                {
                  type: 'doc',
                  label: 'useAPIErrorHandler',
                  id: 'core/helper-plugin/hooks/use-api-error-handler',
                },
                {
                  type: 'doc',
                  label: 'useCollator',
                  id: 'core/helper-plugin/hooks/use-collator',
                },
                {
                  type: 'doc',
                  label: 'useFetchClient',
                  id: 'core/helper-plugin/hooks/use-fetch-client',
                },
                {
                  type: 'doc',
                  label: 'useFilter',
                  id: 'core/helper-plugin/hooks/use-filter',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Permissions (RBAC)',
          link: {
            type: 'doc',
            id: 'core/permissions/intro',
          },
          items: [
            {
              type: 'doc',
              label: 'How Permissions Work',
              id: 'core/permissions/how-they-work',
            },
            {
              type: 'category',
              label: 'RBAC on the frontend',
              items: [
                {
                  type: 'doc',
                  label: 'Fetching Permissions',
                  id: 'core/permissions/frontend/fetching-permissions',
                },
                {
                  type: 'doc',
                  label: 'Using Permissions',
                  id: 'core/permissions/frontend/using-permissions',
                },
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Settings',
          link: {
            type: 'doc',
            id: 'core/settings/intro',
          },
          items: [
            {
              type: 'doc',
              label: 'Review Workflows',
              id: 'core/settings/review-workflows',
            },
          ],
        },
        {
          type: 'category',
          label: 'Utils',
          items: [
            {
              type: 'doc',
              label: 'Async',
              id: 'core/utils/async',
            },
            {
              type: 'doc',
              label: 'Event Hub',
              id: 'core/utils/event-hub',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Custom Fields',
      link: {
        type: 'doc',
        id: 'custom-fields',
      },
      items: [],
    },
  ],
  api: [{ type: 'autogenerated', dirName: 'api' }],
  community: [{ type: 'autogenerated', dirName: 'community' }],
};

module.exports = sidebars;
