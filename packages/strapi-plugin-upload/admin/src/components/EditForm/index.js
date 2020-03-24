import React, { useState, useEffect, useRef } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { Inputs } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {
  canDownloadFile,
  createFileToDownloadName,
  getTrad,
  prefixFileUrlWithBackendUrl,
} from '../../utils';
import CardControl from '../CardControl';
import CardControlsWrapper from '../CardControlsWrapper';
import CardPreview from '../CardPreview';
import ModalSection from '../ModalSection';
import Text from '../Text';
import CropWrapper from './CropWrapper';
import FileDetailsBox from './FileDetailsBox';
import FileWrapper from './FileWrapper';
import FormWrapper from './FormWrapper';
import Row from './Row';
import Wrapper from './Wrapper';
import form from './utils/form';
import isImageType from './utils/isImageType';

const EditForm = ({
  fileToEdit,
  onChange,
  onClickDeleteFileToUpload,
  onSubmitEditNewFile,
  setCropResult,
}) => {
  const { formatMessage } = useGlobalContext();
  const [isCropping, setIsCropping] = useState(false);
  const [infosCoordinates, setInfosCoordinates] = useState({ top: 0, left: 0 });
  const [infos, setInfos] = useState({ width: 0, height: 0 });
  const [src, setSrc] = useState(null);

  const fileURL = get(fileToEdit, ['file', 'url'], null);
  const isFileDownloadable = canDownloadFile(fileURL);
  const prefixedFileURL = fileURL ? prefixFileUrlWithBackendUrl(fileURL) : null;
  const downloadFileName = isFileDownloadable ? createFileToDownloadName(fileToEdit) : null;
  const mimeType = get(fileToEdit, ['file', 'type'], null) || get(fileToEdit, ['file', 'mime'], '');
  const isImg = isImageType(mimeType);
  const canCrop = isImg && !mimeType.includes('svg');

  const aRef = useRef();
  const imgRef = useRef();
  let cropper = useRef();

  useEffect(() => {
    if (isImg) {
      if (prefixedFileURL) {
        setSrc(prefixedFileURL);
      } else {
        const reader = new FileReader();

        reader.onloadend = () => {
          setSrc(reader.result);
        };

        reader.readAsDataURL(fileToEdit.file);
      }
    }
  }, [isImg, fileToEdit, prefixedFileURL]);

  useEffect(() => {
    if (isCropping) {
      cropper.current = new Cropper(imgRef.current, {
        modal: false,
        initialAspectRatio: 16 / 9,
        movable: true,
        zoomable: false,
        cropBoxResizable: true,
        background: false,
        ready: handleResize,
        cropmove: handleResize,
      });
    } else if (cropper.current) {
      cropper.current.destroy();
    }

    return () => {
      if (cropper.current) {
        cropper.current.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cropper, isCropping]);

  const handleResize = () => {
    // 130
    const cropBox = cropper.current.getCropBoxData();
    const { width, height } = cropBox;
    const roundedWidth = Math.round(width);
    const roundedHeight = Math.round(height);
    const xSignWidth = 3;
    const margin = 15;
    const pixelWidth = 13;

    const left =
      cropBox.left +
      width -
      margin -
      ((roundedHeight.toString().length + roundedWidth.toString().length + xSignWidth) *
        pixelWidth) /
        2;
    const top = cropBox.top + height - pixelWidth - margin;

    setInfosCoordinates({ top, left });
    setInfos({ width: roundedWidth, height: roundedHeight });
  };

  const handleToggleCropMode = () => {
    setIsCropping(prev => !prev);
  };

  const handleClick = () => {
    if (cropper) {
      const canvas = cropper.current.getCroppedCanvas();
      canvas.toBlob(blob => {
        const {
          file: { lastModifiedDate, lastModified, name },
        } = fileToEdit;

        setCropResult(
          new File([blob], name, {
            type: mimeType,
            lastModified,
            lastModifiedDate,
          })
        );
      });
    }

    setIsCropping(false);
  };

  const handleClickDelete = () => {
    onClickDeleteFileToUpload(fileToEdit.originalIndex);
  };

  const handleCopy = () => {
    strapi.notification.info(getTrad('notification.link-copied'));
  };

  const handleClickDownload = () => {
    aRef.current.click();
  };

  const handleSubmit = e => {
    e.preventDefault();

    onSubmitEditNewFile(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalSection>
        <Wrapper>
          <div className="row">
            <div className="col-6">
              <FileWrapper>
                <CardControlsWrapper className="card-control-wrapper">
                  {!isCropping ? (
                    <>
                      <CardControl color="#9EA7B8" type="trash-alt" onClick={handleClickDelete} />
                      {fileURL && (
                        <>
                          <CardControl
                            color="#9EA7B8"
                            type="download"
                            onClick={handleClickDownload}
                          />
                          {isFileDownloadable && (
                            <a
                              href={fileURL}
                              title={fileToEdit.fileInfo.name}
                              download={downloadFileName}
                              style={{ display: 'none' }}
                              ref={aRef}
                            >
                              hidden
                            </a>
                          )}
                          <CopyToClipboard onCopy={handleCopy} text={prefixedFileURL}>
                            <CardControl color="#9EA7B8" type="link" onClick={handleClickDelete} />
                          </CopyToClipboard>
                        </>
                      )}
                      {canCrop && (
                        <CardControl type="crop" color="#9EA7B8" onClick={handleToggleCropMode} />
                      )}
                    </>
                  ) : (
                    <>
                      <CardControl type="clear" color="#F64D0A" onClick={handleToggleCropMode} />
                      <CardControl type="check" color="#6DBB1A" onClick={handleClick} />
                    </>
                  )}
                </CardControlsWrapper>

                {isImg ? (
                  <CropWrapper>
                    <img
                      src={src}
                      alt={get(fileToEdit, ['file', 'name'], '')}
                      ref={isCropping ? imgRef : null}
                    />

                    {isCropping && (
                      <Text
                        fontSize="md"
                        color="white"
                        as="div"
                        style={{
                          position: 'absolute',
                          top: infosCoordinates.top,
                          left: infosCoordinates.left,
                          background: '#333740',
                          borderRadius: 2,
                        }}
                      >
                        &nbsp;
                        {infos.width} x {infos.height}
                        &nbsp;
                      </Text>
                    )}
                  </CropWrapper>
                ) : (
                  <CardPreview url={src} />
                )}
              </FileWrapper>
            </div>
            <div className="col-6">
              <FileDetailsBox file={fileToEdit.file} />
              <FormWrapper>
                {form.map(({ key, inputs }) => {
                  return (
                    <Row key={key}>
                      {inputs.map(input => {
                        return (
                          <div className="col-12" key={input.name}>
                            <Inputs
                              {...input}
                              description={
                                input.description ? formatMessage(input.description) : null
                              }
                              label={formatMessage(input.label)}
                              onChange={onChange}
                              type="text"
                              value={get(fileToEdit, input.name, '')}
                            />
                          </div>
                        );
                      })}
                    </Row>
                  );
                })}
              </FormWrapper>
            </div>
          </div>
        </Wrapper>
        <button type="submit" style={{ display: 'none' }}>
          hidden button to make to get the native form event
        </button>
      </ModalSection>
    </form>
  );
};

EditForm.defaultProps = {
  fileToEdit: null,
  onChange: () => {},
  onClickDeleteFileToUpload: () => {},
  onSubmitEditNewFile: e => e.preventDefault(),
  setCropResult: () => {},
};

EditForm.propTypes = {
  fileToEdit: PropTypes.object,
  onChange: PropTypes.func,
  onClickDeleteFileToUpload: PropTypes.func,
  onSubmitEditNewFile: PropTypes.func,
  setCropResult: PropTypes.func,
};

export default EditForm;
