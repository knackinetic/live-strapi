import pluginPkg from '../../package.json';
import pluginLogo from './assets/images/logo.svg';
import App from './containers/App';
import SettingsPage from './containers/SettingsPage';
import InputMedia from './components/InputMedia';

import trads from './translations';
import pluginId from './pluginId';
import getTrad from './utils/getTrad';

export default strapi => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: null,
    injectedComponents: [],
    isReady: true,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles: null,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: App,
    name: pluginPkg.strapi.name,
    pluginLogo,
    preventComponentRendering: false,
    settings: {
      global: [
        {
          title: {
            id: getTrad('plugin.name'),
            defaultMessage: 'Media Library',
          },
          name: 'media-library',
          to: `${strapi.settingsBaseURL}/media-library`,
          // TODO
          Component: SettingsPage,
        },
      ],
    },
    trads,
  };

  strapi.registerField({ type: 'media', Component: InputMedia });

  return strapi.registerPlugin(plugin);
};
