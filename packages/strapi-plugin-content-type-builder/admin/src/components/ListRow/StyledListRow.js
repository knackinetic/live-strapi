/**
 *
 * StyedListRow
 *
 */

import styled from 'styled-components';

import { colors } from 'strapi-helper-plugin';

const StyedListRow = styled.tr`
  background-color: transparent;
  cursor: pointer;
  p {
    margin-bottom: 0;
  }
  img {
    width: 35px;
  }
  button {
    cursor: pointer;
  }
  td:first-of-type {
    padding-left: 3rem;
    position: relative;
    img {
      width: 35px;
      height: 20px;
      position: absolute;
      top: calc(50% - 10px);
      left: 3rem;
    }
    img + p {
      width: 237px;
      padding-left: calc(3rem + 35px);
    }
  }
  td:nth-child(2) {
    width: 25rem;
    p {
      font-weight: 500;
      text-transform: capitalize;
    }
  }
  td:last-child {
    text-align: right;
  }
  &:hover {
    background-color: ${colors.grey};
  }
`;

export default StyedListRow;
