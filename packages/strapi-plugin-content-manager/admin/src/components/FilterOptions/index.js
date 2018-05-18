/**
 *
 * FilterOptions
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import InputSelect from 'components/InputSelect/Loadable';
import InputText from 'components/InputText/Loadable';

import Add from './Add';
import Div from './Div';
import Remove from './Remove';

const FILTER_TYPES = [
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.equals',
    value: '=',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.not_equals',
    value: '_ne',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.lower',
    value: '_lt',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.lower_equal',
    value: '_lte',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.greater',
    value: '_gt',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.greater_equal',
    value: '_gte',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.contains',
    value: '_contains',
  },
  {
    id: 'content-manager.components.FilterOptions.FILTER_TYPES.containss',
    value: '_containss',
  },
];

function FilterOptions({ index, onClickAdd, onClickRemove, showAddButton, showRemoveButton }) {
  const selectStyle = { minHeight: '30px', minWidth: '170px', maxWidth: '200px' };

  return (
    <Div>
      {showRemoveButton && <Remove type="button" onClick={() => onClickRemove(index)} /> }
      <InputSelect
        onChange={() => {}}
        name=""
        value=""
        selectOptions={[]}
        style={showRemoveButton ? selectStyle : Object.assign(selectStyle, { marginLeft: '30px' })}
      />

      <InputSelect
        onChange={() => {}}
        name=""
        value=""
        selectOptions={FILTER_TYPES}
        style={{ minHeight: '30px', minWidth: '130px', maxWidth: '160px', marginLeft: '10px', marginRight: '10px' }}
      />

      <InputText
        onChange={() => {}}
        name=""
        value="ezez"
        selectOptions={[]}
        style={{ height: '30px', width: '200px', marginRight: '10px' }}
      />

      {showAddButton && <Add type="button" onClick={onClickAdd} />}
    </Div>
  );
}

FilterOptions.defaultProps = {
  index: 0,
  onClickAdd: () => {},
  onClickRemove: () => {},
  showAddButton: false,
  showRemoveButton: false,
};

FilterOptions.propTypes = {
  index: PropTypes.number,
  onClickAdd: PropTypes.func,
  onClickRemove: PropTypes.func,
  showAddButton: PropTypes.bool,
  showRemoveButton: PropTypes.bool,
};

export default FilterOptions;
