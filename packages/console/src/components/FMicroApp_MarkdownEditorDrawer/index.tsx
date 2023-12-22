import * as React from 'react';
import styles from './index.less';
import { MicroApp } from 'umi';
import { Drawer } from 'antd';

interface FMicroApp_MarkdownEditorDrawer_Props {
  resourceID: string;
  open?: boolean;

  onChange_Saved?(saved: boolean): void;

  onClose?(): void;
}

function FMicroApp_MarkdownEditorDrawer({
                                          resourceID,
                                          open = false,
                                          onChange_Saved,
                                          onClose,
                                        }: FMicroApp_MarkdownEditorDrawer_Props) {

  if (!resourceID || !open) {
    return null;
  }

  return (<Drawer
    open={true}
    width={'100%'}
    title={null}
    footer={null}
    closable={false}
    destroyOnClose={true}
    bodyStyle={{ padding: 0 }}
  >
    <MicroApp
      name={self.location.host.endsWith('.testfreelog.com') ? 'markdownEditor_test' : 'markdownEditor'}
      resourceID={resourceID}
      onChange_Saved={(saved: boolean) => {
        onChange_Saved && onChange_Saved(saved);
      }}
      onClose={() => {
        // set_visible(false);
        // setTimeout(() => {
        onClose && onClose();
        // }, 300);
      }}
    />
  </Drawer>);
}

export default FMicroApp_MarkdownEditorDrawer;
