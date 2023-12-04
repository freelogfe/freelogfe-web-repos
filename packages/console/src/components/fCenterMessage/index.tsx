import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import { Modal } from 'antd';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface fCenterMessageProps {
  message: string;
  width?: number | string;
}

function fCenterMessage({ message, width }: fCenterMessageProps) {

  return new Promise<void>((resolve) => {
    const divRoot = document.getElementById('modal-root') as HTMLDivElement;
    const div = document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);
    return root.render(<FCenterMessage
      message={message}
      width={width}
      onClose={() => {
        resolve();
        setTimeout(() => {
          root.unmount();
        }, 30);
      }}
    />);
  });
}

export default fCenterMessage;

interface FCenterMessage {
  message: string;
  width?: number | string;

  onClose?(): void;
}

function FCenterMessage({ message, width = 'fit-content', onClose }: FCenterMessage) {

  const [$open, set$open] = FUtil.Hook.useGetState<boolean>(true);

  AHooks.useTimeout(() => {
    set$open(false);
  }, 2000);

  return (<Modal
    open={$open}
    title={null}
    footer={null}
    width={width}
    // style={{ backgroundColor: 'rgba(0,0,0,.2)' }}
    bodyStyle={{
      backgroundColor: 'rgba(0,0,0,.6)',
      borderRadius: 10,
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      padding: '30px 60px',
    }}
    style={{ backgroundColor: 'transparent' }}
    mask={false}
    centered={true}
    closable={false}
    afterClose={() => {
      onClose && onClose();
    }}
    focusTriggerAfterClose={false}
  >
    {message}
  </Modal>);
}

