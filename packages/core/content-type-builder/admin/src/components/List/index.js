/**
 *
 * List
 *
 */

/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useTracking } from '@strapi/helper-plugin';
import { TableLabel, TFooter, Box, TextButton } from '@strapi/parts';
import { AddIcon } from '@strapi/icons';
import { useIntl } from 'react-intl';
import useListView from '../../hooks/useListView';
import useDataManager from '../../hooks/useDataManager';
import DynamicZoneList from '../DynamicZoneList';
import ComponentList from '../ComponentList';
import BoxWrapper from './BoxWrapper';
import getTrad from '../../utils/getTrad';

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

function List({
  customRowComponent,
  items,
  addComponentToDZ,
  targetUid,
  mainTypeName,
  editTarget,
  isFromDynamicZone,
  isNestedInDZComponent,
  isMain,
  firstLoopComponentName,
  firstLoopComponentUid,
  secondLoopComponentName,
  secondLoopComponentUid,
  isSub,
  dzName,
}) {
  const { formatMessage } = useIntl();
  const { trackUsage } = useTracking();
  const { isInDevelopmentMode, modifiedData } = useDataManager();
  const { openModalAddField } = useListView();
  const onClickAddField = () => {
    trackUsage('hasClickedCTBAddFieldBanner');
    const firstComponentIcon = get(
      modifiedData,
      ['components', firstLoopComponentUid, 'schema', 'icon'],
      ''
    );
    const firstComponentCategory = get(
      modifiedData,
      ['components', firstLoopComponentUid, 'category'],
      null
    );
    const firstComponentFriendlyName = get(
      modifiedData,
      ['components', firstLoopComponentUid, 'schema', 'name'],
      null
    );
    const secondComponentCategory = get(
      modifiedData,
      ['components', secondLoopComponentUid, 'category'],
      null
    );
    const secondComponentFriendlyName = get(
      modifiedData,
      ['components', secondLoopComponentUid, 'schema', 'name'],
      null
    );
    const secondComponentIcon = get(
      modifiedData,
      ['components', secondLoopComponentUid, 'schema', 'icon'],
      ''
    );
    const headerIconName1 =
      editTarget === 'contentType'
        ? get(modifiedData, ['contentType', 'schema', 'kind'], null)
        : editTarget;

    let firstHeaderObject = {
      header_label_1: mainTypeName,
      header_icon_name_1: headerIconName1,
      header_icon_isCustom_1: false,
      header_info_category_1: null,
      header_info_name_1: null,
    };
    let secondHeaderObject = {
      header_label_2: firstLoopComponentName,
      header_icon_name_2: 'component',
      header_icon_isCustom_2: false,
      header_info_category_2: firstComponentCategory,
      header_info_name_2: firstComponentFriendlyName,
    };
    let thirdHeaderObject = {
      header_icon_name_3: 'component',
      header_icon_isCustom_3: false,
      header_info_category_3: secondComponentCategory,
      header_info_name_3: secondComponentFriendlyName,
    };
    let fourthHeaderObject = {
      header_icon_name_4: null,
      header_icon_isCustom_4: false,
      header_info_category_4: secondComponentCategory,
      header_info_name_4: secondComponentFriendlyName,
    };

    if (firstLoopComponentName) {
      firstHeaderObject = {
        ...firstHeaderObject,
        header_icon_name_1: firstComponentIcon,
        header_icon_isCustom_1: true,
      };
    }

    if (secondLoopComponentUid) {
      firstHeaderObject = {
        ...firstHeaderObject,
        header_icon_name_1: secondComponentIcon,
        header_icon_isCustom_1: true,
      };
      thirdHeaderObject = {
        ...thirdHeaderObject,
        header_label_3: secondLoopComponentName,
      };
    }

    if (isFromDynamicZone || isNestedInDZComponent) {
      secondHeaderObject = {
        ...secondHeaderObject,
        header_label_2: dzName,
        header_icon_name_2: 'dynamiczone',
        header_icon_isCustom_2: false,
        header_info_category_2: null,
        header_info_name_2: null,
      };
      thirdHeaderObject = {
        ...thirdHeaderObject,
        header_icon_name_3: isNestedInDZComponent ? 'component' : null,
        header_label_3: firstLoopComponentName,
        header_info_category_3: firstComponentCategory,
        header_info_name_3: firstComponentFriendlyName,
      };
      fourthHeaderObject = {
        ...fourthHeaderObject,
        header_label_4: secondLoopComponentName,
      };
    }

    openModalAddField(
      editTarget,
      targetUid,
      firstHeaderObject,
      secondHeaderObject,
      thirdHeaderObject,
      fourthHeaderObject
    );
  };

  if (!targetUid) {
    return null;
  }

  return (
    <>
      <BoxWrapper
        isFromDynamicZone={isFromDynamicZone}
        background="neutral0"
        shadow="filterShadow"
        hasRadius
      >
        <Box paddingLeft={6} paddingRight={6}>
          <table>
            <thead>
              <tr>
                <th>
                  <TableLabel textColor="neutral600">Name</TableLabel>
                </th>
                <th colSpan="2">
                  <TableLabel textColor="neutral600">Type</TableLabel>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const { type } = item;
                const CustomRow = customRowComponent;

                return (
                  <React.Fragment key={item.name}>
                    <CustomRow
                      {...item}
                      dzName={dzName}
                      isNestedInDZComponent={isNestedInDZComponent}
                      targetUid={targetUid}
                      mainTypeName={mainTypeName}
                      editTarget={editTarget}
                      firstLoopComponentName={firstLoopComponentName}
                      firstLoopComponentUid={firstLoopComponentUid}
                      isFromDynamicZone={isFromDynamicZone}
                      secondLoopComponentName={secondLoopComponentName}
                      secondLoopComponentUid={secondLoopComponentUid}
                    />

                    {type === 'component' && (
                      <ComponentList
                        {...item}
                        customRowComponent={customRowComponent}
                        targetUid={targetUid}
                        dzName={dzName}
                        isNestedInDZComponent={isFromDynamicZone}
                        mainTypeName={mainTypeName}
                        editTarget={editTarget}
                        firstLoopComponentName={firstLoopComponentName}
                        firstLoopComponentUid={firstLoopComponentUid}
                      />
                    )}

                    {type === 'dynamiczone' && (
                      <DynamicZoneList
                        {...item}
                        customRowComponent={customRowComponent}
                        addComponent={addComponentToDZ}
                        targetUid={targetUid}
                        mainTypeName={mainTypeName}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </Box>

        {isMain && isInDevelopmentMode && (
          <TFooter icon={<AddIcon />} onClick={onClickAddField}>
            {formatMessage({
              id: getTrad(
                `form.button.add.field.to.${
                  modifiedData.contentType
                    ? modifiedData.contentType.schema.kind
                    : editTarget || 'collectionType'
                }`
              ),
              defaultMessage: 'Add another field',
            })}
          </TFooter>
        )}
        {isSub && isInDevelopmentMode && (
          <TextButton startIcon={<AddIcon />} onClick={onClickAddField}>
            {formatMessage({
              id: getTrad(`form.button.add.field.to.component`),
              defaultMessage: 'Add another field',
            })}
          </TextButton>
        )}
      </BoxWrapper>
    </>
  );
}

List.defaultProps = {
  addComponentToDZ: () => {},
  customRowComponent: null,
  dzName: null,
  firstLoopComponentName: null,
  firstLoopComponentUid: null,
  isFromDynamicZone: false,
  isNestedInDZComponent: false,
  isMain: false,
  isSub: false,
  items: [],
  secondLoopComponentName: null,
  secondLoopComponentUid: null,
  targetUid: null,
};

List.propTypes = {
  addComponentToDZ: PropTypes.func,
  customRowComponent: PropTypes.func,
  dzName: PropTypes.string,
  editTarget: PropTypes.string.isRequired,
  firstLoopComponentName: PropTypes.string,
  firstLoopComponentUid: PropTypes.string,
  isFromDynamicZone: PropTypes.bool,
  isNestedInDZComponent: PropTypes.bool,
  isMain: PropTypes.bool,
  items: PropTypes.instanceOf(Array),
  mainTypeName: PropTypes.string.isRequired,
  secondLoopComponentName: PropTypes.string,
  secondLoopComponentUid: PropTypes.string,
  targetUid: PropTypes.string,
  isSub: PropTypes.bool,
};

export default List;
