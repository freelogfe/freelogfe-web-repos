import * as React from 'react';
import styles from './index.less';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

export default function () {
  return (
    <BraftEditor
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link', 'fullscreen']}
      // value={editorState}
      // onChange={this.handleEditorChange}
      // onSave={this.submitContent}
    />
  );
}
