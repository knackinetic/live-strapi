import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Text } from '@buffetjs/core';
import CollapseLabel from '../CollapseLabel';
import Wrapper from './Wrapper';

const RowLabel = ({
  children,
  isCollapsable,
  label,
  onChange,
  onClick,
  checkboxName,
  someChecked,
  textColor,
  value,
  width,
}) => {
  return (
    <Wrapper width={width}>
      <Checkbox name={checkboxName} onChange={onChange} someChecked={someChecked} value={value} />
      <CollapseLabel
        title={label}
        alignItems="center"
        isCollapsable={isCollapsable}
        onClick={onClick}
      >
        <Text
          color={textColor}
          ellipsis
          fontSize="xs"
          fontWeight="bold"
          lineHeight="20px"
          textTransform="uppercase"
        >
          {label}
        </Text>
        {children}
      </CollapseLabel>
    </Wrapper>
  );
};

RowLabel.defaultProps = {
  children: null,
  checkboxName: '',
  onChange: () => {},
  value: false,
  someChecked: false,
  isCollapsable: false,
  textColor: 'grey',
  width: '18rem',
};

RowLabel.propTypes = {
  checkboxName: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  isCollapsable: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  someChecked: PropTypes.bool,
  textColor: PropTypes.string,
  value: PropTypes.bool,
  width: PropTypes.string,
};

export default memo(RowLabel);
