/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
// import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';
import { Switch, Route, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import pluginId from '../../pluginId';

import HomePage from '../HomePage';
import ModelPage from '../ModelPage';
import NotFoundPage from '../NotFoundPage';
import formSaga from '../Form/sagas';
import formReducer from '../Form/reducer';

// Other containers actions
import { makeSelectShouldRefetchContentType } from '../Form/selectors';

// Utils
import { storeData } from '../../utils/storeData';

import styles from './styles.scss';
import { modelsFetch } from './actions';
import reducer from './reducer';
import saga from './sagas';

/* eslint-disable consistent-return */
class App extends React.Component {
  componentDidMount() {
    this.props.modelsFetch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldRefetchContentType !== this.props.shouldRefetchContentType) {
      this.props.modelsFetch();
    }
  }


  componentWillUnmount() {
    // Empty the app localStorage
    storeData.clearAppStorage();
  }

  render() {
    return (
      <div className={`${pluginId} ${styles.app}`}>
        <Switch>
          <Route exact path="/plugins/content-type-builder" component={HomePage} />
          <Route exact path="/plugins/content-type-builder/models/:modelName" component={ModelPage} />
          <Route path="" component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.contextTypes = {
  plugins: PropTypes.object,
  router: PropTypes.object.isRequired,
  updatePlugin: PropTypes.func,
};

App.propTypes = {
  modelsFetch: PropTypes.func.isRequired,
  shouldRefetchContentType: PropTypes.bool,
};

App.defaultProps = {
  shouldRefetchContentType: false,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      modelsFetch,
    },
    dispatch
  );
}

const mapStateToProps = createStructuredSelector({
  shouldRefetchContentType: makeSelectShouldRefetchContentType(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = strapi.injectReducer({ key: 'global', reducer, pluginId });
const withSaga = strapi.injectSaga({ key: 'global', saga, pluginId });
const withFormReducer = strapi.injectReducer({ key: 'form', reducer: formReducer, pluginId });
const withFormSaga = strapi.injectSaga({ key: 'form', saga: formSaga, pluginId });

export default compose(
  withReducer,
  withFormReducer,
  withFormSaga,
  withSaga,
  withRouter,
  withConnect,
)(App);
