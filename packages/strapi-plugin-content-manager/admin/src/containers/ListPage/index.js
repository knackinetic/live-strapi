/**
 *
 * ListPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { capitalize, get, isUndefined, map, toInteger } from 'lodash';
import cn from 'classnames';

// App selectors
import { makeSelectModels, makeSelectSchema } from 'containers/App/selectors';

// You can find these components in either
// ./node_modules/strapi-helper-plugin/lib/src
// or strapi/packages/strapi-helper-plugin/lib/src
import PageFooter from 'components/PageFooter';
import PluginHeader from 'components/PluginHeader';
import PopUpWarning from 'components/PopUpWarning/Loadable';

// Components from the plugin itself
import AddFilterCTA from 'components/AddFilterCTA';
import FiltersPickWrapper from 'components/FiltersPickWrapper/Loadable';
import Filter from 'components/Filter/Loadable';
import Table from 'components/Table';

// Utils located in `strapi/packages/strapi-helper-plugin/lib/src/utils`;
import getQueryParameters from 'utils/getQueryParameters';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import Div from './Div';

import {
  addFilter,
  changeParams,
  deleteData,
  getData,
  onChange,
  onClickRemove,
  onToggleFilters,
  removeAllFilters,
  removeFilter,
  setParams,
  submit,
} from './actions';

import reducer from './reducer';
import saga from './saga';
import makeSelectListPage from './selectors';

import styles from './styles.scss';

export class ListPage extends React.Component {
  state = { showWarning: false, target: '', showHeader: true };

  componentDidMount() {
    this.getData(this.props);
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname, search },
    } = prevProps;
    const {
      listPage: { showFilter },
    } = this.props;

    if (pathname !== this.props.location.pathname) {
      this.getData(this.props);
      this.shouldDisplayPluginHeader();
    }

    if (search !== this.props.location.search) {
      this.getData(this.props);
    }

    if (prevProps.listPage.showFilter !== showFilter) {
      this.hidePluginHeader(showFilter);
    }
  }

  componentWillUnmount() {
    if (this.props.listPage.showFilter) {
      this.props.onToggleFilters();
    }
  }

  /**
   * Helper to retrieve the current model data
   * @return {Object} the current model
   */
  getCurrentModel = () =>
    get(this.props.models, ['models', this.getCurrentModelName()]) ||
    get(this.props.models, ['plugins', this.getSource(), 'models', this.getCurrentModelName()]);

  /**
   * Helper to retrieve the current model name
   * @return {String} the current model's name
   */
  getCurrentModelName = () => this.props.match.params.slug;

  /**
   * Function to fetch data
   * @param  {Object} props
   */
  getData = props => {
    const source = getQueryParameters(props.location.search, 'source');
    const _limit = toInteger(getQueryParameters(props.location.search, '_limit')) || 10;
    const _page = toInteger(getQueryParameters(props.location.search, '_page')) || 1;
    const _sort = this.findPageSort(props);
    const params = { _limit, _page, _sort };
    const filters = this.generateFiltersFromSearch(props.location.search);

    this.props.setParams(params, filters);
    this.props.getData(props.match.params.slug, source);
  };

  /**
   * Helper to retrieve the model's source
   * @return {String} the model's source
   */
  getSource = () => getQueryParameters(this.props.location.search, 'source') || 'content-manager';

  /**
   * Retrieve the model's schema
   * @return {Object} Fields
   */
  getCurrentSchema = () =>
    get(this.props.schema, [this.getCurrentModelName(), 'fields']) ||
    get(this.props.schema, ['plugins', this.getSource(), this.getCurrentModelName(), 'fields']);

  hidePluginHeader = showFilter => {
    if (showFilter) {
      this.setState(prevState => ({ showHeader: !prevState.showHeader }));
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          this.setState({ showHeader: true });
          resolve();
        }, 300);
      });
    }
  };

  shouldDisplayPluginHeader = () => {
    if (this.props.listPage.showFilter) {
      this.props.onToggleFilters();
      this.setState({ showHeader: true });
    }
  };

  generateFiltersFromSearch = search => search
    .split('&')
    .filter(x => !x.includes('_limit') && !x.includes('_page') && !x.includes('_sort') && !x.includes('source'))
    .reduce((acc, curr) => {
      const arr = curr.split('=');
      const split = arr[0].split('_');
      const filter = split.length > 1 ? `_${split[1]}` : '=';
      acc.push({ attr: split[0], filter, value: arr[1] });

      return acc;
    }, []);

  /**
   * Generate the redirect URI when editing an entry
   * @type {String}
   */
  generateRedirectURI = () => {
    const {
      listPage: { filters, params },
    } = this.props;
    const filterSearch = filters.length > 0 ? `&${this.generateSearchFromFilters(filters)}` : '';

    return `?redirectUrl=/plugins/content-manager/${this.getCurrentModelName().toLowerCase()}?${this.generateSearchFromParams(
      params,
    )}&source=${this.getSource()}${filterSearch}`;
  };

  /**
   * Generate the search URI from params
   * @param  {Object} params
   * @return {String}
   */
  generateSearchFromParams = params =>
    Object.keys(params).reduce((acc, curr, index) => {
      if (index === 0) {
        acc = `${curr}=${params[curr]}`;
      } else {
        acc = `${acc}&${curr}=${params[curr]}`;
      }
      return acc;
    }, '');

  /**
   * Generate the search URI from filters
   * @param  {Array} filters Array of filter
   * @return {String}
   */
  generateSearchFromFilters = filters =>
    filters.reduce((acc, curr, index) => {
      const separator = curr.filter === '=' ? '' : '=';
      const base = `${curr.attr}${curr.filter}${separator}${curr.value}`;
      acc = index === 0 ? base : `${acc}&${base}`;

      return acc;
    }, '');

  /**
   *  Function to generate the Table's headers
   * @return {Array}
   */
  generateTableHeaders = () => {
    const currentSchema =
      get(this.props.schema, [this.getCurrentModelName()]) ||
      get(this.props.schema, ['plugins', this.getSource(), this.getCurrentModelName()]);
    const tableHeaders = map(currentSchema.list, value => ({
      name: value,
      label: currentSchema.fields[value].label,
      type: currentSchema.fields[value].type,
    }));

    tableHeaders.splice(0, 0, {
      name: this.getCurrentModel().primaryKey || 'id',
      label: 'Id',
      type: 'string',
    });

    return tableHeaders;
  };

  /**
   * [findPageSort description]
   * @param  {Object} props [description]
   * @return {String}      the model's primaryKey
   */
  findPageSort = props => {
    const {
      match: {
        params: { slug },
      },
    } = props;
    const source = this.getSource();
    const modelPrimaryKey = get(props.models, ['models', slug.toLowerCase(), 'primaryKey']);
    // Check if the model is in a plugin
    const pluginModelPrimaryKey = get(props.models.plugins, [
      source,
      'models',
      slug.toLowerCase(),
      'primaryKey',
    ]);

    return (
      getQueryParameters(props.location.search, '_sort') ||
      modelPrimaryKey ||
      pluginModelPrimaryKey ||
      'id'
    );
  };

  handleChangeParams = e => {
    const {
      history,
      listPage: { params },
    } = this.props;
    const search =
      e.target.name === 'params._limit'
        ? `_page=${params._page}&_limit=${e.target.value}&_sort=${
          params._sort
        }&source=${this.getSource()}`
        : `_page=${e.target.value}&_limit=${params._limit}&_sort=${
          params._sort
        }&source=${this.getSource()}`;
    this.props.history.push({
      pathname: history.pathname,
      search,
    });

    this.props.changeParams(e);
  };

  handleChangeSort = sort => {
    const target = {
      name: 'params._sort',
      value: sort,
    };

    const {
      listPage: { params },
    } = this.props;

    this.props.history.push({
      pathname: this.props.location.pathname,
      search: `?_page=${params._page}&_limit=${
        params._limit
      }&_sort=${sort}&source=${this.getSource()}`,
    });
    this.props.changeParams({ target });
  };

  handleDelete = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.deleteData(this.state.target, this.getCurrentModelName(), this.getSource());
    this.setState({ showWarning: false });
  };

  handleSubmit = e => {
    try {
      e.preventDefault();
    } catch (err) {
      // Silent
    } finally {
      this.props.submit();
    }
  };

  toggleModalWarning = e => {
    if (!isUndefined(e)) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        target: e.target.id,
      });
    }

    this.setState({ showWarning: !this.state.showWarning });
  };

  render() {
    const {
      addFilter,
      listPage,
      listPage: { appliedFilters, filters, params, showFilter },
      onChange,
      onClickRemove,
      onToggleFilters,
      removeAllFilters,
      removeFilter,
    } = this.props;
    const pluginHeaderActions = [
      {
        label: 'content-manager.containers.List.addAnEntry',
        labelValues: {
          entity: capitalize(this.props.match.params.slug) || 'Content Manager',
        },
        kind: 'primaryAddShape',
        onClick: () =>
          this.props.history.push({
            pathname: `${this.props.location.pathname}/create`,
            search: `?redirectUrl=/plugins/content-manager/${this.getCurrentModelName()}?_page=${
              params._page
            }&_limit=${params._limit}&_sort=${params._sort}&source=${this.getSource()}`,
          }),
      },
    ];

    return (
      <div>
        <FiltersPickWrapper
          addFilter={addFilter}
          appliedFilters={appliedFilters}
          close={onToggleFilters}
          modelName={this.getCurrentModelName()}
          onChange={onChange}
          onSubmit={this.handleSubmit}
          removeAllFilters={removeAllFilters}
          removeFilter={removeFilter}
          schema={this.getCurrentSchema()}
          show={showFilter}
        />
        <div className={cn('container-fluid', styles.containerFluid)}>
          {this.state.showHeader && (
            <PluginHeader
              actions={pluginHeaderActions}
              description={{
                id:
                  listPage.count > 1
                    ? 'content-manager.containers.List.pluginHeaderDescription'
                    : 'content-manager.containers.List.pluginHeaderDescription.singular',
                values: {
                  label: listPage.count,
                },
              }}
              title={{
                id: this.getCurrentModelName() || 'Content Manager',
              }}
            />
          )}
          <div className={cn('row', styles.row)}>
            <div className="col-md-12">
              <Div
                increaseMargin={!this.state.showHeader}
                decreaseMarginBottom={filters.length > 0}
              >
                <div className="row">
                  <AddFilterCTA onClick={onToggleFilters} />
                  {filters.map((filter, key) => (
                    <Filter key={key} filter={filter} index={key} onClick={onClickRemove} />
                  ))}
                </div>
              </Div>
            </div>
          </div>
          <div className={cn('row', styles.row)}>
            <div className="col-md-12">
              <Table
                records={listPage.records}
                route={this.props.match}
                routeParams={this.props.match.params}
                headers={this.generateTableHeaders()}
                onChangeSort={this.handleChangeSort}
                sort={params._sort}
                history={this.props.history}
                primaryKey={this.getCurrentModel().primaryKey || 'id'}
                handleDelete={this.toggleModalWarning}
                redirectUrl={this.generateRedirectURI()}
              />
              <PopUpWarning
                isOpen={this.state.showWarning}
                toggleModal={this.toggleModalWarning}
                content={{
                  title: 'content-manager.popUpWarning.title',
                  message: 'content-manager.popUpWarning.bodyMessage.contentType.delete',
                  cancel: 'content-manager.popUpWarning.button.cancel',
                  confirm: 'content-manager.popUpWarning.button.confirm',
                }}
                popUpWarningType="danger"
                onConfirm={this.handleDelete}
              />
              <PageFooter
                count={listPage.count}
                onChangeParams={this.handleChangeParams}
                params={listPage.params}
                style={{ marginTop: '2.9rem', padding: '0 15px 0 15px' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListPage.propTypes = {
  addFilter: PropTypes.func.isRequired,
  changeParams: PropTypes.func.isRequired,
  deleteData: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  listPage: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  models: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onToggleFilters: PropTypes.func.isRequired,
  removeAllFilters: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addFilter,
      changeParams,
      deleteData,
      getData,
      onChange,
      onClickRemove,
      onToggleFilters,
      removeAllFilters,
      removeFilter,
      setParams,
      submit,
    },
    dispatch,
  );
}

const mapStateToProps = createStructuredSelector({
  listPage: makeSelectListPage(),
  models: makeSelectModels(),
  schema: makeSelectSchema(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'listPage', reducer });
const withSaga = injectSaga({ key: 'listPage', saga });

export default compose(withReducer, withSaga, withConnect)(ListPage);
