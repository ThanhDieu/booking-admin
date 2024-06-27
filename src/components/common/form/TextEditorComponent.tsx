import clsx from 'clsx';
import { ThemeType } from 'configs/const/general';
import React from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from 'store';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'code']
  ]
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'code',
  'color'
];

const TextEditor: React.FC<ReactQuillProps> = (props) => {
  const { selected } = useAppSelector((state) => state.app.theme);

  return (
    <ReactQuill
      {...props}
      theme="snow"
      modules={modules}
      formats={formats}
      className={clsx(selected === ThemeType.DEFAULT ? 'text-black' : 'text-white')}
    />
  );
};

export default TextEditor;
