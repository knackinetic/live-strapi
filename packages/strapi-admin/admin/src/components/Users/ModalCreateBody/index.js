import React, { forwardRef, useReducer, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { ModalSection, request } from 'strapi-helper-plugin';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Padded, Text } from '@buffetjs/core';
import { Col, Row } from 'reactstrap';
import checkFormValidity from '../../../utils/checkFormValidity';
import SelectRoles from '../SelectRoles';
import form from './utils/form';
import schema from './utils/schema';
import { initialState, reducer } from './reducer';
import init from './init';
import Input from './Input';
import Wrapper from './Wrapper';
import MagicLink from '../MagicLink';

// This component accepts a ref so we can have access to the submit handler.
const ModalCreateBody = forwardRef(
  ({ isDisabled, onSubmit, registrationToken, showMagicLink }, ref) => {
    const [reducerState, dispatch] = useReducer(reducer, initialState, init);
    const { formErrors, modifiedData } = reducerState;
    const buttonSubmitRef = useRef(null);

    useImperativeHandle(ref, () => ({
      submit: () => {
        buttonSubmitRef.current.click();
      },
    }));

    const handleChange = ({ target: { name, value } }) => {
      dispatch({
        type: 'ON_CHANGE',
        keys: name,
        value,
      });
    };

    const handleSubmit = async e => {
      e.persist();
      e.preventDefault();
      const errors = await checkFormValidity(modifiedData, schema);

      if (!errors) {
        try {
          const requestURL = '/admin/users';

          const { data } = await request(requestURL, { method: 'POST', body: modifiedData });

          onSubmit(e, data);
        } catch (err) {
          const message = get(err, ['response', 'payload', 'message'], 'An error occured');

          strapi.notification.error(message);
        }

        // TODO post request with errors handling
      }

      dispatch({
        type: 'SET_ERRORS',
        errors: errors || {},
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        {/* TODO magic link with token when api ready */}
        {showMagicLink && (
          <ModalSection>
            <MagicLink registrationToken={registrationToken} />
          </ModalSection>
        )}
        <ModalSection>
          <Padded top size="18px">
            <Text fontSize="xs" color="grey" fontWeight="bold" textTransform="uppercase">
              <FormattedMessage id="app.components.Users.ModalCreateBody.block-title.details">
                {txt => txt}
              </FormattedMessage>
            </Text>
          </Padded>
        </ModalSection>
        <ModalSection>
          <Wrapper>
            <Padded top size="20px">
              <Row>
                {Object.keys(form).map((inputName, i) => (
                  <Input
                    key={inputName}
                    {...form[inputName]}
                    autoFocus={i === 0}
                    disabled={isDisabled}
                    error={formErrors[inputName]}
                    name={inputName}
                    onChange={handleChange}
                    value={modifiedData[inputName]}
                  />
                ))}
              </Row>
            </Padded>
          </Wrapper>
        </ModalSection>
        <ModalSection>
          <Padded top size="3px">
            <Text fontSize="xs" color="grey" fontWeight="bold" textTransform="uppercase">
              <FormattedMessage id="app.components.Users.ModalCreateBody.block-title.roles">
                {txt => txt}
              </FormattedMessage>
            </Text>
          </Padded>
        </ModalSection>
        <ModalSection>
          <Wrapper>
            <Padded top size="12px">
              <Row>
                <Col xs="6">
                  <SelectRoles
                    isDisabled={isDisabled}
                    name="roles"
                    onChange={handleChange}
                    value={modifiedData.roles}
                    error={formErrors.roles}
                  />
                </Col>
              </Row>
            </Padded>
          </Wrapper>
        </ModalSection>
        <button type="submit" style={{ display: 'none' }} ref={buttonSubmitRef}>
          hidden button to use the native form event
        </button>
      </form>
    );
  }
);

ModalCreateBody.defaultProps = {
  isDisabled: false,
  onSubmit: e => e.preventDefault(),
  registrationToken: '',
  showMagicLink: false,
};

ModalCreateBody.propTypes = {
  isDisabled: PropTypes.bool,
  onSubmit: PropTypes.func,
  registrationToken: PropTypes.string,
  showMagicLink: PropTypes.bool,
};

export default ModalCreateBody;
