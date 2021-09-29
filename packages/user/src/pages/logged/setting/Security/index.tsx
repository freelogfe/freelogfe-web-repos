import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import FInput from '@/components/FInput';
import { Cascader, DatePicker, Input, Modal, Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import {
  OnBlur_BindEmail_EmailInput_Action,
  OnBlur_BindPhone_PhoneInput_Action, OnBlur_ChangeEmail_New_EmailInput_Action,
  OnBlur_ChangePassword_New1_PasswordInput_Action, OnBlur_ChangePassword_New2_PasswordInput_Action,
  OnBlur_ChangePhone_New_PhoneInput_Action,
  OnCancel_BindEmail_Modal_Action,
  OnCancel_BindPhone_Modal_Action,
  OnCancel_ChangeEmail_New_Modal_Action,
  OnCancel_ChangeEmail_Old_Modal_Action,
  OnCancel_ChangePassword_Modal_Action,
  OnCancel_ChangePhone_New_Modal_Action,
  OnCancel_ChangePhone_Old_Modal_Action,
  OnChange_BindEmail_CaptchaInput_Action, OnChange_BindEmail_CaptchaWait_Action,
  OnChange_BindEmail_EmailInput_Action,
  OnChange_BindPhone_CaptchaInput_Action, OnChange_BindPhone_CaptchaWait_Action,
  OnChange_BindPhone_PhoneInput_Action,
  OnChange_ChangeEmail_New_CaptchaInput_Action, OnChange_ChangeEmail_New_CaptchaWait_Action,
  OnChange_ChangeEmail_New_EmailInput_Action,
  OnChange_ChangeEmail_Old_CaptchaInput_Action, OnChange_ChangeEmail_Old_CaptchaWait_Action,
  OnChange_ChangePassword_New1_PasswordInput_Action,
  OnChange_ChangePassword_New2_PasswordInput_Action,
  OnChange_ChangePassword_Old_PasswordInput_Action,
  OnChange_ChangePhone_New_CaptchaInput_Action, OnChange_ChangePhone_New_CaptchaWait_Action,
  OnChange_ChangePhone_New_PhoneInput_Action,
  OnChange_ChangePhone_Old_CaptchaInput_Action, OnChange_ChangePhone_Old_CaptchaWait_Action,
  OnClick_BindEmail_ConfirmBtn_Action,
  OnClick_BindEmail_SendCaptchaBtn_Action,
  OnClick_BindEmailBtn_Action,
  OnClick_BindPhone_ConfirmBtn_Action,
  OnClick_BindPhone_SendCaptchaBtn_Action, OnClick_BindPhoneBtn_Action,
  OnClick_ChangeEmail_New_ConfirmBtn_Action,
  OnClick_ChangeEmail_New_SendCaptchaBtn_Action,
  OnClick_ChangeEmail_Old_NextBtn_Action,
  OnClick_ChangeEmail_Old_SendCaptchaBtn_Action, OnClick_ChangePassword_ConfirmBtn_Action,
  OnClick_ChangePasswordBtn_Action,
  OnClick_ChangePhone_New_ConfirmBtn_Action,
  OnClick_ChangePhone_New_SendCaptchaBtn_Action,
  OnClick_ChangePhone_Old_NextBtn_Action,
  OnClick_ChangePhone_Old_SendCaptchaBtn_Action, OnClick_ReplaceEmailBtn_Action,
  OnClick_ReplacePhoneBtn_Action,
} from '@/models/settingPage';
import * as AHooks from 'ahooks';
import { OnChangeWaitingTimeAction } from '@/models/logonPage';

interface SecurityProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Security({ dispatch, settingPage }: SecurityProps) {

  AHooks.useInterval(() => {
    dispatch<OnChange_BindEmail_CaptchaWait_Action>({
      type: 'settingPage/onChange_BindEmail_CaptchaWait',
      payload: {
        value: settingPage.bindEmail_CaptchaWait - 1,
      },
    });

  }, settingPage.bindEmail_CaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    // console.log(settingPage.changeEmail_Old_CaptchaWait, '64456456settingPage.changeEmail_Old_CaptchaWait');
    dispatch<OnChange_ChangeEmail_Old_CaptchaWait_Action>({
      type: 'settingPage/onChange_ChangeEmail_Old_CaptchaWait',
      payload: {
        value: settingPage.changeEmail_Old_CaptchaWait - 1,
      },
    });
  }, settingPage.changeEmail_Old_CaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_ChangeEmail_New_CaptchaWait_Action>({
      type: 'settingPage/onChange_ChangeEmail_New_CaptchaWait',
      payload: {
        value: settingPage.changeEmail_New_CaptchaWait - 1,
      },
    });
  }, settingPage.changeEmail_New_CaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_BindPhone_CaptchaWait_Action>({
      type: 'settingPage/onChange_BindPhone_CaptchaWait',
      payload: {
        value: settingPage.bindPhone_CaptchaWait - 1,
      },
    });
  }, settingPage.bindPhone_CaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_ChangePhone_Old_CaptchaWait_Action>({
      type: 'settingPage/onChange_ChangePhone_Old_CaptchaWait',
      payload: {
        value: settingPage.changePhone_Old_CaptchaWait - 1,
      },
    });
  }, settingPage.changePhone_Old_CaptchaWait === 0 ? null : 1000);

  AHooks.useInterval(() => {
    dispatch<OnChange_ChangePhone_New_CaptchaWait_Action>({
      type: 'settingPage/onChange_ChangePhone_New_CaptchaWait',
      payload: {
        value: settingPage.changePhone_New_CaptchaWait - 1,
      },
    });
  }, settingPage.changePhone_New_CaptchaWait === 0 ? null : 1000);

  return (<>
    <FFormLayout>
      <FFormLayout.FBlock
        title={'账号安全'}
      >
        <Space size={10} direction='vertical' className={styles.info}>
          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'用户名'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={settingPage.username} type='highlight' />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'邮箱'} type='normal' />
            </div>
            {
              settingPage.email === ''
                ? (<div className={styles.right}>
                  <FTipText text={'未绑定'} type='third' />
                  <div style={{ width: 30 }} />
                  <FTextBtn onClick={() => {
                    // onClick_BindEmailBtn_Action
                    dispatch<OnClick_BindEmailBtn_Action>({
                      type: 'settingPage/onClick_BindEmailBtn',
                    });
                  }} type='primary'>立即绑定</FTextBtn>
                </div>)
                : (<div className={styles.right}>
                  <FContentText text={settingPage.email} type='highlight' />
                  <div style={{ width: 30 }} />
                  <FTextBtn
                    type='primary'
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_ReplaceEmailBtn_Action>({
                        type: 'settingPage/onClick_ReplaceEmailBtn',
                      });
                    }}
                  >更换邮箱</FTextBtn>
                </div>)
            }

          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'手机号'} type='normal' />
            </div>
            {
              settingPage.phone === ''
                ? (<div className={styles.right}>
                  <FTipText text={'未绑定'} type='third' />
                  <div style={{ width: 30 }} />
                  <FTextBtn onClick={() => {
                    // onClick_BindEmailBtn_Action
                    dispatch<OnClick_BindPhoneBtn_Action>({
                      type: 'settingPage/onClick_BindPhoneBtn',
                    });
                  }} type='primary'>立即绑定</FTextBtn>
                </div>)
                : (<div className={styles.right}>
                  <FContentText text={settingPage.phone} type='highlight' />
                  <div style={{ width: 30 }} />
                  <FTextBtn
                    type='primary'
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_ReplacePhoneBtn_Action>({
                        type: 'settingPage/onClick_ReplacePhoneBtn',
                      });
                    }}
                  >更换号码</FTextBtn>
                </div>)
            }

          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'登陆密码'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={'密码必须包含数字和字母，长度必须为6-24个字'} type='highlight' />
              <div style={{ width: 30 }} />
              <FTextBtn onClick={() => {
                dispatch<OnClick_ChangePasswordBtn_Action>({
                  type: 'settingPage/onClick_ChangePasswordBtn',
                });
              }} type='primary'>修改密码</FTextBtn>
            </div>
          </div>
        </Space>
      </FFormLayout.FBlock>
    </FFormLayout>

    <Modal
      title='绑定邮箱'
      visible={settingPage.bindEmail_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_BindEmail_Modal_Action>({
          type: 'settingPage/onCancel_BindEmail_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'邮箱地址'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          value={settingPage.bindEmail_EmailInput}
          onChange={(e) => {
            // console.log('@#$#$#@$@$234234');
            dispatch<OnChange_BindEmail_EmailInput_Action>({
              type: 'settingPage/onChange_BindEmail_EmailInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlur_BindEmail_EmailInput_Action>({
              type: 'settingPage/onBlur_BindEmail_EmailInput',
            });
          }}
          errorText={settingPage.bindEmail_EmailInputError}
          placeholder='请输入邮箱'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.bindEmail_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_BindEmail_CaptchaInput_Action>({
                type: 'settingPage/onChange_BindEmail_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            style={{ width: 110 }}
            type='primary'
            disabled={settingPage.bindEmail_EmailInput === ''
            || settingPage.bindEmail_EmailInput_VerifyState !== 'verified'
            || settingPage.bindEmail_EmailInputError !== ''
            || settingPage.bindEmail_CaptchaWait > 0}
            onClick={() => {
              dispatch<OnClick_BindEmail_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_BindEmail_SendCaptchaBtn',
              });
            }}
          >{settingPage.bindEmail_CaptchaWait > 0 ? `${settingPage.bindEmail_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            type='primary'
            disabled={settingPage.bindEmail_EmailInput === ''
            || settingPage.bindEmail_EmailInput_VerifyState !== 'verified'
            || settingPage.bindEmail_EmailInputError !== ''
            || settingPage.bindEmail_CaptchaInput === ''}
            onClick={() => {
              dispatch<OnClick_BindEmail_ConfirmBtn_Action>({
                type: 'settingPage/onClick_BindEmail_ConfirmBtn',
              });
            }}
          >立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='更换邮箱身份验证'
      visible={settingPage.changeEmail_Old_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_ChangeEmail_Old_Modal_Action>({
          type: 'settingPage/onCancel_ChangeEmail_Old_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'原邮箱地址'} type='third' />

        <div style={{ height: 5 }} />
        <div className={styles.modalOldMedium}>
          {settingPage.email}
        </div>
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.changeEmail_Old_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_ChangeEmail_Old_CaptchaInput_Action>({
                type: 'settingPage/onChange_ChangeEmail_Old_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            // errorText={settingPage.changeEmail_Old_CaptchaInput}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            disabled={settingPage.changeEmail_Old_CaptchaWait > 0}
            style={{ width: 110 }}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangeEmail_Old_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_ChangeEmail_Old_SendCaptchaBtn',
              });
            }}
          >{settingPage.changeEmail_Old_CaptchaWait > 0 ? `${settingPage.changeEmail_Old_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            disabled={settingPage.changeEmail_Old_CaptchaInput === ''}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangeEmail_Old_NextBtn_Action>({
                type: 'settingPage/onClick_ChangeEmail_Old_NextBtn',
              });
            }}
          >下一步</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='输入新邮箱地址'
      visible={settingPage.changeEmail_New_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_ChangeEmail_New_Modal_Action>({
          type: 'settingPage/onCancel_ChangeEmail_New_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'新邮箱地址'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          value={settingPage.changeEmail_New_EmailInput}
          onChange={(e) => {
            dispatch<OnChange_ChangeEmail_New_EmailInput_Action>({
              type: 'settingPage/onChange_ChangeEmail_New_EmailInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlur_ChangeEmail_New_EmailInput_Action>({
              type: 'settingPage/onBlur_ChangeEmail_New_EmailInput',
            });
          }}
          errorText={settingPage.changeEmail_New_EmailInputError}
          placeholder='请输入邮箱'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.changeEmail_New_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_ChangeEmail_New_CaptchaInput_Action>({
                type: 'settingPage/onChange_ChangeEmail_New_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            disabled={settingPage.changeEmail_New_EmailInput === ''
            || settingPage.changeEmail_New_EmailInput_VerifyState !== 'verified'
            || settingPage.changeEmail_New_EmailInputError !== ''
            || settingPage.changeEmail_New_CaptchaWait > 0}
            style={{ width: 110 }}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangeEmail_New_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_ChangeEmail_New_SendCaptchaBtn',
              });
            }}
          >{settingPage.changeEmail_New_CaptchaWait > 0 ? `${settingPage.changeEmail_New_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            type='primary'
            disabled={settingPage.changeEmail_New_EmailInput === ''
            || settingPage.changeEmail_New_EmailInput_VerifyState !== 'verified'
            || settingPage.changeEmail_New_EmailInputError !== ''
            || settingPage.changeEmail_New_CaptchaInput === ''}
            onClick={() => {
              dispatch<OnClick_ChangeEmail_New_ConfirmBtn_Action>({
                type: 'settingPage/onClick_ChangeEmail_New_ConfirmBtn',
              });
            }}
          >立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='绑定手机'
      visible={settingPage.bindPhone_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_BindPhone_Modal_Action>({
          type: 'settingPage/onCancel_BindPhone_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'手机号'} type='third' />
        <div style={{ height: 5 }} />
        <FInput
          value={settingPage.bindPhone_PhoneInput}
          onChange={(e) => {
            dispatch<OnChange_BindPhone_PhoneInput_Action>({
              type: 'settingPage/onChange_BindPhone_PhoneInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlur_BindPhone_PhoneInput_Action>({
              type: 'settingPage/onBlur_BindPhone_PhoneInput',
            });
          }}
          errorText={settingPage.bindPhone_PhoneInputError}
          placeholder='请输入手机号'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.bindPhone_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_BindPhone_CaptchaInput_Action>({
                type: 'settingPage/onChange_BindPhone_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            disabled={settingPage.bindPhone_PhoneInput === ''
            || settingPage.bindPhone_PhoneInput_VerifyState !== 'verified'
            || settingPage.bindPhone_PhoneInputError !== ''
            || settingPage.bindPhone_CaptchaWait > 0}
            style={{ width: 110 }}
            type='primary'
            onClick={() => {
              dispatch<OnClick_BindPhone_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_BindPhone_SendCaptchaBtn',
              });
            }}
          >{settingPage.bindPhone_CaptchaWait > 0 ? `${settingPage.bindPhone_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            disabled={settingPage.bindPhone_PhoneInput === ''
            || settingPage.bindPhone_PhoneInput_VerifyState !== 'verified'
            || settingPage.bindPhone_PhoneInputError !== ''
            || settingPage.bindPhone_CaptchaInput === ''}
            type='primary'
            onClick={() => {
              dispatch<OnClick_BindPhone_ConfirmBtn_Action>({
                type: 'settingPage/onClick_BindPhone_ConfirmBtn',
              });
            }}
          >立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='更换手机号身份验证'
      visible={settingPage.changePhone_Old_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_ChangePhone_Old_Modal_Action>({
          type: 'settingPage/onCancel_ChangePhone_Old_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'原手机号'} type='third' />

        <div style={{ height: 5 }} />
        <div className={styles.modalOldMedium}>
          {settingPage.phone}
        </div>
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.changePhone_Old_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_ChangePhone_Old_CaptchaInput_Action>({
                type: 'settingPage/onChange_ChangePhone_Old_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            disabled={settingPage.changePhone_Old_CaptchaWait > 0}
            style={{ width: 110 }}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangePhone_Old_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_ChangePhone_Old_SendCaptchaBtn',
              });
            }}
          >{settingPage.changePhone_Old_CaptchaWait > 0 ? `${settingPage.changePhone_Old_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            disabled={settingPage.changePhone_Old_CaptchaInput === ''}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangePhone_Old_NextBtn_Action>({
                type: 'settingPage/onClick_ChangePhone_Old_NextBtn',
              });
            }}
          >下一步</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='输入新手机号'
      visible={settingPage.changePhone_New_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_ChangePhone_New_Modal_Action>({
          type: 'settingPage/onCancel_ChangePhone_New_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'新手机号'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          value={settingPage.changePhone_New_PhoneInput}
          onChange={(e) => {
            dispatch<OnChange_ChangePhone_New_PhoneInput_Action>({
              type: 'settingPage/onChange_ChangePhone_New_PhoneInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            // console.log('BBBBBBLLLLLUUUURRRR');
            dispatch<OnBlur_ChangePhone_New_PhoneInput_Action>({
              type: 'settingPage/onBlur_ChangePhone_New_PhoneInput',
            });
          }}
          errorText={settingPage.changePhone_New_PhoneInputError}
          placeholder='请输入手机号'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            value={settingPage.changePhone_New_CaptchaInput}
            onChange={(e) => {
              dispatch<OnChange_ChangePhone_New_CaptchaInput_Action>({
                type: 'settingPage/onChange_ChangePhone_New_CaptchaInput',
                payload: {
                  value: e.target.value,
                },
              });
            }}
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn
            disabled={settingPage.changePhone_New_PhoneInput === ''
            || settingPage.changePhone_New_PhoneInput_VerifyState !== 'verified'
            || settingPage.changePhone_New_PhoneInputError !== ''
            || settingPage.changePhone_New_CaptchaWait > 0}
            onClick={() => {
              // OnClick_ChangePhone_New_SendCaptchaBtn_Action
              dispatch<OnClick_ChangePhone_New_SendCaptchaBtn_Action>({
                type: 'settingPage/onClick_ChangePhone_New_SendCaptchaBtn',
              });
            }}
            style={{ width: 110 }}
            type='primary'
          >{settingPage.changePhone_New_CaptchaWait > 0 ? `${settingPage.changePhone_New_CaptchaWait}s` : '获取验证码'}</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            disabled={settingPage.changePhone_New_PhoneInput === ''
            || settingPage.changePhone_New_PhoneInput_VerifyState !== 'verified'
            || settingPage.changePhone_New_PhoneInputError !== ''
            || settingPage.changePhone_New_CaptchaInput === ''}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangePhone_New_ConfirmBtn_Action>({
                type: 'settingPage/onClick_ChangePhone_New_ConfirmBtn',
              });
            }}
          >立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='修改密码'
      visible={settingPage.changePassword_ModalVisible}
      onCancel={() => {
        dispatch<OnCancel_ChangePassword_Modal_Action>({
          type: 'settingPage/onCancel_ChangePassword_Modal',
        });
      }}
      footer={null}
      width={540}
    >
      <div className={styles.ModalContainer}>
        <div style={{ height: 15 }} />
        <FTipText text={'原密码'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          type='password'
          value={settingPage.changePassword_Old_PasswordInput}
          onChange={(e) => {
            dispatch<OnChange_ChangePassword_Old_PasswordInput_Action>({
              type: 'settingPage/onChange_ChangePassword_Old_PasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          placeholder='请输入原密码'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />

        <FTipText text={'新密码'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          type='password'
          value={settingPage.changePassword_New1_PasswordInput}
          errorText={settingPage.changePassword_New1_PasswordInput_Error}
          onChange={(e) => {
            dispatch<OnChange_ChangePassword_New1_PasswordInput_Action>({
              type: 'settingPage/onChange_ChangePassword_New1_PasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlur_ChangePassword_New1_PasswordInput_Action>({
              type: 'settingPage/onBlur_ChangePassword_New1_PasswordInput',
            });
          }}
          placeholder='请输入新密码'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />

        <div style={{ height: 25 }} />

        <FTipText text={'重新输入新密码'} type='third' />

        <div style={{ height: 5 }} />
        <FInput
          type='password'
          value={settingPage.changePassword_New2_PasswordInput}
          errorText={settingPage.changePassword_New2_PasswordInput_Error}
          onChange={(e) => {
            dispatch<OnChange_ChangePassword_New2_PasswordInput_Action>({
              type: 'settingPage/onChange_ChangePassword_New2_PasswordInput',
              payload: {
                value: e.target.value,
              },
            });
          }}
          onBlur={() => {
            dispatch<OnBlur_ChangePassword_New2_PasswordInput_Action>({
              type: 'settingPage/onBlur_ChangePassword_New2_PasswordInput',
            });
          }}
          placeholder='请输入新密码'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />

        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
            disabled={settingPage.changePassword_Old_PasswordInput === ''
            || settingPage.changePassword_New1_PasswordInput === '' || settingPage.changePassword_New1_PasswordInput_Error !== ''
            || settingPage.changePassword_New2_PasswordInput === '' || settingPage.changePassword_New2_PasswordInput_Error !== ''}
            type='primary'
            onClick={() => {
              dispatch<OnClick_ChangePassword_ConfirmBtn_Action>({
                type: 'settingPage/onClick_ChangePassword_ConfirmBtn',
              });
            }}
          >修改密码</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>
  </>);
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Security);
