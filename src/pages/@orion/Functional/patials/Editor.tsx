import Editor from '@monaco-editor/react';
import { ThemeType } from 'configs/const/general';
import React from 'react';
import { useAppSelector } from 'store';
import { EditorObjectProps } from '..';
import { Spin } from 'antd';

export interface EditorMonacoProps {
  editorObj: EditorObjectProps;
  onChangMonaco: (valueChange?: string) => void;
}

const EditorFunction = ({ editorObj, onChangMonaco }: EditorMonacoProps) => {
  const { selected } = useAppSelector((state) => state.app.theme);

  return (
    <Editor
      height="200px"
      wrapperProps={{
        className: 'flex-grow-1 border-app'
      }}
      defaultLanguage="javascript"
      theme={selected === ThemeType.DARK ? 'vs-dark' : 'light'}
      loading={<Spin />}
      value={editorObj.value}
      onChange={(value) => onChangMonaco(value)}
      options={{
        wordWrap: 'on',
        minimap: {
          enabled: false
        }
      }}
    />
  );
};

export default EditorFunction;
