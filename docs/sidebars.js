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
      label: 'Core',
      link: {
        type: 'generated-index',
      },
      collapsible: false,
      items: [
        {
          type: 'category',
          label: 'Content Manager',
          link: {
            type: 'doc',
            id: 'core/content-manager/intro',
          },
          items: ['example'],
        },
        {
          type: 'category',
          label: 'Content Type Builder',
          link: {
            type: 'doc',
            id: 'core/content-type-builder/intro',
          },
          items: ['example'],
        },
      ],
    },
  ],
  api: [{ type: 'autogenerated', dirName: 'api' }],
  community: [{ type: 'autogenerated', dirName: 'community' }],
};

module.exports = sidebars;
