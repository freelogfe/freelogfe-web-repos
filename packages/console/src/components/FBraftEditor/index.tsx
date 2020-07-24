import * as React from 'react';
import styles from './index.less';
import BraftEditor, {EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';

interface FBraftEditorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export default function ({defaultValue, onChange}: FBraftEditorProps) {

  const [editorState, setEditorState] = React.useState<null | EditorState>(BraftEditor.createEditorState(defaultValue));

  // React.useEffect(() => {
  //   if (defaultValue) {
  //     setEditorState(BraftEditor.createEditorState(defaultValue));
  //   }
  // }, [defaultValue]);

  function handleEditorChange(editorState: EditorState) {
    setEditorState(editorState);
    // console.log(editorState.toText());
    // console.log(editorState.toRAW());
    // console.log(editorState.toHTML());
    return onChange && onChange(editorState.toHTML());
  }

  return (
    <BraftEditor
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link', 'fullscreen']}
      // value={editorState}
      defaultValue={editorState}
      onChange={handleEditorChange}
      // onSave={this.submitContent}
    />
  );
}
