import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  margin: 24px 0 23px 0;
  text-align: center;
  .info {
    position: absolute;
    display: none;
    top: 10px;
    left: calc(50% + 46px);
    > span {
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #007eff;
      font-size: 11px;
      font-weight: 700;
    }
  }
  button {
    &:not(.isOpen):hover + .info {
      display: block;
    }
  }
`;

export default Wrapper;
