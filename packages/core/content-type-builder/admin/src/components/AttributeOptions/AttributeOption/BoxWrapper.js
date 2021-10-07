import styled from 'styled-components';
import { Box } from '@strapi/parts/Box';

const BoxWrapper = styled(Box)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  &:hover {
    background: ${({ theme }) => theme.colors.primary100};
    border: 1px solid ${({ theme }) => theme.colors.primary200};
  }
`;

export default BoxWrapper;
