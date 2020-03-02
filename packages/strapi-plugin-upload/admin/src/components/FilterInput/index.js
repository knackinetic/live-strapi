/**
 *
 * InputWithAutoFocus that programatically manage the autofocus of another one
 */

import React from 'react';
import PropTypes from 'prop-types';

import { DateTime } from '@buffetjs/custom';
import { InputText, Select } from '@buffetjs/core';

import SizeInput from '../SizeInput';

const getInputType = type => {
  switch (type) {
    case 'datetime':
      return DateTime;
    case 'size':
      return SizeInput;
    case 'enum':
      return Select;
    default:
      return InputText;
  }
};

function Input({ type, ...rest }) {
  const Component = getInputType(type);

  return <Component {...rest} autoComplete="off" />;
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Input;
