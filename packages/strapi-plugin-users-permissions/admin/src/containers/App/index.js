/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Switch, Route } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';

// Utils
import { pluginId } from 'app';

// Containers
import AuthPage from 'containers/AuthPage';
import EditPage from 'containers/EditPage';
import HomePage from 'containers/HomePage';
import NotFoundPage from 'containers/NotFoundPage';
import OverlayBlocker from 'components/OverlayBlocker';

import { makeSelectBlockApp } from './selectors';

class App extends React.Component {
  componentDidMount() {
    if (!this.props.location.pathname.split('/')[3]) {
      this.props.history.push('/plugins/users-permissions/roles');
    }
  }

  componentDidUpdate() {
    if (!this.props.location.pathname.split('/')[3]) {
      this.props.history.push('/plugins/users-permissions/roles');
    }
  }

  render() {
    return (
      <div className={pluginId}>
        <OverlayBlocker isOpen={this.props.blockApp} />
        <Switch>
          <Route path={`/plugins/${pluginId}/auth/:authType/:id?`} component={AuthPage} exact />
          <Route path={`/plugins/${pluginId}/:settingType/:actionType/:id?`} component={EditPage} exact />
          <Route path={`/plugins/${pluginId}/:settingType`} component={HomePage} exact />
          <Route component={NotFoundPage} />
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
  blockApp: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {},
    dispatch,
  );
}

const mapStateToProps = createStructuredSelector({
  blockApp: makeSelectBlockApp(),
});

// Wrap the component to inject dispatch and state into it
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
)(App);
