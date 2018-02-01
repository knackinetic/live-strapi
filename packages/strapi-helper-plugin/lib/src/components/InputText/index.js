import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import cn from 'classnames';

import styles from './styles.scss';

function InputText(props) {
  return (
    <FormattedMessage id={props.placeholder} defaultMessage={props.placeholder}>
      {(message) => (
        <input
          autoFocus={props.autoFocus}
          className={cn(
            styles.input,
            'form-control',
            !props.deactivateErrorHighlight && !isEmpty(props.errors) && 'is-invalid',
            !isEmpty(props.className) && props.className,
          )}
          disabled={props.disabled}
          id={props.name}
          name={props.name}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          placeholder={message}
          style={props.style}
          tabIndex={props.tabIndex}
          type="text"
          value={props.value}
        />
      )}
    </FormattedMessage>
  )
}

InputText.defaultProps = {
  autoFocus: false,
  className: '',
  deactivateErrorHighlight: false,
  disabled: false,
  errors: [],
  onBlur: () => {},
  onFocus: () => {},
  placeholder: 'app.utils.placeholder.defaultMessage',
  style: {},
  tabIndex: '0',
};

InputText.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  disabled: PropTypes.bool,
  errors: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default InputText;
