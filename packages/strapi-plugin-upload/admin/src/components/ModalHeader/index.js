/*
 * NOTE:
 * This component should be put in the strapi-helper-plugin
 * at some point so the other packages can benefits from the updates
 *
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderModalTitle } from 'strapi-helper-plugin';
import ModalSection from '../ModalSection';
import Text from '../Text';
import Wrapper from './Wrapper';

const ModalHeader = ({ headers }) => {
  return (
    <Wrapper>
      <ModalSection>
        <HeaderModalTitle>
          {headers.map(({ key, element }, index) => {
            const shouldDisplayChevron = index < headers.length - 1;

            return (
              <Fragment key={key}>
                {element}
                {shouldDisplayChevron && (
                  <Text as="span" fontSize="xs" color="#919bae">
                    <FontAwesomeIcon
                      icon="chevron-right"
                      style={{ margin: '0 10px' }}
                    />
                  </Text>
                )}
              </Fragment>
            );
          })}
        </HeaderModalTitle>
      </ModalSection>
    </Wrapper>
  );
};

ModalHeader.defaultProps = {
  headers: [],
};

ModalHeader.propTypes = {
  headers: PropTypes.array,
};

export default ModalHeader;
