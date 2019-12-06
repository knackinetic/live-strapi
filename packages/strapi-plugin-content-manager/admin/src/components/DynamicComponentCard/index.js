import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Wrapper from './Wrapper';

const DynamicComponentCard = ({
  children,
  componentUid,
  friendlyName,
  icon,
  onClick,
}) => {
  return (
    <Wrapper
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        console.log('oooo');
        onClick(componentUid);
      }}
    >
      <button className="component-icon">
        {/* <i className={`fa fa-${icon}`} /> */}
        <FontAwesomeIcon icon={icon} />
      </button>

      <div className="component-uid">
        <span>{friendlyName}</span>
      </div>
      {children}
    </Wrapper>
  );
};

DynamicComponentCard.defaultProps = {
  children: null,
  friendlyName: '',
  onClick: () => {},
  icon: 'smile',
};

DynamicComponentCard.propTypes = {
  children: PropTypes.node,
  componentUid: PropTypes.string.isRequired,
  friendlyName: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
};

export default DynamicComponentCard;
