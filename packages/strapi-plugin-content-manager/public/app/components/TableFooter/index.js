/**
*
* TableFooter
*
*/

import React from 'react';
import Pagination from 'components/Pagination';
import LimitSelect from 'components/LimitSelect';

import styles from './styles.scss';

class TableFooter extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={`row ${styles.tableFooter}`}>
        <div className="col-md-6">
          <Pagination
            limit={this.props.limit}
            currentPage={this.props.currentPage}
            changePage={this.props.changePage}
            count={this.props.count}
          />
        </div>
        <div className="col-md-6">
          <div className="pull-xs-right">
            <LimitSelect
              className="push-lg-right"
              onLimitChange={this.props.onLimitChange}
              limit={this.props.limit}
            />
          </div>
        </div>
      </div>
    );
  }
}

TableFooter.propTypes = {
  limit: React.PropTypes.number,
  currentPage: React.PropTypes.number,
  changePage: React.PropTypes.func,
  count: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.bool,
  ]),
  onLimitChange: React.PropTypes.func,
};

export default TableFooter;
