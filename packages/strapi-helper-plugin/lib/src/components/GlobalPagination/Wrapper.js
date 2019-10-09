import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: -2px;
  justify-content: flex-end;

  > div {
    display: inline-flex;
    flex-direction: row;
    min-width: 120px;
    height: 32px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #e2e8f3;
    overflow: hidden;
  }

  .paginationNavigator {
    position: relative;
    width: 36px;
    text-align: center;
    line-height: 30px;
    font-size: 2rem;

    &:first-of-type {
      margin-right: 10px;

      &:after {
        position: absolute;
        content: '';
        top: 3px;
        bottom: 3px;
        right: 0;
        width: 1px;
        background: #f1f1f2;
      }
    }

    &:last-of-type {
      margin-left: 10px;

      &:before {
        position: absolute;
        content: '';
        top: 3px;
        bottom: 3px;
        left: 0;
        width: 1px;
        background: #f1f1f2;
      }
    }

    i {
      color: #97999e;
    }

    &[disabled] {
      i {
        opacity: 0.3;
      }
    }
  }

  .navWrapper {
    min-width: 48px;

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
      height: 100%;
      margin: 0 -5px;
      padding: 0;
    }

    li {
      position: relative;
      min-width: 15px;
      margin: 0 5px !important;
      text-align: center;
      line-height: 32px;
      color: #333740;

      a {
        color: #333740;
        font-size: 1.3rem;

        &:hover {
          &:after {
            position: absolute;
            content: '';
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: #1c5de7;
          }
        }

        &:hover,
        &:visited,
        &:focus,
        &:active {
          text-decoration: none;
          color: #333740;
        }
      }
    }
  }

  .navUl {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 0;
    padding: 0;
  }

  .navLiActive {
    font-weight: 800;

    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #1c5de7;
    }
  }
`;

export default Wrapper;
