/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { H3 } from '@strapi/design-system/Text';
import { ModalFooter } from '@strapi/design-system/ModalLayout';
import { Button } from '@strapi/design-system/Button';
import PicturePlus from '@strapi/icons/PicturePlus';
import { useIntl } from 'react-intl';
import { getTrad } from '../../../utils';
import { typeFromMime } from '../../../utils/typeFromMime';
import { AssetSource } from '../../../constants';

const Wrapper = styled(Flex)`
  flex-direction: column;
`;

const IconWrapper = styled.div`
  font-size: ${60 / 16}rem;

  svg path {
    fill: ${({ theme }) => theme.colors.primary600};
  }
`;

const MediaBox = styled(Box)`
  border-style: dashed;
`;

const OpaqueBox = styled(Box)`
  opacity: 0;
  cursor: pointer;
`;

export const FromComputerForm = ({ onClose, onAddAssets }) => {
  const { formatMessage } = useIntl();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  const handleClick = e => {
    e.preventDefault();
    inputRef.current.click();
  };

  const handleChange = () => {
    const files = inputRef.current.files;
    const assets = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      assets.push({
        name: file.name,
        source: AssetSource.Computer,
        type: typeFromMime(file.type),
        url: URL.createObjectURL(file),
        ext: file.name.split('.').pop(),
        mime: file.type,
        rawFile: file,
      });
    }

    onAddAssets(assets);
  };

  return (
    <form>
      <Box paddingLeft={8} paddingRight={8} paddingTop={6} paddingBottom={6}>
        <label>
          <MediaBox
            paddingTop={11}
            paddingBottom={11}
            hasRadius
            justifyContent="center"
            borderColor={dragOver ? 'primary500' : 'neutral300'}
            background={dragOver ? 'primary100' : 'neutral100'}
            position="relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <Flex justifyContent="center">
              <Wrapper>
                <IconWrapper>
                  <PicturePlus aria-hidden />
                </IconWrapper>

                <Box paddingTop={3} paddingBottom={5}>
                  <H3 textColor="neutral600" as="span">
                    {formatMessage({
                      id: getTrad('input.label'),
                      defaultMessage: 'Drag & Drop here or',
                    })}
                  </H3>
                </Box>

                <OpaqueBox
                  as="input"
                  position="absolute"
                  left={0}
                  right={0}
                  bottom={0}
                  top={0}
                  width="100%"
                  type="file"
                  multiple
                  name="files"
                  tabIndex={-1}
                  ref={inputRef}
                  zIndex={1}
                  onChange={handleChange}
                />

                <Box position="relative">
                  <Button type="button" onClick={handleClick}>
                    {formatMessage({
                      id: getTrad('input.button.label'),
                      defaultMessage: 'Browse files',
                    })}
                  </Button>
                </Box>
              </Wrapper>
            </Flex>
          </MediaBox>
        </label>
      </Box>

      <ModalFooter
        startActions={
          <Button onClick={onClose} variant="tertiary">
            {formatMessage({
              id: 'app.components.Button.cancel',
              defaultMessage: 'cancel',
            })}
          </Button>
        }
      />
    </form>
  );
};

FromComputerForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddAssets: PropTypes.func.isRequired,
};
