import React, { useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Header as PluginHeader } from '@buffetjs/custom';
import { get, isEqual, toString } from 'lodash';

import { PopUpWarning, request, templateObject, useGlobalContext } from 'strapi-helper-plugin';

import pluginId from '../../pluginId';
import useDataManager from '../../hooks/useDataManager';

const getRequestUrl = path => `/${pluginId}/explorer/${path}`;

const Header = () => {
  const [showWarningCancel, setWarningCancel] = useState(false);
  const [showWarningDelete, setWarningDelete] = useState(false);
  const { formatMessage } = useIntl();
  const formatMessageRef = useRef(formatMessage);
  const { emitEvent } = useGlobalContext();
  const {
    deleteSuccess,
    initialData,
    isCreatingEntry,
    isSingleType,
    layout,
    modifiedData,
    redirectToPreviousPage,
    resetData,
    setIsSubmitting,
    slug,
    clearData,
  } = useDataManager();

  const currentContentTypeMainField = useMemo(() => get(layout, ['settings', 'mainField'], 'id'), [
    layout,
  ]);
  const currentContentTypeName = useMemo(() => get(layout, ['schema', 'info', 'name']), [layout]);
  const didChangeData = useMemo(() => {
    return !isEqual(initialData, modifiedData);
  }, [initialData, modifiedData]);
  const apiID = useMemo(() => layout.apiID, [layout.apiID]);

  /* eslint-disable indent */
  const entryHeaderTitle = isCreatingEntry
    ? formatMessage({
        id: `${pluginId}.containers.Edit.pluginHeader.title.new`,
      })
    : templateObject({ mainField: currentContentTypeMainField }, initialData).mainField;
  /* eslint-enable indent */

  const headerTitle = useMemo(() => {
    return isSingleType ? currentContentTypeName : entryHeaderTitle;
  }, [currentContentTypeName, entryHeaderTitle, isSingleType]);

  const headerActions = useMemo(() => {
    const headerActions = [
      {
        disabled: !didChangeData,
        onClick: () => {
          toggleWarningCancel();
        },
        color: 'cancel',
        label: formatMessageRef.current({
          id: `${pluginId}.containers.Edit.reset`,
        }),
        type: 'button',
        style: {
          paddingLeft: 15,
          paddingRight: 15,
          fontWeight: 600,
        },
      },
      {
        disabled: !didChangeData,
        color: 'success',
        label: formatMessageRef.current({
          id: `${pluginId}.containers.Edit.submit`,
        }),
        type: 'submit',
        style: {
          minWidth: 150,
          fontWeight: 600,
        },
      },
    ];

    if (!isCreatingEntry) {
      headerActions.unshift({
        label: formatMessageRef.current({
          id: 'app.utils.delete',
        }),
        color: 'delete',
        onClick: () => {
          toggleWarningDelete();
        },
        type: 'button',
        style: {
          paddingLeft: 15,
          paddingRight: 15,
          fontWeight: 600,
        },
      });
    }

    return headerActions;
  }, [didChangeData, isCreatingEntry]);

  const headerProps = useMemo(() => {
    return {
      title: {
        label: toString(headerTitle),
      },
      content: `${formatMessageRef.current({ id: `${pluginId}.api.id` })} : ${apiID}`,
      actions: headerActions,
    };
  }, [headerActions, headerTitle, apiID]);

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
      emitEvent('willDeleteEntry');

      await request(getRequestUrl(`${slug}/${initialData.id}`), {
        method: 'DELETE',
      });

      strapi.notification.success(`${pluginId}.success.record.delete`);
      deleteSuccess();

      emitEvent('didDeleteEntry');

      if (!isSingleType) {
        redirectToPreviousPage();
      } else {
        clearData();
      }
    } catch (err) {
      setIsSubmitting(false);
      emitEvent('didNotDeleteEntry', { error: err });
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
