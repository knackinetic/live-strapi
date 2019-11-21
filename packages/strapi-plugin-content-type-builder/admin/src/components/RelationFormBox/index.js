import React from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';
import getTrad from '../../utils/getTrad';
import Wrapper from './Wrapper';

const RelationFormBox = ({
  disabled,
  error,
  header,
  isMain,
  name,
  onChange,
  value,
}) => {
  const { formatMessage } = useGlobalContext();

  return (
    <Wrapper>
      <div className="box-header">
        {isMain ? (
          <p>
            <i className="fa fa-caret-square-o-right" />
            {header}
          </p>
        ) : (
          <div>picker</div>
        )}
      </div>
      <div className="box-body">
        <Inputs
          autoFocus={isMain}
          disabled={disabled}
          label={formatMessage({
            id: getTrad('form.attribute.item.defineRelation.fieldName'),
          })}
          error={error}
          type="text"
          onChange={onChange}
          name={name}
          value={value}
        />
      </div>
    </Wrapper>
  );
};

RelationFormBox.defaultProps = {
  disabled: false,
  error: null,
  header: null,
  isMain: false,
  onChange: () => {},
  value: '',
};

RelationFormBox.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  header: PropTypes.string,
  isMain: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RelationFormBox;
