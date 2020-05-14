import React from 'react';
import { Checkbox, Padded } from '@buffetjs/core';
import { useIntl } from 'react-intl';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import AuthLink from '../AuthLink';
import Button from '../Button';
import Input from '../Input';
import Logo from '../Logo';
import Section from '../Section';
import Box from '../Box';

const Login = ({ formErrors, modifiedData, onChange, onSubmit, requestError }) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Section textAlign="center">
        <Logo />
      </Section>
      <Section>
        <Padded top size="24px">
          <Box errorMessage={get(requestError, 'errorMessage', null)}>
            <form onSubmit={onSubmit}>
              <Input
                autoFocus
                error={formErrors.email}
                label="Auth.form.email.label"
                name="email"
                onChange={onChange}
                placeholder="Auth.form.email.placeholder"
                type="email"
                validations={{ required: true }}
                value={modifiedData.email}
              />
              <Input
                error={formErrors.password}
                label="Auth.form.password.label"
                name="password"
                onChange={onChange}
                type="password"
                validations={{ required: true }}
                value={modifiedData.password}
              />
              <Checkbox
                type="checkbox"
                message={formatMessage({ id: 'Auth.form.rememberMe.label' })}
                name="rememberMe"
                onChange={onChange}
                value={modifiedData.rememberMe}
              />
              <Padded top size="27px">
                <Button type="submit" color="primary">
                  {formatMessage({ id: 'Auth.form.button.login' })}
                </Button>
              </Padded>
            </form>
          </Box>
        </Padded>
      </Section>
      <AuthLink label="Auth.link.forgot-password" to="/auth/forgot-password" />
    </>
  );
};

Login.defaultProps = {
  onSubmit: e => e.preventDefault(),
  requestError: null,
};

Login.propTypes = {
  formErrors: PropTypes.object.isRequired,
  modifiedData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  requestError: PropTypes.object,
};

export default Login;
