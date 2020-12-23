import styled from 'styled-components';

const SettingsPageWrapper = styled.div`
  padding: 25px 10px;
  margin-top: 33px;
  border-radius: ${({ theme }) => theme.main.sizes.borderRadius};
  box-shadow: 0 2px 4px ${({ theme }) => theme.main.colors.darkGrey};
  background: ${({ theme }) => theme.main.colors.white};
`;

export default SettingsPageWrapper;
