// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '',
      name: 'home',
      getComponent(nextState, cb) {
        const reducer = require('containers/HomePage/reducer'); // eslint-disable-line global-require
        const component = require('containers/HomePage'); // eslint-disable-line global-require

        const renderRoute = loadModule(cb);

        injectReducer('home', reducer.default);
        renderRoute(component);
      },
    },
  ];
}
