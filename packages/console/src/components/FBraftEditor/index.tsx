import * as React from 'react';
import styles from './index.less';
import BraftEditor, {BraftEditorProps, EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';
import {connect} from "dva";
import {ConnectState, GlobalModelState} from "@/models/connect";
import {FApiServer} from "@/services";
import {CSSProperties} from "react";

interface FBraftEditorProps extends BraftEditorProps {
  global: GlobalModelState;
  value: EditorState;

  style?: CSSProperties;

  onChange?(value: EditorState): void;
}

function FBraftEditor({global, value, onChange, ...props}: FBraftEditorProps) {

  return (
    <BraftEditor
      {...props}
      value={value}
      onChange={(value1) => {
        // console.log(value.toHTML(), value1.toHTML(), '###@#$@#');
        if (value.toHTML() === value1.toHTML()) {
          return;
        }
        onChange && onChange(value1);
      }}
      language={global.locale === 'en-US' ? 'en' : 'zh'}
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link',
        // 'fullscreen',
      ]}
      media={{
        async uploadFn(fileParams) {
          const params: Parameters<typeof FApiServer.Storage.uploadImage>[0] = {
            file: fileParams.file,
          };
          const {data} = await FApiServer.Storage.uploadImage(params);
          // fileParams.progress();
          fileParams.success({
            url: data.url,
            meta: {
              id: data.url,
              title: '',
              alt: '',
              loop: false,
              autoPlay: false,
              controls: false,
              poster: '',
            }
          });
        },
        validateFn(file) {
          return true;
        },
        accepts: {
          // image?: string | false;
          video: false,
          audio: false,
        },
        externals: {
          image: true,
          video: false,
          audio: false,
          embed: false,
        },
        // pasteImage: true,
      }}
    />
  );
}


export default connect(({global}: ConnectState) => ({
  global: global,
}))(FBraftEditor);
