import styled, { css } from 'styled-components';

/* eslint-disable */

const Wrapper = styled.div`
  max-height: calc(100% - 70px);
  min-height: 294px;
  overflow: auto;
  padding: 20px 20px 0 20px;
  font-size: 16px;
  background-color: #fff;
  line-height: 24px !important;
  font-family: 'Lato';
  cursor: text;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-block-start: 10px;
    margin-block-end: 10px;
    font-family: 'Lato';
  }

  h1 {
    font-size: 36px;
    font-weight: 600;
  }

  h2 {
    font-size: 30px;
    font-weight: 500;
  }

  h3 {
    font-size: 24px;
    font-weight: 500;
  }

  h4 {
    font-size: 20px;
    font-weight: 500;
  }

  blockquote {
    margin-top: 41px;
    margin-bottom: 34px;
    font-size: 16px;
    font-weight: 400;
    border-left: 5px solid #eee;
    font-style: italic;
    padding: 10px 20px;
  }

  img {
    max-width: 100%;
  }

  > table {
    font-size: 13px;
    thead {
      background: rgb(243, 243, 243);
      tr {
        height: 43px;
      }
    }
    tr {
      border: 1px solid #c6cbd1;
    }
    th,
    td {
      padding: 0 25px;
      border: 1px solid #c6cbd1;
      border-bottom: 0;
      border-top: 0;
    }

    tbody {
      tr {
        height: 54px;
      }
    }
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    color: #212529;
  }

  pre {
    padding: 16px;
    margin-top: 26px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 3px;

    code {
      background-color: transparent;
    }

    span {
      font-family: Consolas, monospace !important;
      font-size: 12px;
      line-height: 16px;
      white-space: pre;
    }
  }

  ${({ isFullscreen }) => {
    if (isFullscreen) {
      return css`
        max-height: calc(100% - 70px) !important;
        margin-bottom: 0;
        margin-top: 9px;
        padding: 10px 20px;
        overflow: auto;
      `;
    }
  }}
`;

export default Wrapper;
