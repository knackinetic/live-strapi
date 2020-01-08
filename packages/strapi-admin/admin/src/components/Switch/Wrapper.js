/**
 *
 * Wrapper
 *
 */

import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  .button {
    width: 30px;
    height: 18px;
    position: relative;
    z-index: 2;
    margin-right: 12px;
    .button-rect {
      position: relative;
      width: 30px;
      height: 12px;
      background-color: #faa684;
      border-radius: 6px;
      margin-top: 3px;
      z-index: -2;
    }
    .button-circle {
      background-color: #f1f1f1;
      position: absolute;
      top: 0;
      right: -1px;
      width: 17px;
      height: 17px;
      border-radius: 9px;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        margin: -1px;
        border-radius: inherit;
        background: linear-gradient(to bottom, #f1f1f1, #e7e7e7);
      }
    }
  }
  input {
    z-index: 3;
    cursor: pointer;
  }
  input:checked + .button {
    .button-rect {
      background-color: #6dbb1a;
    }
    .button-circle {
      left: -1px;
    }
  }
  .button,
  p {
    display: inline-block;
    vertical-align: top;
  }
`;

export default Wrapper;
