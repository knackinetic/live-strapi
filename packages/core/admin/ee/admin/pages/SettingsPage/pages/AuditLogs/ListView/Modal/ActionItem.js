import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Typography } from '@strapi/design-system';

const ActionItem = ({ actionLabel, actionName }) => {
  return (
    <Flex direction="column" alignItems="baseline" gap={1}>
      <Typography textColor="neutral600" variant="sigma">
        {actionLabel}
      </Typography>
      <Typography textColor="neutral600">{actionName}</Typography>
    </Flex>
  );
};

ActionItem.propTypes = {
  actionLabel: PropTypes.string.isRequired,
  actionName: PropTypes.string.isRequired,
};

export default ActionItem;
