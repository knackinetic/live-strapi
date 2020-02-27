import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import getTrad from '../../utils/getTrad';

import Wrapper from './Wrapper';
import SortButton from './SortButton';
import SortList from '../SortList';

const SortPicker = ({ onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const orders = {
    created_at_asc: 'created_at:ASC',
    created_at_desc: 'created_at:DESC',
    name_asc: 'name:ASC',
    name_desc: 'name:DESC',
    updated_at_asc: 'updated_at:ASC',
    updated_at_desc: 'updated_at:DESC',
  };

  const handleChange = value => {
    onChange({ target: { name: '_sort', value } });

    hangleToggle();
  };

  const hangleToggle = () => {
    setIsOpen(v => !v);
  };

  return (
    <Wrapper>
      <SortButton onClick={hangleToggle} isActive={isOpen}>
        <FormattedMessage id={getTrad('sort.label')} />
      </SortButton>
      <SortList
        isShown={isOpen}
        list={orders}
        selectedItem={value}
        onClick={handleChange}
      />
    </Wrapper>
  );
};

SortPicker.defaultProps = {
  onChange: () => {},
  value: null,
};

SortPicker.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default SortPicker;
