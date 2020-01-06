/**
 *
 * EditView
 *
 */

import React, { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { isEmpty, isEqual } from 'lodash';
import { Header } from '@buffetjs/custom';
import { Play } from '@buffetjs/icons';
import { request, useGlobalContext } from 'strapi-helper-plugin';

import reducer, { initialState } from './reducer';
import form from './utils/form';

import Inputs from '../../../components/Inputs';
import TriggerContainer from '../../../components/TriggerContainer';
import Wrapper from './Wrapper';

function EditView() {
  const { formatMessage } = useGlobalContext();
  const [reducerState, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();

  const {
    modifiedWebhook,
    initialWebhook,
    isTriggering,
    triggerResponse,
  } = reducerState.toJS();

  const { name } = modifiedWebhook;

  const id = location.pathname.split('/')[3];
  const isCreatingWebhook = id === 'create';

  useEffect(() => {
    if (!isCreatingWebhook) {
      fetchData();
    }
  }, [fetchData, isCreatingWebhook]);

  const fetchData = async () => {
    try {
      const { data } = await request(`/admin/webhooks/${id}`, {
        method: 'GET',
      });

      dispatch({
        type: 'GET_DATA_SUCCEEDED',
        data,
      });
    } catch (err) {
      if (err.code !== 20) {
        strapi.notification.error('notification.error');
      }
    }
  };

  // Header props
  const headerTitle = isCreatingWebhook
    ? formatMessage({
        id: `Settings.webhooks.create`,
      })
    : name;

  const actionsAreDisabled = isEqual(initialWebhook, modifiedWebhook);

  const handleTrigger = async () => {
    dispatch({
      type: 'ON_TRIGGER',
    });

    try {
      const response = await request(`/admin/webhooks/${id}/trigger`, {
        method: 'POST',
      });

      dispatch({
        type: 'TRIGGER_SUCCEEDED',
        response,
      });
    } catch (err) {
      const { message } = err;

      dispatch({
        type: 'TRIGGER_SUCCEEDED',
        response: { error: message },
      });

      if (err.code !== 20) {
        strapi.notification.error('notification.error');
      }
    }
  };

  const actions = [
    {
      color: 'primary',
      disabled:
        isCreatingWebhook || (!isCreatingWebhook && !actionsAreDisabled),
      type: 'button',
      label: formatMessage({
        id: `Settings.webhooks.trigger`,
      }),
      onClick: () => {
        handleTrigger();
      },
      style: {
        paddingRight: 15,
        paddingLeft: 15,
      },
      icon: <Play width="6px" height="7px" />,
    },
    {
      onClick: () => {},
      color: 'cancel',
      disabled: actionsAreDisabled,
      type: 'button',
      label: formatMessage({
        id: `app.components.Button.reset`,
      }),
      style: {
        paddingRight: 20,
        paddingLeft: 20,
      },
    },
    {
      onClick: () => {},
      color: 'success',
      disabled: actionsAreDisabled,
      type: 'submit',
      label: formatMessage({
        id: `app.components.Button.save`,
      }),
      style: {
        minWidth: 140,
      },
    },
  ];
  const headerProps = {
    title: {
      label: headerTitle,
    },
    actions: actions,
  };

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'ON_CHANGE',
      keys: name.split('.'),
      value,
    });
  };

  const handleClick = () => {
    dispatch({
      type: 'ADD_NEW_HEADER',
      keys: ['headers'],
    });
  };

  return (
    <Wrapper>
      <Header {...headerProps} />
      {(isTriggering || !isEmpty(triggerResponse)) && (
        <div className="trigger-wrapper">
          <TriggerContainer
            isPending={isTriggering}
            response={triggerResponse}
          />
        </div>
      )}
      <div className="form-wrapper">
        <div className="form-card">
          <div className="row">
            {Object.keys(form).map(key => {
              return (
                <div key={key} className={form[key].styleName}>
                  <Inputs
                    {...form[key]}
                    // customInputs={{
                    //   headers: HeadersInput,
                    // }}
                    name={key}
                    onChange={handleChange}
                    onClick={handleClick}
                    validations={form[key].validations}
                    value={modifiedWebhook[key] || form[key].value}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default EditView;
