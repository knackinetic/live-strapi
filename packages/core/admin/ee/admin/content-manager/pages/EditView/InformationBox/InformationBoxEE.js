import React from 'react';
import {
  ReactSelect,
  useCMEditViewDataManager,
  useAPIErrorHandler,
  useFetchClient,
  useNotification,
} from '@strapi/helper-plugin';
import { Field, FieldLabel, FieldError, Flex, Loader } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { useReviewWorkflows } from '../../../../pages/SettingsPage/pages/ReviewWorkflows/hooks/useReviewWorkflows';
import Information from '../../../../../../admin/src/content-manager/pages/EditView/Information';

const ATTRIBUTE_NAME = 'strapi_reviewWorkflows_stage';

export function InformationBoxEE() {
  const {
    initialData,
    isCreatingEntry,
    layout: { uid },
    isSingleType,
  } = useCMEditViewDataManager();
  const { put } = useFetchClient();
  const activeWorkflowStage = initialData?.[ATTRIBUTE_NAME] ?? null;
  const hasReviewWorkflowsEnabled = Object.prototype.hasOwnProperty.call(
    initialData,
    ATTRIBUTE_NAME
  );
  const { formatMessage } = useIntl();
  const { formatAPIError } = useAPIErrorHandler();
  const toggleNotification = useNotification();

  const { workflows: { data: workflows, isLoading: workflowIsLoading } = {} } =
    useReviewWorkflows();
  // TODO: this works only as long as we support one workflow
  const workflow = workflows?.[0] ?? null;

  const { error, isLoading, mutateAsync } = useMutation(
    async ({ entityId, stageId, uid }) => {
      const typeSlug = isSingleType ? 'single-types' : 'collection-types';

      const {
        data: { data },
      } = await put(`/admin/content-manager/${typeSlug}/${uid}/${entityId}/stage`, {
        data: { id: stageId },
      });

      return data;
    },
    {
      onSuccess() {
        toggleNotification({
          type: 'success',
          message: { id: 'notification.success.saved', defaultMessage: 'Saved' },
        });
      },
    }
  );

  // if entities are created e.g. through lifecycle methods
  // they may not have a stage assigned. Updating the entity won't
  // set the default stage either which may lead to entities that
  // do not have a stage assigned for a while. By displaying an
  // error by default we are trying to nudge users into assigning a stage.
  const initialStageNullError =
    activeWorkflowStage === null &&
    !workflowIsLoading &&
    !isCreatingEntry &&
    formatMessage({
      id: 'content-manager.reviewWorkflows.stage.select.placeholder',
      defaultMessage: 'Select a stage',
    });
  const formattedMutationError = error && formatAPIError(error);
  const formattedError = formattedMutationError || initialStageNullError || null;

  const handleStageChange = async ({ value: stageId }) => {
    try {
      await mutateAsync({
        entityId: initialData.id,
        stageId,
        uid,
      });
    } catch (error) {
      // react-query@v3: the error doesn't have to be handled here
      // see: https://github.com/TanStack/query/issues/121
    }
  };

  return (
    <Information.Root>
      <Information.Title />

      {!isCreatingEntry && hasReviewWorkflowsEnabled && (
        <Field error={formattedError} name={ATTRIBUTE_NAME} id={ATTRIBUTE_NAME}>
          <Flex direction="column" gap={2} alignItems="stretch">
            <FieldLabel>
              {formatMessage({
                id: 'content-manager.reviewWorkflows.stage.label',
                defaultMessage: 'Review stage',
              })}
            </FieldLabel>

            <ReactSelect
              components={{
                LoadingIndicator: () => <Loader small />,
              }}
              defaultValue={{ value: activeWorkflowStage?.id, label: activeWorkflowStage?.name }}
              error={formattedError}
              inputId={ATTRIBUTE_NAME}
              isDisabled={isCreatingEntry}
              isLoading={isLoading}
              isSearchable={false}
              isClearable={false}
              name={ATTRIBUTE_NAME}
              onChange={handleStageChange}
              options={
                workflow ? workflow.stages.map(({ id, name }) => ({ value: id, label: name })) : []
              }
            />

            <FieldError />
          </Flex>
        </Field>
      )}

      <Information.Body />
    </Information.Root>
  );
}
