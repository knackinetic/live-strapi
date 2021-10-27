import React from 'react';
import DeleteIcon from '@strapi/icons/DeleteIcon';
import { IconButton } from '@strapi/design-system/IconButton';
import { Box } from '@strapi/design-system/Box';
import { stopPropagation } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

const DeleteButton = ({ tokenName, onClickDelete }) => {
  const { formatMessage } = useIntl();

  return (
    <Box paddingLeft={1} {...stopPropagation}>
      <IconButton
        onClick={onClickDelete}
        label={formatMessage(
          {
            id: 'app.component.table.delete',
            defaultMessage: 'Delete {target}',
          },
          { target: `${tokenName}` }
        )}
        noBorder
        icon={<DeleteIcon />}
      />
    </Box>
  );
};

DeleteButton.propTypes = {
  tokenName: PropTypes.string.isRequired,
  onClickDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
