import * as React from 'react';
import styles from './index.less';
import BraftEditor, {BraftEditorProps, EditorState} from 'braft-editor';
import 'braft-editor/dist/index.css';
import {uploadImage, UploadImageParamsType} from "@/services/storages";

interface FBraftEditorProps extends BraftEditorProps {

}

export default function (props: FBraftEditorProps) {

  return (
    <BraftEditor
      {...props}
      className={styles.styles}
      controls={['bold', 'italic', 'underline', 'media', 'blockquote', 'code', 'list-ul', 'list-ol', 'headings', 'text-color', 'link', 'fullscreen']}
      media={{
        async uploadFn(fileParams) {
          const params: UploadImageParamsType = {
            file: fileParams.file,
          };
          const {data} = await uploadImage(params);
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
