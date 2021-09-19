import React, { useCallback, useMemo } from 'react';
import { get } from 'lodash';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { TableLabel, Box, Row, Checkbox, Grid, GridItem } from '@strapi/parts';
import CogIcon from '@strapi/icons/Cog';
import { useIntl } from 'react-intl';
import { useUsersPermissions } from '../../../../contexts/UsersPermissionsContext';

const Border = styled.div`
  flex: 1;
  align-self: center;
  border-top: 1px solid ${({ theme }) => theme.colors.neutral150};
`;

const activeCheckboxWrapperStyles = css`
  background: ${props => props.theme.colors.primary100};
  svg {
    opacity: 1;
  }
`;

const CheckboxWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    opacity: 0;
    path {
      fill: ${props => props.theme.colors.primary600};
    }
  }

  /* Show active style both on hover and when the action is selected */
  ${props => props.isActive && activeCheckboxWrapperStyles}
  &:hover {
    ${activeCheckboxWrapperStyles}
  }
`;

const SubCategory = ({ subCategory }) => {
  const { formatMessage } = useIntl();
  const {
    onChange,
    onChangeSelectAll,
    onSelectedAction,
    selectedAction,
    modifiedData,
  } = useUsersPermissions();

  const currentScopedModifiedData = useMemo(() => {
    return get(modifiedData, subCategory.name, {});
  }, [modifiedData, subCategory]);

  const hasAllActionsSelected = useMemo(() => {
    return Object.values(currentScopedModifiedData).every(action => action.enabled === true);
  }, [currentScopedModifiedData]);

  const hasSomeActionsSelected = useMemo(() => {
    return (
      Object.values(currentScopedModifiedData).some(action => action.enabled === true) &&
      !hasAllActionsSelected
    );
  }, [currentScopedModifiedData, hasAllActionsSelected]);

  const handleChangeSelectAll = useCallback(
    ({ target: { name } }) => {
      onChangeSelectAll({ target: { name, value: !hasAllActionsSelected } });
    },
    [hasAllActionsSelected, onChangeSelectAll]
  );

  const isActionSelected = useCallback(
    actionName => {
      return selectedAction === actionName;
    },
    [selectedAction]
  );

  return (
    <Box>
      <Row justifyContent="space-between" alignItems="center">
        <Box paddingRight={4}>
          <TableLabel textColor="neutral600">{subCategory.label}</TableLabel>
        </Box>
        <Border />
        <Box paddingLeft={4}>
          <Checkbox
            name={subCategory.name}
            value={hasAllActionsSelected}
            onValueChange={value =>
              handleChangeSelectAll({ target: { name: subCategory.name, value } })}
            indeterminate={hasSomeActionsSelected}
          >
            {formatMessage({ id: 'app.utils.select-all', defaultMessage: 'Select all' })}
          </Checkbox>
        </Box>
      </Row>
      <Row paddingTop={6} paddingBottom={6}>
        <Grid gap={2} style={{ flex: 1 }}>
          {subCategory.actions.map(action => {
            const name = `${action.name}.enabled`;

            return (
              <GridItem col={6} key={action.name}>
                <CheckboxWrapper isActive={isActionSelected(action.name)} padding={2} hasRadius>
                  <Checkbox
                    value={get(modifiedData, name, false)}
                    name={name}
                    onValueChange={value => onChange({ target: { name, value } })}
                  >
                    {action.label}
                  </Checkbox>
                  <button
                    type="button"
                    onClick={() => onSelectedAction(action.name)}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <CogIcon />
                  </button>
                </CheckboxWrapper>
              </GridItem>
            );
          })}
        </Grid>
      </Row>
    </Box>
  );
};

SubCategory.propTypes = {
  subCategory: PropTypes.object.isRequired,
};

export default SubCategory;
