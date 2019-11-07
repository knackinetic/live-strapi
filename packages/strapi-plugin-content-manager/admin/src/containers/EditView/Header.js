import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header as PluginHeader } from '@buffetjs/custom';

import {
  PopUpWarning,
  request,
  templateObject,
  useGlobalContext,
} from 'strapi-helper-plugin';
import { get } from 'lodash';
import pluginId from '../../pluginId';
import useDataManager from '../../hooks/useDataManager';

const getRequestUrl = path => `/${pluginId}/explorer/${path}`;

const Header = () => {
  const [showWarningCancel, setWarningCancel] = useState(false);
  const [showWarningDelete, setWarningDelete] = useState(false);

  const { formatMessage } = useGlobalContext();
  const { id } = useParams();
  const {
    initialData,
    layout,
    redirectToPreviousPage,
    resetData,
    setIsSubmitting,
    slug,
    source,
  } = useDataManager();

  const currentContentTypeMainField = get(
    layout,
    ['settings', 'mainField'],
    'id'
  );
  const isCreatingEntry = id === 'create';

  const headerTitle = isCreatingEntry
    ? formatMessage({
        id: `${pluginId}.containers.Edit.pluginHeader.title.new`,
      })
    : templateObject({ mainField: currentContentTypeMainField }, initialData)
        .mainField;

  const getHeaderActions = () => {
    const headerActions = [
      {
        onClick: () => {
          toggleWarningCancel();
        },
        color: 'cancel',
        title: formatMessage({
          id: `${pluginId}.containers.Edit.reset`,
        }),
        type: 'button',
      },
      {
        color: 'success',
        title: formatMessage({
          id: `${pluginId}.containers.Edit.submit`,
        }),
        type: 'submit',
      },
    ];

    if (!isCreatingEntry) {
      headerActions.unshift({
        title: formatMessage({
          id: 'app.utils.delete',
        }),
        color: 'delete',
        onClick: () => {
          toggleWarningDelete();
        },
        type: 'button',
      });
    }

    return headerActions;
  };

  const headerProps = {
    title: {
      label: headerTitle,
    },
    actions: getHeaderActions(),
  };

  const toggleWarningCancel = () => setWarningCancel(prevState => !prevState);
  const toggleWarningDelete = () => setWarningDelete(prevState => !prevState);

  const handleConfirmReset = () => {
    toggleWarningCancel();
    resetData();
  };
  const handleConfirmDelete = async () => {
    toggleWarningDelete();
    setIsSubmitting();

    try {
      await request(getRequestUrl(`${slug}/${id}`), {
        method: 'DELETE',
        params: { source },
      });

      strapi.notification.success(`${pluginId}.success.record.delete`);
      redirectToPreviousPage();
    } catch (err) {
      setIsSubmitting(false);
      strapi.notification.error(`${pluginId}.error.record.delete`);
    }
  };

  return (
    <>
      <PluginHeader {...headerProps} />
      <PopUpWarning
        isOpen={showWarningCancel}
        toggleModal={toggleWarningCancel}
        content={{
          title: `${pluginId}.popUpWarning.title`,
          message: `${pluginId}.popUpWarning.warning.cancelAllSettings`,
          cancel: `${pluginId}.popUpWarning.button.cancel`,
          confirm: `${pluginId}.popUpWarning.button.confirm`,
        }}
        popUpWarningType="danger"
        onConfirm={handleConfirmReset}
      />
      <PopUpWarning
        isOpen={showWarningDelete}
        toggleModal={toggleWarningDelete}
        content={{
          title: `${pluginId}.popUpWarning.title`,
          message: `${pluginId}.popUpWarning.bodyMessage.contentType.delete`,
          cancel: `${pluginId}.popUpWarning.button.cancel`,
          confirm: `${pluginId}.popUpWarning.button.confirm`,
        }}
        popUpWarningType="danger"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default Header;
