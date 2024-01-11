import * as React from 'react';
import styles from './index.less';
import { Checkbox, Modal, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import * as ReactDOM from 'react-dom/client';
import { FUtil } from '../../../../@freelog/tools-lib';

interface fPromiseModalConfirmProps {
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;
  promptKey_localStorage?: string;
}

function fPromiseModalConfirm({
                                title,
                                description,
                                okText,
                                cancelText,
                                promptKey_localStorage = '',
                              }: fPromiseModalConfirmProps): Promise<boolean> {

  const storage: string = JSON.parse(self.localStorage.getItem('fPromiseModalConfirm') || '[]');

  if (promptKey_localStorage !== '' && storage.includes(promptKey_localStorage)) {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const divRoot = self.document.getElementById('modal-root') as HTMLDivElement;
    const div = self.document.createElement('div') as HTMLDivElement;
    divRoot.appendChild(div);
    const root = ReactDOM.createRoot(div);

    return root.render(<Middleware
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      showPrompt={promptKey_localStorage !== ''}
      onOk={({ remember }) => {
        if (remember) {
          self.localStorage.setItem('fPromiseModalConfirm', JSON.stringify([...storage, promptKey_localStorage]));
        }
        resolve(true);
      }}
      onCancel={() => {
        resolve(false);
      }}
      afterClose={() => {
        setTimeout(() => {
          root.unmount();
        }, .1);
      }}
    />);
  });
}

export default fPromiseModalConfirm;

interface MiddlewareProps {
  title: string;
  description: string;
  okText?: string;
  cancelText?: string;
  showPrompt?: boolean;

  onOk?(config: { remember: boolean }): void;

  onCancel?(): void;

  afterClose?(): void;
}

function Middleware({
                      title,
                      description,
                      okText,
                      cancelText,
                      onOk,
                      onCancel,
                      afterClose,
                      showPrompt,
                    }: MiddlewareProps) {
  const [$visible, set$visible] = FUtil.Hook.useGetState<boolean>(true);
  const [$checked, set$checked, get$checked] = FUtil.Hook.useGetState<boolean>(false);
  return (<Modal
    title={null}
    open={$visible}
    footer={null}
    centered
    className={styles.modal}
    width={490}
    onCancel={() => {
      set$visible(false);
      onCancel && onCancel();
    }}
    afterClose={() => {
      afterClose && afterClose();
    }}
    maskClosable={false}
    bodyStyle={{
      backgroundColor: 'white',
      borderRadius: 6,
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 70px',
      // color: '#2784FF',
      // height: 200,
      // fontSize: 16,
      // lineHeight: '22px',
    }}
    style={{ borderRadius: 6, overflow: 'hidden' }}
  >
    <div className={styles.modelContent}>
      <FComponentsLib.FTitleText type={'popup'} text={title} style={{ color: '#222' }} />
      <div className={styles.title2}>
        <FComponentsLib.FTipText
          text={description}
          type={'second'}
          // style={{ textAlign: 'center' }}
        />
      </div>
      <div className={styles.btn}>
        <FComponentsLib.FTextBtn
          type={'default'}
          onClick={() => {
            set$visible(false);
            onCancel && onCancel();
          }}
        >{cancelText || '取消'}</FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          type={'primary'}
          onClick={() => {
            set$visible(false);
            onOk && onOk({ remember: get$checked() });
          }}
        >{okText || '确定'}</FComponentsLib.FRectBtn>
      </div>
      {
        showPrompt && (<>
          <div style={{ height: 15 }} />
          <Space
            size={5}
            style={{ width: 460, cursor: 'pointer' }}
            onClick={() => {
              set$checked(!get$checked());
            }}
          >
            <Checkbox checked={$checked} />
            <FComponentsLib.FContentText
              type={'additional2'}
              text={'不再提醒'}
            />
          </Space>
        </>)
      }

    </div>
  </Modal>);
}
