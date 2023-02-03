import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Typography } from '@strapi/design-system/Typography';
import { Tbody, Tr, Td } from '@strapi/design-system/Table';
import { Flex } from '@strapi/design-system/Flex';
import {
  RelativeTime,
  onRowClick,
  pxToRem,
  DynamicTable,
  useQueryParams,
  useTracking,
} from '@strapi/helper-plugin';
import DeleteButton from './DeleteButton';
import UpdateButton from './UpdateButton';
import ReadButton from './ReadButton';

const Table = ({ headers, onConfirmDelete, isLoading, tokens, permissions }) => {
  const { canDelete, canUpdate, canRead } = permissions;
  const withBulkActions = canDelete || canUpdate || canRead;
  const [{ query }] = useQueryParams();
  const [, sortOrder] = query.sort.split(':');
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { trackUsage } = useTracking();

  const sortedTokens = tokens.sort((a, b) => {
    const comparaison = a.name.localeCompare(b.name);

    return sortOrder === 'DESC' ? -comparaison : comparaison;
  });
  console.log('isLoading', isLoading);

  return (
    <DynamicTable
      headers={headers}
      contentType="api-tokens"
      rows={tokens}
      withBulkActions={withBulkActions}
      isLoading={isLoading}
      onConfirmDelete={onConfirmDelete}
    >
      <Tbody>
        {sortedTokens.map((token) => {
          return (
            <Tr
              key={token.id}
              {...onRowClick({
                fn() {
                  trackUsage('willEditTokenFromList');
                  push(`${pathname}/${token.id}`);
                },
                condition: canUpdate,
              })}
            >
              <Td>
                <Typography textColor="neutral800" fontWeight="bold">
                  {token.name}
                </Typography>
              </Td>
              <Td maxWidth={pxToRem(250)}>
                <Typography textColor="neutral800" ellipsis>
                  {token.description}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  <RelativeTime timestamp={new Date(token.createdAt)} />
                </Typography>
              </Td>
              <Td>
                {token.lastUsedAt && (
                  <Typography textColor="neutral800">
                    <RelativeTime timestamp={new Date(token.lastUsedAt)} />
                  </Typography>
                )}
              </Td>

              {withBulkActions && (
                <Td>
                  <Flex justifyContent="end">
                    {canUpdate && <UpdateButton tokenName={token.name} tokenId={token.id} />}
                    {!canUpdate && canRead && (
                      <ReadButton tokenName={token.name} tokenId={token.id} />
                    )}
                    {canDelete && (
                      <DeleteButton
                        tokenName={token.name}
                        onClickDelete={() => onConfirmDelete(token.id)}
                      />
                    )}
                  </Flex>
                </Td>
              )}
            </Tr>
          );
        })}
      </Tbody>
    </DynamicTable>
  );
};

export default Table;

Table.propTypes = {
  tokens: PropTypes.array,
  permissions: PropTypes.shape({
    canRead: PropTypes.bool,
    canDelete: PropTypes.bool,
    canUpdate: PropTypes.bool,
  }).isRequired,
};

Table.defaultProps = {
  tokens: [],
};
