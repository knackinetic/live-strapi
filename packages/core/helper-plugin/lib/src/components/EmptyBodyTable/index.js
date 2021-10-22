import React from 'react';
import { Tbody, Tr, Td } from '@strapi/parts/Table';
import { Box } from '@strapi/parts/Box';
import { Flex } from '@strapi/parts/Flex';
import { Loader } from '@strapi/parts/Loader';
import PropTypes from 'prop-types';
import EmptyStateLayout from '../EmptyStateLayout';

const EmptyBodyTable = ({ colSpan, isLoading, ...rest }) => {
  if (isLoading) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={colSpan}>
            <Flex justifyContent="center">
              <Box padding={11} background="neutral0">
                <Loader>Loading content...</Loader>
              </Box>
            </Flex>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      <Tr>
        <Td colSpan={colSpan}>
          <EmptyStateLayout {...rest} hasRadius={false} shadow="" />
        </Td>
      </Tr>
    </Tbody>
  );
};

EmptyBodyTable.defaultProps = {
  action: undefined,
  colSpan: 1,
  content: undefined,
  icon: undefined,
  isLoading: false,
};

EmptyBodyTable.propTypes = {
  action: PropTypes.any,
  colSpan: PropTypes.number,
  content: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
    values: PropTypes.object,
  }),
  icon: PropTypes.oneOf(['document', 'media', 'permissions']),
  isLoading: PropTypes.bool,
};

export default EmptyBodyTable;
