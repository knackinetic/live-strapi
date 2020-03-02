import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Select } from '@buffetjs/core';
import { getFilterType } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';

import reducer, { initialState } from './reducer';

import filters from './utils/filtersForm';

import Wrapper from './Wrapper';
import Button from './Button';
import InputWrapper from './InputWrapper';

import Input from '../FilterInput';

const FiltersCard = ({ onChange }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { name, filter, value } = state.toJS();

  const type = filters[name].type;
  const filtersOptions = getFilterType(type);

  const getDefaultValue = name => filters[name].defaultValue;

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'ON_CHANGE',
      name,
      value,
    });

    if (name === 'name') {
      dispatch({
        type: 'RESET_VALUE',
        value: getDefaultValue(value),
      });
    }
  };

  const addFilter = () => {
    onChange({ target: { value: state.toJS() } });

    dispatch({
      type: 'RESET_FORM',
    });
  };

  const renderFiltersOptions = () => {
    return filtersOptions.map(({ id, value }) => (
      <FormattedMessage id={id} key={id}>
        {msg => <option value={value}>{msg}</option>}
      </FormattedMessage>
    ));
  };

  return (
    <Wrapper>
      <InputWrapper>
        <Select
          onChange={handleChange}
          name="name"
          options={Object.keys(filters)}
          value={name}
        />
      </InputWrapper>
      <InputWrapper>
        <Select
          onChange={handleChange}
          name="filter"
          options={renderFiltersOptions()}
          value={filter}
        />
      </InputWrapper>
      <InputWrapper>
        <Input
          type={type}
          onChange={handleChange}
          name="value"
          options={['image', 'video', 'files']}
          value={value}
        />
      </InputWrapper>
      <Button icon onClick={addFilter}>
        <FormattedMessage id={getTrad('filter.add')} />
      </Button>
    </Wrapper>
  );
};

FiltersCard.defaultProps = {
  onChange: () => {},
};

FiltersCard.propTypes = {
  onChange: PropTypes.func,
};

export default FiltersCard;
