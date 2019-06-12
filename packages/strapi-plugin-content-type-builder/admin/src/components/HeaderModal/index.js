/**
 *
 * HeaderModal
 *
 */

// import React from 'react';
// import PropTypes from 'prop-types';

// import styles from './styles.scss';

// function HeaderModal({ children }) {
//   return (
//     <div className={styles.headerModal}>
//       {children}
//     </div>
//   );
// }

// HeaderModal.defaultProps = {
//   children: null,
// };

// HeaderModal.propTypes = {
//   children: PropTypes.node,
// };

// export default HeaderModal;

/**
 *
 * HeaderModal
 *
 */

import styled from 'styled-components';

import colors from '../../assets/styles/colors';
import sizes from '../../assets/styles/sizes';

const HeaderModal = styled.div`
  color: ${colors.black};
  font-weight: bold;
  section {
    padding: 0 ${sizes.margin * 3}px;
    display: flex;
    &:first-of-type {
      background-color: ${colors.lightGrey};
      font-size: 1.3rem;
      height: 61px;
    }
    &:not(:first-of-type) {
      height: 65px;
      font-size: 1.8rem;
      justify-content: space-between;
      position: relative;
      hr {
        position: absolute;
        left: ${sizes.margin * 3}px;
        bottom: 0;
        width: calc(100% - ${sizes.margin * 6}px);
        height: 1px;
        background: ${colors.brightGrey};
        border: 0;
        margin: 0;
      }
      span {
        padding-top: 16px;
      }
      .settings-tabs {
        position: absolute;
        right: ${sizes.margin * 3}px;
        bottom: -${sizes.margin * 0.1}px;
      }
    }
  }
`;

export default HeaderModal;
