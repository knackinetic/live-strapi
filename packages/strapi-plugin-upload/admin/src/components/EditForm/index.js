/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-fragments */
import React, {
  Fragment,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
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
import InfiniteLoadingIndicator from '../InfiniteLoadingIndicator';
import ModalSection from '../ModalSection';
import Text from '../Text';
import VideoPlayer from '../VideoPlayer';
import CropWrapper from './CropWrapper';
import FileDetailsBox from './FileDetailsBox';
import FileWrapper from './FileWrapper';
import FormWrapper from './FormWrapper';
import Row from './Row';
import Wrapper from './Wrapper';
import form from './utils/form';
import isImageType from './utils/isImageType';
import isVideoType from './utils/isVideoType';

const EditForm = forwardRef(
  (
    {
      components,
      fileToEdit,
      isEditingUploadedFile,
      isFormDisabled,
      onAbortUpload,
      onChange,
      onClickDeleteFileToUpload,
      onSubmitEdit,
      setCropResult,
      toggleDisableForm,
    },
    ref
  ) => {
    const { formatMessage } = useGlobalContext();
    const [isCropping, setIsCropping] = useState(false);
    const [infosCoordinates, setInfosCoordinates] = useState({ top: 0, left: 0 });
    const [infos, setInfos] = useState({ width: 0, height: 0 });
    const [src, setSrc] = useState(null);

    const fileURL = get(fileToEdit, ['file', 'url'], null);
    const isFileDownloadable = canDownloadFile(fileURL);
    const prefixedFileURL = fileURL ? prefixFileUrlWithBackendUrl(fileURL) : null;
    const downloadFileName = isFileDownloadable ? createFileToDownloadName(fileToEdit) : null;
    const mimeType =
      get(fileToEdit, ['file', 'type'], null) || get(fileToEdit, ['file', 'mime'], '');
    const isImg = isImageType(mimeType);
    const isVideo = isVideoType(mimeType);
    const canCrop = isImg && !mimeType.includes('svg');

    const aRef = useRef();
    const imgRef = useRef();
    const inputRef = useRef();
    let cropper = useRef();

    useImperativeHandle(ref, () => ({
      click: () => {
        inputRef.current.click();
        setIsCropping(false);
      },
    }));

    useEffect(() => {
      if (isImg || isVideo) {
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
    }, [isImg, isVideo, fileToEdit, prefixedFileURL]);

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

        toggleDisableForm(false);
      }

      return () => {
        if (cropper.current) {
          cropper.current.destroy();
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cropper, isCropping]);

    const handleResize = () => {
      const cropBox = cropper.current.getCropBoxData();
      const { width, height } = cropBox;
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);
      const xSignWidth = 3;
      const margin = 15;
      const pixelWidth = 13;

      let left =
        cropBox.left +
        width -
        margin -
        ((roundedHeight.toString().length + roundedWidth.toString().length + xSignWidth) *
          pixelWidth) /
          2;
      let top = cropBox.top + height - pixelWidth - margin;

      if (width < 130) {
        top = cropBox.top + height + 10;
        left = cropBox.left + width + 10;
      }

      setInfosCoordinates({ top, left });
      setInfos({ width: roundedWidth, height: roundedHeight });
    };

    const handleToggleCropMode = () => {
      setIsCropping(prev => {
        if (!prev && isEditingUploadedFile) {
          toggleDisableForm(true);
        }

        return !prev;
      });
    };

    const handleChange = ({ target: { files } }) => {
      onChange({ target: { name: 'file', value: files[0] } });
    };

    const handleClick = async () => {
      const cropResult = await getCroppedResult();

      setCropResult(cropResult);

      setIsCropping(false);
    };

    const getCroppedResult = () => {
      return new Promise(resolve => {
        const canvas = cropper.current.getCroppedCanvas();

        canvas.toBlob(async blob => {
          const {
            file: { lastModifiedDate, lastModified, name },
          } = fileToEdit;

          resolve(
            new File([blob], name, {
              type: mimeType,
              lastModified,
              lastModifiedDate,
            })
          );
        });
      });
    };

    const handleClickEditCroppedFile = async (e, shouldDuplicate = false) => {
      const file = await getCroppedResult();

      setIsCropping(false);
      onSubmitEdit(e, shouldDuplicate, file);
    };

    const handleClickDelete = () => {
      onClickDeleteFileToUpload(fileToEdit.originalIndex);
    };

    const handleCopy = () => {
      strapi.notification.info(getTrad('notification.link-copied'));
    };

    const handleClickDownload = () => {
      axios
        .get(prefixedFileURL, {
          headers: new Headers({ Origin: window.location.origin, mode: 'cors' }),
          responseType: 'blob',
        })
        .then(({ data }) => {
          const blobUrl = URL.createObjectURL(data);

          aRef.current.download = downloadFileName;
          aRef.current.href = blobUrl;

          aRef.current.click();
        })
        .catch(err => {
          console.error(err);
        });
    };

    const handleSubmit = e => {
      e.preventDefault();

      onSubmitEdit(e);
    };

    const CheckButton = components.CheckControl;

    return (
      <form onSubmit={handleSubmit}>
        <ModalSection>
          <Wrapper>
            <div className="row">
              <div className="col-6">
                <FileWrapper>
                  {fileToEdit.isUploading ? (
                    <InfiniteLoadingIndicator onClick={onAbortUpload} />
                  ) : (
                    <Fragment>
                      <CardControlsWrapper className="card-control-wrapper">
                        {!isCropping ? (
                          <>
                            <CardControl
                              color="#9EA7B8"
                              type="trash-alt"
                              onClick={handleClickDelete}
                            />
                            {fileURL && (
                              <>
                                <CardControl
                                  color="#9EA7B8"
                                  type="download"
                                  onClick={handleClickDownload}
                                />
                                <a
                                  title={fileToEdit.fileInfo.name}
                                  style={{ display: 'none' }}
                                  ref={aRef}
                                >
                                  hidden
                                </a>

                                <CopyToClipboard onCopy={handleCopy} text={prefixedFileURL}>
                                  <CardControl color="#9EA7B8" type="link" />
                                </CopyToClipboard>
                              </>
                            )}
                            {canCrop && (
                              <CardControl
                                type="crop"
                                color="#9EA7B8"
                                onClick={handleToggleCropMode}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <CardControl
                              type="clear"
                              color="#F64D0A"
                              onClick={handleToggleCropMode}
                            />
                            <CheckButton
                              type="check"
                              color="#6DBB1A"
                              onClick={handleClick}
                              onSubmitEdit={handleClickEditCroppedFile}
                            />
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
                        <>{isVideo ? <VideoPlayer src={src} /> : <CardPreview url={src} />}</>
                      )}
                    </Fragment>
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
                                disabled={isFormDisabled}
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
          <input
            ref={inputRef}
            type="file"
            multiple={false}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <button type="submit" style={{ display: 'none' }}>
            hidden button to make to get the native form event
          </button>
        </ModalSection>
      </form>
    );
  }
);

EditForm.defaultProps = {
  components: {
    CheckControl: CardControl,
  },
  fileToEdit: null,
  isEditingUploadedFile: false,
  isFormDisabled: false,
  onAbortUpload: () => {},
  onChange: () => {},
  onClickDeleteFileToUpload: () => {},
  onSubmitEdit: e => e.preventDefault(),
  setCropResult: () => {},
  toggleDisableForm: () => {},
};

EditForm.propTypes = {
  onAbortUpload: PropTypes.func,
  components: PropTypes.object,
  fileToEdit: PropTypes.object,
  isEditingUploadedFile: PropTypes.bool,
  isFormDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  onClickDeleteFileToUpload: PropTypes.func,
  onSubmitEdit: PropTypes.func,
  setCropResult: PropTypes.func,
  toggleDisableForm: PropTypes.func,
};

export default EditForm;
