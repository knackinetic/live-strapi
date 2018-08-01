import Loadable from 'react-loadable';

import LoadingIndicatorPage from 'components/LoadingIndicatorPage';

export default Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicatorPage,
});
