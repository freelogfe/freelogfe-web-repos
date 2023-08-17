import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import img_markdown from '@/assets/createVersion_markdown.png';
import FComponentsLib from '@freelog/components-lib';

interface MarkdownEditorProps {

}

function MarkdownEditor({}: MarkdownEditorProps) {
  return (<div className={styles.markdownEditor}>
    <img
      src={img_markdown}
      alt={''}
      style={{ width: 56, height: 64 }}
    />
    <div style={{ height: 40 }} />
    <FComponentsLib.FContentText text={'markdown编辑器'} type={'additional2'} />
    <div style={{ height: 40 }} />
    <FComponentsLib.FRectBtn type={'primary'}>立即体验</FComponentsLib.FRectBtn>
  </div>);
}

export default MarkdownEditor;