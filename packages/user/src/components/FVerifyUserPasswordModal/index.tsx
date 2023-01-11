import * as React from 'react';
import styles from './index.less';
// import FInput from '@/components/FInput';
import { Modal } from 'antd';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import FComponentsLib from '@freelog/components-lib';
import FPasswordInput from '@/components/FPasswordInput';

interface FVerifyUserPasswordModalProps {
  visible?: boolean;

  onCancel?(): void;

  actionReturn?(password: string): void;

  onSuccess?(data?: any): void;
}

function FVerifyUserPasswordModal({
                                    visible = false,
                                    onSuccess,
                                    onCancel,
                                    actionReturn,
                                  }: FVerifyUserPasswordModalProps) {
  const [password, set_password] = React.useState<string>('');

  React.useEffect(() => {
    if (!visible) {
      set_password('');
    }
  }, [visible]);

  async function verify() {
    const params: Parameters<typeof FServiceAPI.User.verifyLoginPassword>[0] = {
      password: password,
    };
    const { data } = await FServiceAPI.User.verifyLoginPassword(params);
    // data: {userId: 50028, isVerifySuccessful: false}
    if (!data?.isVerifySuccessful) {
      return fMessage('密码输入错误', 'error');
    }
    // if (actionReturn) {
    //   actionReturn(password);
    //   return;
    // }
    actionReturn && actionReturn(password);
    onSuccess && onSuccess(data);
  }

  return (
    <Modal
      title='验证登陆密码'
      visible={visible}
      onCancel={() => {
        onCancel && onCancel();
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <div className={styles.userPassword}>
          <FComponentsLib.FTipText type='third' text={'用户登录密码'} />
          <FComponentsLib.FTextBtn
            style={{ fontSize: 12 }}
            type='primary'
            onClick={() => {
              const path: string = FUtil.LinkTo.retrieveUserPassword();
              window.open(path);
            }}
          >
            忘记登录密码？
          </FComponentsLib.FTextBtn>
        </div>

        <div style={{ height: 5 }} />
        <FPasswordInput
          value={password}
          onChange={(e) => {
            set_password(e.target.value);
          }}
          // type='password'
          placeholder='请输入登录密码'
          className={styles.modalBlockInput}
          // wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FComponentsLib.FRectBtn
            disabled={password === ''}
            type='primary'
            onClick={() => {
              verify();
            }}
          >
            下一步
          </FComponentsLib.FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>
  );
}

export default FVerifyUserPasswordModal;
