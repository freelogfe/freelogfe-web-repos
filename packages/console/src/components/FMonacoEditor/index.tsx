import * as React from 'react';
import styles from './index.less';
import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';

interface FMonacoEditorProps extends MonacoEditorProps {

}

function FMonacoEditor({ width = 800, height = 600, ...props }: FMonacoEditorProps) {
  return (<div
    style={{ width, height }}
    className={styles.container}
  >
    <MonacoEditor
      // width="100%"
      // height={height}
      {...props}
    />
  </div>);
}

export default FMonacoEditor;
