import * as React from 'react';
import styles from './index.less';
import { MicroApp } from '@@/plugin-qiankun/MicroApp';
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
  return (<Drawer
    open={open}
    width={'100%'}
    title={null}
    footer={null}
    closable={false}
    destroyOnClose
  >
    <MicroApp
      name='markdownEditor'
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
