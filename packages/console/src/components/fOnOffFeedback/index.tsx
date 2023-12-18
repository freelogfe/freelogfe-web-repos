import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import { Modal } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface fOnOffFeedbackProps {
  state: 'on' | 'off';
  message: string;
}

export function fOnOffFeedback({ ...props }: fOnOffFeedbackProps): void {
  const divRoot = self.document.getElementById('modal-root') as HTMLDivElement;
  const div = self.document.createElement('div') as HTMLDivElement;
  divRoot.appendChild(div);
  const root = ReactDOM.createRoot(div);

  return root.render(<FOnOffFeedback
    state={props.state}
    message={props.message}
    afterClose={() => {
      setTimeout(() => {
        root.unmount();
      }, .1);
    }}
  />);
}


interface FOnOffFeedbackProps {
  state: 'on' | 'off';
  message: string;

  afterClose?(): void;
}

function FOnOffFeedback({ state, message, afterClose }: FOnOffFeedbackProps) {

  const [$open, set$open, get$open] = FUtil.Hook.useGetState<boolean>(true);

  AHooks.useTimeout(() => {
    set$open(false);
  }, 1000);

  return (<Modal
    open={$open}
    title={null}
    footer={null}
    width={312}
    bodyStyle={{
      backgroundColor: 'white',
      borderRadius: 6,
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      // color: '#2784FF',
      height: 200,
      // fontSize: 16,
      // lineHeight: '22px',
    }}
    style={{ backgroundColor: 'transparent', borderRadius: 10, overflow: 'hidden' }}
    mask={true}
    centered={true}
    closable={false}
    afterClose={afterClose}
    focusTriggerAfterClose={false}
  >
    <div className={styles.result}>
      <FComponentsLib.FIcons.FUpcast
        className={[styles.resultIcon, state === 'on' ? styles.up : styles.down].join(' ')}
      />
      <div style={{ height: 20 }} />
      <div className={styles.resultText}>
        {message}
      </div>
    </div>
  </Modal>);
}

export default FOnOffFeedback;
