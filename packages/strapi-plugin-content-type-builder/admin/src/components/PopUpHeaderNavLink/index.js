/**
*
* PopUpHeaderNavLink
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { replace, includes } from 'lodash';
import { router } from 'app';
import styles from './styles.scss';

/* eslint-disable jsx-a11y/no-static-element-interactions */

class PopUpHeaderNavLink extends React.Component { // eslint-disable-line react/prefer-stateless-function
  goTo = () => {
    router.push(replace(this.props.routePath, this.props.nameToReplace, this.props.name));
  }

  render() {
    const activeClass = includes(this.props.routePath, this.props.name) ? styles.popUpHeaderNavLink : '';

    return (
      <div className={activeClass} onClick={this.goTo} style={{ cursor: 'pointer' }}>
        <FormattedMessage id={this.props.message} />
      </div>
    );
  }
}

PopUpHeaderNavLink.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string,
  nameToReplace: PropTypes.string,
  routePath: PropTypes.string,
}

export default PopUpHeaderNavLink;
