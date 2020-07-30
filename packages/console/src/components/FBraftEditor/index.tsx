import * as React from 'react';
import styles from './index.less';
import BraftEditor, {BraftEditorProps, EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';

interface FBraftEditorProps extends BraftEditorProps {
  // defaultValue?: string;
  // value?: string;
  // onChange?: (value: string) => void;
}

export default function (props: FBraftEditorProps) {

  // const [editorState, setEditorState] = React.useState<null | EditorState>(BraftEditor.createEditorState(defaultValue));

  // React.useEffect(() => {
  //   if (defaultValue) {
  //     setEditorState(BraftEditor.createEditorState(defaultValue));
  //   }
  // }, [defaultValue]);

  // function handleEditorChange(editorState: EditorState) {
  //   setEditorState(editorState);
  //   return onChange && onChange(editorState.toHTML());
  // }

  return (
    <BraftEditor
      {...props}
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link', 'fullscreen']}
      // value={BraftEditor.createEditorState(value)}
      // defaultValue={editorState}
      // onChange={handleEditorChange}
      // onSave={this.submitContent}
    />
  );
}
