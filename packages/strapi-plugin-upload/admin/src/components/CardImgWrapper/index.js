import styled from 'styled-components';
import PropTypes from 'prop-types';

const CardImgWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: ${({ small }) => (small ? 'calc(156 / 245 * 100%)' : 'calc(397 / 431 * 100%)')};
  border-radius: 2px;
  background-color: #f6f6f6;
  overflow: hidden;

  .card-control-wrapper {
    display: none;
  }

  &:hover {
    .card-control-wrapper {
      display: flex;
      z-index: 1045;
    }
  }

  ${({ hasError }) =>
    hasError &&
    `
      background: #F2F3F4;
      border: 1px solid #FF5D00;
    `}

  ${({ checked }) =>
    checked &&
    `
      .card-control-wrapper {
        display: flex;
        z-index: 1050;
      }
  `}
`;

CardImgWrapper.defaultProps = {
  checked: false,
  hasError: false,
  small: false,
};

CardImgWrapper.propTypes = {
  checked: PropTypes.bool,
  hasError: PropTypes.bool,
  small: PropTypes.bool,
};

export default CardImgWrapper;
