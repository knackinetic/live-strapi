import { createSelector } from 'reselect';

/**
 * Direct selector to the list state domain
 */

const selectGlobalDomain = () => state => state.get('global');

const makeSelectLoading = () => createSelector(
  selectGlobalDomain(),
  (globalSate) => globalSate.get('loading'),
);

const makeSelectModels = () => createSelector(
 selectGlobalDomain(),
 (globalSate) => globalSate.get('models'),
);

const selectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return state => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};


export { selectLocationState, makeSelectLoading, makeSelectModels };
