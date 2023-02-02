import React, { useEffect } from 'react';
import { FormikProvider, useFormik, Form } from 'formik';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';

import { SettingsPageTitle } from '@strapi/helper-plugin';
import { Button, ContentLayout, HeaderLayout, Layout, Loader, Main } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { Stages } from './components/Stages';
import { reducer, initialState } from './reducer';
import { REDUX_NAMESPACE } from './constants';
import { useInjectReducer } from '../../../../../../admin/src/hooks/useInjectReducer';
import { useReviewWorkflows } from './hooks/useReviewWorkflows';
import { setWorkflows } from './actions';
import { getWorkflowValidationSchema } from './utils/getWorkflowValidationSchema';

export function ReviewWorkflowsPage() {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { workflows: workflowsData, updateWorkflowStages, refetchWorkflow } = useReviewWorkflows();
  const {
    status,
    clientState: {
      currentWorkflow: { data: currentWorkflow, isDirty: currentWorkflowIsDirty },
    },
  } = useSelector((state) => state?.[REDUX_NAMESPACE] ?? initialState);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: currentWorkflow,
    async onSubmit() {
      await updateWorkflowStages(currentWorkflow.id, currentWorkflow.stages);
      refetchWorkflow();
    },
    validationSchema: getWorkflowValidationSchema({ formatMessage }),
    validateOnChange: false,
  });

  useInjectReducer(REDUX_NAMESPACE, reducer);

  useEffect(() => {
    dispatch(setWorkflows({ status: workflowsData.status, data: workflowsData.data }));
  }, [workflowsData.status, workflowsData.data, dispatch]);

  if (!formik.values?.stages) {
    return null;
  }

  return (
    <Layout>
      <SettingsPageTitle
        name={formatMessage({
          id: 'Settings.review-workflows.page.title',
          defaultMessage: 'Review Workflows',
        })}
      />
      <Main tabIndex={-1}>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <HeaderLayout
              primaryAction={
                <Button
                  startIcon={<Check />}
                  type="submit"
                  size="M"
                  disabled={!currentWorkflowIsDirty}
                >
                  {formatMessage({
                    id: 'global.save',
                    defaultMessage: 'Save',
                  })}
                </Button>
              }
              title={formatMessage({
                id: 'Settings.review-workflows.page.title',
                defaultMessage: 'Review Workflows',
              })}
              subtitle={formatMessage(
                {
                  id: 'Settings.review-workflows.page.subtitle',
                  defaultMessage: '{count, plural, one {# stage} other {# stages}}',
                },
                { count: currentWorkflow.stages?.length ?? 0 }
              )}
            />
            <ContentLayout>
              {status === 'loading' ? (
                <Loader>
                  {formatMessage({
                    id: 'Settings.review-workflows.page.isLoading',
                    defaultMessage: 'Workflow is loading',
                  })}
                </Loader>
              ) : (
                <Stages stages={formik.values.stages} />
              )}
            </ContentLayout>
          </Form>
        </FormikProvider>
      </Main>
    </Layout>
  );
}
