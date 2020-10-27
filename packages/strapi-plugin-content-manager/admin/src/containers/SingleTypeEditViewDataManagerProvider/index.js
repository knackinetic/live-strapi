import React, { useCallback, useEffect, useMemo, useRef, useReducer, useState } from 'react';
import { cloneDeep, get, isEmpty, isEqual, set } from 'lodash';
import PropTypes from 'prop-types';
import { Prompt, Redirect, useParams, useLocation, useHistory } from 'react-router-dom';
import {
  LoadingIndicatorPage,
  request,
  useGlobalContext,
  useUser,
  OverlayBlocker,
} from 'strapi-helper-plugin';
import EditViewDataManagerContext from '../../contexts/EditViewDataManager';
import { getTrad } from '../../utils';
import pluginId from '../../pluginId';
import init from './init';
import reducer, { initialState } from './reducer';
import {
  cleanData,
  createDefaultForm,
  createYupSchema,
  getFieldsActionMatchingPermissions,
  getFilesToUpload,
  getYupInnerErrors,
  removePasswordFieldsFromData,
} from './utils';

const getRequestUrl = path => `/${pluginId}/explorer/${path}`;

const EditViewDataManagerProvider = ({
  allLayoutData,
  allowedActions: { canCreate },
  children,
  isSingleType,
  redirectToPreviousPage,
  slug,
}) => {
  const [reducerState, dispatch] = useReducer(reducer, initialState, init);
  const { id } = useParams();
  const { state } = useLocation();

  const { push } = useHistory();
  // Here in case of a 403 response when fetching data we will either redirect to the previous page
  // Or to the homepage if there's no state in the history stack
  const from = get(state, 'from', '/');
  const {
    formErrors,
    initialData,
    isLoading,
    modifiedData,
    modifiedDZName,
    shouldCheckErrors,
  } = reducerState.toJS();
  const [isCreatingEntry, setIsCreatingEntry] = useState(true);
  const [status, setStatus] = useState('resolved');

  const currentContentTypeLayout = get(allLayoutData, ['contentType'], {});

  const hasDraftAndPublish = useMemo(() => {
    return get(currentContentTypeLayout, ['schema', 'options', 'draftAndPublish'], false);
  }, [currentContentTypeLayout]);

  const shouldNotRunValidations = useMemo(() => {
    return hasDraftAndPublish && !initialData.published_at;
  }, [hasDraftAndPublish, initialData.published_at]);

  const { emitEvent, formatMessage } = useGlobalContext();
  const emitEventRef = useRef(emitEvent);
  const userPermissions = useUser();

  const {
    createActionAllowedFields,
    readActionAllowedFields,
    updateActionAllowedFields,
  } = useMemo(() => {
    return getFieldsActionMatchingPermissions(userPermissions, slug);
  }, [userPermissions, slug]);

  const shouldRedirectToHomepageWhenCreatingEntry = useMemo(() => {
    if (isLoading) {
      return false;
    }

    if (!isCreatingEntry) {
      return false;
    }

    if (canCreate === false) {
      return true;
    }

    return false;
  }, [canCreate, isCreatingEntry, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      checkFormErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldCheckErrors]);

  useEffect(() => {
    if (shouldRedirectToHomepageWhenCreatingEntry) {
      strapi.notification.info(getTrad('permissions.not-allowed.create'));
    }
  }, [shouldRedirectToHomepageWhenCreatingEntry]);

  const cleanReceivedDataFromPasswords = useCallback(
    data => {
      return removePasswordFieldsFromData(
        data,
        allLayoutData.contentType,
        allLayoutData.components
      );
    },
    [allLayoutData.components, allLayoutData.contentType]
  );

  useEffect(() => {
    const componentsDataStructure = Object.keys(allLayoutData.components).reduce((acc, current) => {
      acc[current] = createDefaultForm(
        get(allLayoutData, ['components', current, 'schema', 'attributes'], {}),
        allLayoutData.components
      );

      return acc;
    }, {});

    const contentTypeDataStructure = createDefaultForm(
      currentContentTypeLayout.schema.attributes,
      allLayoutData.components
    );

    dispatch({
      type: 'SET_DEFAULT_DATA_STRUCTURES',
      componentsDataStructure,
      contentTypeDataStructure,
    });
  }, [allLayoutData, currentContentTypeLayout.schema.attributes]);

  // Check if creation mode or editing mode
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchData = async signal => {
      // TODO in reducer
      dispatch({ type: 'GET_DATA' });

      try {
        const data = await request(getRequestUrl(slug), { method: 'GET', signal });

        setIsCreatingEntry(false);

        dispatch({
          type: 'GET_DATA_SUCCEEDED',
          data: cleanReceivedDataFromPasswords(data),
        });
      } catch (err) {
        const responseStatus = get(err, 'response.status', null);

        // Creating an st
        if (responseStatus === 404) {
          dispatch({ type: 'INITIALIZE_FORM' });
          setIsCreatingEntry(true);
        }

        if (responseStatus === 403) {
          strapi.notification.info(getTrad('permissions.not-allowed.update'));

          push(from);
        }
      }
    };

    fetchData(signal);

    return () => abortController.abort();
  }, [cleanReceivedDataFromPasswords, from, push, slug]);

  const addComponentToDynamicZone = useCallback((keys, componentUid, shouldCheckErrors = false) => {
    emitEventRef.current('didAddComponentToDynamicZone');

    dispatch({
      type: 'ADD_COMPONENT_TO_DYNAMIC_ZONE',
      keys: keys.split('.'),
      componentUid,
      shouldCheckErrors,
    });
  }, []);

  const addNonRepeatableComponentToField = useCallback((keys, componentUid) => {
    dispatch({
      type: 'ADD_NON_REPEATABLE_COMPONENT_TO_FIELD',
      keys: keys.split('.'),
      componentUid,
    });
  }, []);

  const addRelation = useCallback(({ target: { name, value } }) => {
    dispatch({
      type: 'ADD_RELATION',
      keys: name.split('.'),
      value,
    });
  }, []);

  const addRepeatableComponentToField = useCallback(
    (keys, componentUid, shouldCheckErrors = false) => {
      dispatch({
        type: 'ADD_REPEATABLE_COMPONENT_TO_FIELD',
        keys: keys.split('.'),
        componentUid,
        shouldCheckErrors,
      });
    },
    []
  );

  const yupSchema = useMemo(() => {
    const options = { isCreatingEntry, isDraft: shouldNotRunValidations, isFromComponent: false };

    return createYupSchema(
      currentContentTypeLayout,
      {
        components: allLayoutData.components || {},
      },
      options
    );
  }, [
    allLayoutData.components,
    currentContentTypeLayout,
    isCreatingEntry,
    shouldNotRunValidations,
  ]);

  const checkFormErrors = useCallback(
    async (dataToSet = {}) => {
      let errors = {};
      const updatedData = cloneDeep(modifiedData);

      if (!isEmpty(updatedData)) {
        set(updatedData, dataToSet.path, dataToSet.value);
      }

      try {
        // Validate the form using yup
        await yupSchema.validate(updatedData, { abortEarly: false });
      } catch (err) {
        errors = getYupInnerErrors(err);

        if (modifiedDZName) {
          errors = Object.keys(errors).reduce((acc, current) => {
            const dzName = current.split('.')[0];

            if (dzName !== modifiedDZName) {
              acc[current] = errors[current];
            }

            return acc;
          }, {});
        }
      }

      dispatch({
        type: 'SET_ERRORS',
        errors,
      });
    },
    [modifiedDZName, modifiedData, yupSchema]
  );

  const handleChange = useCallback(
    ({ target: { name, value, type } }, shouldSetInitialValue = false) => {
      let inputValue = value;

      // Empty string is not a valid date,
      // Set the date to null when it's empty
      if (type === 'date' && value === '') {
        inputValue = null;
      }

      if (type === 'password' && !value) {
        dispatch({
          type: 'REMOVE_PASSWORD_FIELD',
          keys: name.split('.'),
        });

        return;
      }

      // Allow to reset enum
      if (type === 'select-one' && value === '') {
        inputValue = null;
      }

      // Allow to reset number input
      if (type === 'number' && value === '') {
        inputValue = null;
      }

      dispatch({
        type: 'ON_CHANGE',
        keys: name.split('.'),
        value: inputValue,
        shouldSetInitialValue,
      });
    },
    []
  );

  const createFormData = useCallback(
    data => {
      // Set the loading state in the plugin header
      const filesToUpload = getFilesToUpload(modifiedData);
      // Remove keys that are not needed
      // Clean relations
      const cleanedData = cleanData(data, currentContentTypeLayout, allLayoutData.components);

      const formData = new FormData();

      formData.append('data', JSON.stringify(cleanedData));

      // We don't do upload anymore since we are using the ML in the CM
      // however, I am leaving the code here just in case we need it sometime and it also a great
      // example on how to do upload upon entry creation/edition.
      Object.keys(filesToUpload).forEach(key => {
        const files = filesToUpload[key];

        files.forEach(file => {
          formData.append(`files.${key}`, file);
        });
      });

      return formData;
    },
    [allLayoutData.components, currentContentTypeLayout, modifiedData]
  );

  const trackerProperty = useMemo(() => {
    if (!hasDraftAndPublish) {
      return {};
    }

    return shouldNotRunValidations ? { status: 'draft' } : {};
  }, [hasDraftAndPublish, shouldNotRunValidations]);

  const displayErrors = useCallback(err => {
    const errorPayload = err.response.payload;
    console.error(errorPayload);

    let errorMessage = get(errorPayload, ['message'], 'Bad Request');

    // TODO handle errors correctly when back-end ready
    if (Array.isArray(errorMessage)) {
      errorMessage = get(errorMessage, ['0', 'messages', '0', 'id']);
    }

    if (typeof errorMessage === 'string') {
      strapi.notification.error(errorMessage);
    }
  }, []);

  const onPost = useCallback(
    async data => {
      const formData = createFormData(data);
      const endPoint = getRequestUrl(slug);

      try {
        // Show a loading button in the EditView/Header.js && lock the app => no navigation
        setStatus('submit-pending');

        const response = await request(
          endPoint,
          { method: 'POST', headers: {}, body: formData },
          false,
          false
        );

        emitEventRef.current('didCreateEntry', trackerProperty);
        strapi.notification.success(getTrad('success.record.save'));
        // Enable navigation and remove loaders
        setStatus('resolved');

        dispatch({ type: 'SUBMIT_SUCCEEDED', data: cleanReceivedDataFromPasswords(response) });

        setIsCreatingEntry(false);
      } catch (err) {
        displayErrors(err);
        emitEventRef.current('didNotCreateEntry', { error: err, trackerProperty });
        // Enable navigation and remove loaders
        setStatus('resolved');
      }
    },

    [cleanReceivedDataFromPasswords, createFormData, displayErrors, slug, trackerProperty]
  );

  const onPut = useCallback(
    async data => {
      const formData = createFormData(data);
      const endPoint = getRequestUrl(`${slug}/${data.id}`);

      try {
        // Show a loading button in the EditView/Header.js && lock the app => no navigation
        setStatus('submit-pending');
        emitEventRef.current('willEditEntry', trackerProperty);

        const response = await request(
          endPoint,
          { method: 'PUT', headers: {}, body: formData },
          false,
          false
        );

        emitEventRef.current('didEditEntry', { trackerProperty });

        // Enable navigation and remove loaders
        setStatus('resolved');

        dispatch({ type: 'SUBMIT_SUCCEEDED', data: cleanReceivedDataFromPasswords(response) });
      } catch (err) {
        displayErrors(err);

        emitEventRef.current('didNotEditEntry', { error: err, trackerProperty });
        // Enable navigation and remove loaders
        setStatus('resolved');
      }
    },
    [cleanReceivedDataFromPasswords, createFormData, displayErrors, slug, trackerProperty]
  );

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      let errors = {};

      // First validate the form
      try {
        await yupSchema.validate(modifiedData, { abortEarly: false });

        if (isCreatingEntry) {
          onPost(modifiedData);
        } else {
          onPut(modifiedData);
        }
      } catch (err) {
        console.error('ValidationError');
        console.error(err);

        errors = getYupInnerErrors(err);
      }

      dispatch({
        type: 'SET_FORM_ERRORS',
        errors,
      });
    },
    [isCreatingEntry, modifiedData, onPost, onPut, yupSchema]
  );

  const handlePublish = useCallback(async () => {
    // Create yup schema here's we need to apply all the validations
    const schema = createYupSchema(
      currentContentTypeLayout,
      {
        components: get(allLayoutData, 'components', {}),
      },
      { isCreatingEntry, isDraft: false, isFromComponent: false }
    );
    let errors = {};

    try {
      // Validate the form using yup
      await schema.validate(modifiedData, { abortEarly: false });

      // Show a loading button in the EditView/Header.js
      setStatus('publish-pending');

      try {
        emitEventRef.current('willPublishEntry');

        // Time to actually send the data
        const data = await request(
          getRequestUrl(`${slug}/publish/${modifiedData.id}`),
          {
            method: 'POST',
          },
          false,
          false
        );

        emitEventRef.current('didPublishEntry');

        setStatus('resolved');

        dispatch({
          type: 'SUBMIT_SUCCEEDED',
          data: cleanReceivedDataFromPasswords(data),
        });

        strapi.notification.success(`${pluginId}.success.record.publish`);
      } catch (err) {
        displayErrors(err);
        setStatus('resolved');
      }
    } catch (err) {
      console.error('ValidationError');
      console.error(err);

      errors = getYupInnerErrors(err);
    }

    dispatch({
      type: 'SET_FORM_ERRORS',
      errors,
    });
  }, [
    allLayoutData,
    cleanReceivedDataFromPasswords,
    currentContentTypeLayout,
    displayErrors,
    isCreatingEntry,
    modifiedData,
    slug,
  ]);

  const handleUnpublish = useCallback(async () => {
    try {
      setStatus('unpublish-pending');

      emitEventRef.current('willUnpublishEntry');

      const data = await request(
        getRequestUrl(`${slug}/unpublish/${id || modifiedData.id}`),
        {
          method: 'POST',
        },
        false,
        false
      );

      emitEventRef.current('didUnpublishEntry');
      setStatus('resolved');

      dispatch({
        type: 'UNPUBLISH_SUCCESS',
        data,
      });
      strapi.notification.success(`${pluginId}.success.record.unpublish`);
    } catch (err) {
      console.error({ err });
      setStatus('resolved');

      const errorMessage = get(err, ['response', 'payload', 'message'], 'SERVER ERROR');
      strapi.notification.error(errorMessage);
    }
  }, [id, modifiedData, slug]);

  const shouldCheckDZErrors = useCallback(
    dzName => {
      const doesDZHaveError = Object.keys(formErrors).some(key => key.split('.')[0] === dzName);
      const shouldCheckErrors = !isEmpty(formErrors) && doesDZHaveError;

      return shouldCheckErrors;
    },
    [formErrors]
  );

  const moveComponentDown = useCallback(
    (dynamicZoneName, currentIndex) => {
      emitEventRef.current('changeComponentsOrder');

      dispatch({
        type: 'MOVE_COMPONENT_DOWN',
        dynamicZoneName,
        currentIndex,
        shouldCheckErrors: shouldCheckDZErrors(dynamicZoneName),
      });
    },
    [shouldCheckDZErrors]
  );

  const moveComponentUp = useCallback(
    (dynamicZoneName, currentIndex) => {
      emitEventRef.current('changeComponentsOrder');

      dispatch({
        type: 'MOVE_COMPONENT_UP',
        dynamicZoneName,
        currentIndex,
        shouldCheckErrors: shouldCheckDZErrors(dynamicZoneName),
      });
    },
    [shouldCheckDZErrors]
  );

  const moveComponentField = useCallback((pathToComponent, dragIndex, hoverIndex) => {
    dispatch({
      type: 'MOVE_COMPONENT_FIELD',
      pathToComponent,
      dragIndex,
      hoverIndex,
    });
  }, []);

  const moveRelation = useCallback((dragIndex, overIndex, name) => {
    dispatch({
      type: 'MOVE_FIELD',
      dragIndex,
      overIndex,
      keys: name.split('.'),
    });
  }, []);

  const onRemoveRelation = useCallback(keys => {
    dispatch({
      type: 'REMOVE_RELATION',
      keys,
    });
  }, []);

  const removeComponentFromDynamicZone = useCallback(
    (dynamicZoneName, index) => {
      emitEventRef.current('removeComponentFromDynamicZone');

      dispatch({
        type: 'REMOVE_COMPONENT_FROM_DYNAMIC_ZONE',
        dynamicZoneName,
        index,
        shouldCheckErrors: shouldCheckDZErrors(dynamicZoneName),
      });
    },
    [shouldCheckDZErrors]
  );
  const removeComponentFromField = useCallback((keys, componentUid) => {
    dispatch({
      type: 'REMOVE_COMPONENT_FROM_FIELD',
      keys: keys.split('.'),
      componentUid,
    });
  }, []);

  const removeRepeatableField = useCallback((keys, componentUid) => {
    dispatch({
      type: 'REMOVE_REPEATABLE_FIELD',
      keys: keys.split('.'),
      componentUid,
    });
  }, []);

  const deleteSuccess = () => {
    dispatch({
      type: 'DELETE_SUCCEEDED',
    });
  };

  const resetData = () => {
    dispatch({
      type: 'RESET_DATA',
    });
  };

  const clearData = useCallback(() => {
    if (isSingleType) {
      setIsCreatingEntry(true);
    }

    dispatch({
      type: 'SET_DEFAULT_MODIFIED_DATA_STRUCTURE',
      contentTypeDataStructure: {},
    });
  }, [isSingleType]);

  const triggerFormValidation = () => {
    dispatch({
      type: 'TRIGGER_FORM_VALIDATION',
    });
  };

  const overlayBlockerParams = useMemo(
    () => ({
      children: <div />,
      noGradient: true,
    }),
    []
  );

  // Redirect the user to the homepage if he is not allowed to create a document
  if (shouldRedirectToHomepageWhenCreatingEntry) {
    return <Redirect to="/" />;
  }

  return (
    <EditViewDataManagerContext.Provider
      value={{
        addComponentToDynamicZone,
        addNonRepeatableComponentToField,
        addRelation,
        addRepeatableComponentToField,
        allLayoutData,
        checkFormErrors,
        clearData,
        createActionAllowedFields,
        deleteSuccess,
        formErrors,
        hasDraftAndPublish,
        initialData,
        isCreatingEntry,
        isSingleType,
        shouldNotRunValidations,
        status,
        layout: currentContentTypeLayout,
        modifiedData,
        moveComponentDown,
        moveComponentField,
        moveComponentUp,
        moveRelation,
        onChange: handleChange,
        onPublish: handlePublish,
        onUnpublish: handleUnpublish,
        onRemoveRelation,
        readActionAllowedFields,
        redirectToPreviousPage,
        removeComponentFromDynamicZone,
        removeComponentFromField,
        removeRepeatableField,
        resetData,
        slug,
        triggerFormValidation,
        updateActionAllowedFields,
      }}
    >
      <>
        <OverlayBlocker
          key="overlayBlocker"
          isOpen={status !== 'resolved'}
          {...overlayBlockerParams}
        />
        {isLoading ? (
          <LoadingIndicatorPage />
        ) : (
          <>
            <Prompt
              when={!isEqual(modifiedData, initialData)}
              message={formatMessage({ id: 'global.prompt.unsaved' })}
            />
            <form onSubmit={handleSubmit}>{children}</form>
          </>
        )}
      </>
    </EditViewDataManagerContext.Provider>
  );
};

EditViewDataManagerProvider.defaultProps = {
  redirectToPreviousPage: () => {},
};

EditViewDataManagerProvider.propTypes = {
  allowedActions: PropTypes.object.isRequired,
  allLayoutData: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  isSingleType: PropTypes.bool.isRequired,
  redirectToPreviousPage: PropTypes.func,
  slug: PropTypes.string.isRequired,
};

export default EditViewDataManagerProvider;
