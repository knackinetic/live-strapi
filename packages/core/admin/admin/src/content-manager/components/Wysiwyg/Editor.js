import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/addon/display/placeholder';
import PreviewWysiwyg from '../PreviewWysiwyg';
import EditorWrapper from './EditorWrapper';
import { EditorAndPreviewWrapper } from './WysiwygStyles';
import newlineAndIndentContinueMarkdownList from './utils/continueList';

const Editor = ({
  disabled,
  editorRef,
  error,
  isPreviewMode,
  name,
  onChange,
  placeholder,
  textareaRef,
  value,
}) => {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      lineWrapping: true,
      extraKeys: {
        Enter: 'newlineAndIndentContinueMarkdownList',
        // Leaving this commented for now
        // Tab: false,
        // 'Shift-Tab': false,
      },
      readOnly: false,
      smartIndent: false,
    });

    CodeMirror.commands.newlineAndIndentContinueMarkdownList = newlineAndIndentContinueMarkdownList;
    editorRef.current.on('change', doc => {
      onChangeRef.current({ target: { name, value: doc.getValue(), type: 'wysiwyg' } });
    });
  }, [editorRef, textareaRef, name]);

  useEffect(() => {
    if (value && !editorRef.current.state.focused) {
      editorRef.current.setValue(value);
    }
  }, [editorRef, value]);

  useEffect(() => {
    if (isPreviewMode || disabled) {
      editorRef.current.setOption('readOnly', 'nocursor');
    } else {
      editorRef.current.setOption('readOnly', false);
    }
  }, [disabled, isPreviewMode, editorRef]);

  useEffect(() => {
    if (error) {
      editorRef.current.setOption('screenReaderLabel', error);
    } else {
      // to replace with translation
      editorRef.current.setOption('screenReaderLabel', 'Editor');
    }
  }, [editorRef, error]);

  return (
    <EditorAndPreviewWrapper>
      <EditorWrapper disabled={disabled || isPreviewMode}>
        <textarea ref={textareaRef} placeholder={placeholder} />
      </EditorWrapper>
      {isPreviewMode && <PreviewWysiwyg data={value} />}
    </EditorAndPreviewWrapper>
  );
};

Editor.defaultProps = {
  disabled: false,
  error: undefined,
  isPreviewMode: false,
  placeholder: '',
  value: '',
};

Editor.propTypes = {
  disabled: PropTypes.bool,
  editorRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  error: PropTypes.string,
  isPreviewMode: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  textareaRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  value: PropTypes.string,
};

export default Editor;
