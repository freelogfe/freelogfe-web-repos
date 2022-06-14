import * as React from 'react';
import styles from './index.less';
import {
  OnBlur_ChangePhone_New_PhoneInput_Action,
  OnCancel_ChangeEmail_Old_Modal_Action,
  OnChange_ChangePhone_New_PhoneInput_Action,
} from '@/models/settingPage';
import { FTipText } from '@/components/FText';
import FInput from '@/components/FInput';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { Modal } from 'antd';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

interface FVerifyUserPasswordModalProps {
  visible?: boolean;

  onCancel?(): void;

  onSuccess?(): void;
}

function FVerifyUserPasswordModal({ visible = false, onSuccess, onCancel }: FVerifyUserPasswordModalProps) {

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
    onSuccess && onSuccess();
  }

  return (<Modal
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
        <FTipText type='third' text={'用户登录密码'} />
        <FTextBtn
          style={{ fontSize: 12 }}
          type='primary'
          onClick={() => {
            const path: string = FUtil.LinkTo.retrieveUserPassword();
            window.open(path);
          }}
        >
          忘记登录密码？
        </FTextBtn>
      </div>

      <div style={{ height: 5 }} />
      <FInput
        value={password}
        onChange={(e) => {
          set_password(e.target.value);
        }}
        type='password'
        placeholder='请输入登录密码'
        className={styles.modalBlockInput}
        wrapClassName={styles.modalBlockInput}
      />
      <div style={{ height: 80 }} />
      <div className={styles.modalFooter}>
        <FRectBtn
          disabled={password === ''}
          type='primary'
          onClick={() => {
            verify();
          }}
        >下一步</FRectBtn>
      </div>
      <div style={{ height: 5 }} />
    </div>
  </Modal>);
}

export default FVerifyUserPasswordModal;
