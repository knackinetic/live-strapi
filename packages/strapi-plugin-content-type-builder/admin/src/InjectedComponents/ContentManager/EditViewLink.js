/**
 *
 * EditViewLink
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { LiLink, useGlobalContext, WithPermissions } from 'strapi-helper-plugin';
import pluginPermissions from '../../utils/permissions';

// Create link from content-type-builder to content-manager
function EditViewLink(props) {
  const { currentEnvironment, emitEvent } = useGlobalContext();
  // Retrieve URL from props
  const url = `/plugins/content-type-builder/content-types/${props.getModelName()}`;

  if (currentEnvironment !== 'development') {
    return null;
  }

  if (props.getModelName() === 'strapi::administrator') {
    return null;
  }

  return (
    <WithPermissions permissions={pluginPermissions.main}>
      <LiLink
        {...props}
        url={url}
        onClick={() => {
          emitEvent('willEditEditLayout');
        }}
      />
    </WithPermissions>
  );
}

EditViewLink.propTypes = {
  currentEnvironment: PropTypes.string.isRequired,
  getModelName: PropTypes.func.isRequired,
};

export default EditViewLink;
