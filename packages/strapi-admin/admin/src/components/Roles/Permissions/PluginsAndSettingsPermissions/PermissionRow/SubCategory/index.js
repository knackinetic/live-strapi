import React, { useCallback, useMemo } from 'react';
import { intersectionWith } from 'lodash';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Flex, Padded, Text, Checkbox } from '@buffetjs/core';

import { usePermissionsContext } from '../../../../../../hooks';
import CheckboxWrapper from '../CheckboxWrapper';
import BaselineAlignment from '../BaselineAlignment';
import SubCategoryWrapper from './SubCategoryWrapper';

const Border = styled.div`
  flex: 1;
  align-self: center;
  border-top: 1px solid #f6f6f6;
  padding: 0px 10px;
`;

const SubCategory = ({ subCategory }) => {
  const { pluginsAndSettingsPermissions } = usePermissionsContext();

  const checkPermission = useCallback(
    action => {
      return (
        pluginsAndSettingsPermissions.findIndex(permission => permission.action === action) !== -1
      );
    },
    [pluginsAndSettingsPermissions]
  );

  const hasAllCategoryActions = useMemo(() => {
    return (
      intersectionWith(
        pluginsAndSettingsPermissions,
        subCategory.actions,
        (x, y) => x.action === y.action
      ).length === subCategory.actions.length
    );
  }, [pluginsAndSettingsPermissions, subCategory]);

  const hasSomeCategoryActions = useMemo(() => {
    const numberOfCurrentActions = intersectionWith(
      pluginsAndSettingsPermissions,
      subCategory.actions,
      (x, y) => x.action === y.action
    ).length;

    return numberOfCurrentActions > 0 && numberOfCurrentActions < subCategory.actions.length;
  }, [pluginsAndSettingsPermissions, subCategory]);

  return (
    <SubCategoryWrapper disabled>
      <Flex justifyContent="space-between" alignItems="center">
        <Padded right size="sm">
          <Text
            lineHeight="18px"
            color="#919bae"
            fontWeight="bold"
            fontSize="xs"
            textTransform="uppercase"
          >
            {subCategory.subCategory}
          </Text>
        </Padded>
        <Border />
        <Padded left size="sm">
          <BaselineAlignment />
          <Checkbox
            disabled
            name={`select-all-${subCategory.subCategory}`}
            message="Select all"
            someChecked={hasSomeCategoryActions}
            value={hasAllCategoryActions}
          />
        </Padded>
      </Flex>
      <BaselineAlignment />
      <Padded top size="xs">
        <Flex flexWrap="wrap">
          {subCategory.actions.map(sc => (
            <CheckboxWrapper key={sc.action}>
              <Checkbox
                disabled
                value={checkPermission(sc.action)}
                name={sc.action}
                message={sc.displayName}
              />
            </CheckboxWrapper>
          ))}
        </Flex>
      </Padded>
    </SubCategoryWrapper>
  );
};

SubCategory.propTypes = {
  subCategory: PropTypes.object.isRequired,
};

export default SubCategory;
