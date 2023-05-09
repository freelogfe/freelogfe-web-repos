import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import FInput from '@/components/FInput';
import { Modal, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import {
  OnBlur_BindEmail_EmailInput_Action,
  OnBlur_BindPhone_PhoneInput_Action,
  OnBlur_ChangeEmail_New_EmailInput_Action,
  OnBlur_ChangePassword_New1_PasswordInput_Action,
  OnBlur_ChangePassword_New2_PasswordInput_Action,
  OnBlur_ChangePhone_New_PhoneInput_Action,
  OnCancel_BindEmail_Modal_Action,
  OnCancel_BindPhone_Modal_Action,
  OnCancel_ChangeEmail_New_Modal_Action,
  OnCancel_ChangeEmail_Old_Modal_Action,
  OnCancel_ChangeEmailVerifyPass_Action,
  OnCancel_ChangePassword_Modal_Action,
  OnCancel_ChangePhone_New_Modal_Action,
  OnCancel_ChangePhone_Old_Modal_Action,
  OnCancel_ChangePhoneVerifyPass_Action,
  OnChange_BindEmail_CaptchaInput_Action,
  OnChange_BindEmail_CaptchaWait_Action,
  OnChange_BindEmail_EmailInput_Action,
  OnChange_BindPhone_CaptchaInput_Action,
  OnChange_BindPhone_CaptchaWait_Action,
  OnChange_BindPhone_PhoneInput_Action,
  OnChange_ChangeEmail_New_CaptchaInput_Action,
  OnChange_ChangeEmail_New_CaptchaWait_Action,
  OnChange_ChangeEmail_New_EmailInput_Action,
  OnChange_ChangeEmail_Old_CaptchaInput_Action,
  OnChange_ChangeEmail_Old_CaptchaWait_Action,
  OnChange_ChangePassword_New1_PasswordInput_Action,
  OnChange_ChangePassword_New2_PasswordInput_Action,
  OnChange_ChangePassword_Old_PasswordInput_Action,
  OnChange_ChangePhone_New_CaptchaInput_Action,
  OnChange_ChangePhone_New_CaptchaWait_Action,
  OnChange_ChangePhone_New_PhoneInput_Action,
  OnChange_ChangePhone_Old_CaptchaInput_Action,
  OnChange_ChangePhone_Old_CaptchaWait_Action,
  OnClick_BindEmail_ConfirmBtn_Action,
  OnClick_BindEmail_SendCaptchaBtn_Action,
  OnClick_BindEmailBtn_Action,
  OnClick_BindPhone_ConfirmBtn_Action,
  OnClick_BindPhone_SendCaptchaBtn_Action,
  OnClick_BindPhoneBtn_Action,
  OnClick_ChangeEmail_New_ConfirmBtn_Action,
  OnClick_ChangeEmail_New_SendCaptchaBtn_Action,
  OnClick_ChangeEmail_Old_NextBtn_Action,
  OnClick_ChangeEmail_Old_SendCaptchaBtn_Action,
  OnClick_ChangeEmailVerifyPass_NextBtn_Action,
  OnClick_ChangePassword_ConfirmBtn_Action,
  OnClick_ChangePasswordBtn_Action,
  OnClick_ChangePhone_New_ConfirmBtn_Action,
  OnClick_ChangePhone_New_SendCaptchaBtn_Action,
  OnClick_ChangePhone_Old_NextBtn_Action,
  OnClick_ChangePhone_Old_SendCaptchaBtn_Action,
  OnClick_ChangePhoneVerifyPass_NextBtn_Action,
  OnClick_ReplaceEmailBtn_Action,
  OnClick_ReplacePhoneBtn_Action,
} from '@/models/settingPage';
import * as AHooks from 'ahooks';
import FVerifyUserPasswordModal from '@/components/FVerifyUserPasswordModal';
import useUrlState from '@ahooksjs/use-url-state';
import bindSuccess from '@/assets/bind-success.png';
import unbindSuccess from '@/assets/unbind-success.png';
import bindWarning from '@/assets/bind-warning.png';
import bindError from '@/assets/bind-error.png';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { getUrlOfBindingWechat } from '@/utils';
import FPasswordInput from '@/components/FPasswordInput';
import FPhoneInput from '@/components/FPhoneInput';

interface SecurityProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Security({ dispatch, settingPage }: SecurityProps) {
  // console.log(settingPage, '9803ieosdkljflsdkfjsdlkfjs;ldfjj');
  const [verifyPassword, setVerifyPassword] = React.useState(false);
  const [bindMap, setBindMap] = React.useState<Map<string, any>>(new Map());
  // 1:绑定成功 2:绑定失败 3:此微信账号已经绑定了其他Freelog账号，请换一个账号绑定
  // 数据类型要严格分一下，现在太乱了，后面增加微博就更加了
  const [bindTip, setBindTip] = React.useState<{
    type: 'success' | 'warn' | 'error';
    msg: string;
    closable: boolean;
    className: string;
    icon: any;
    way: 'bind' | 'unbind';
  }>({
    type: 'success',
    msg: '',
    closable: false,
    className: 'h-238',
    icon: bindSuccess,
    way: 'bind',
  });
  const [urlParams] = useUrlState<{ type: string; status: string | number }>();

  async function unBind(password: string) {
    setVerifyPassword(false);
    const data = await FServiceAPI.User.thirdPartyUnbind({
      thirdPartyType: 'weChat',
      password,
    });
    if (data.errCode === 0) {
      setBindTip({
        type: 'success',
        msg: '已解除绑定',
        closable: false,
        className: 'h-238',
        icon: unbindSuccess,
        way: 'unbind',
      });
      setTimeout(() => {
        setBindTip({
          type: 'success',
          msg: '',
          closable: false,
          className: 'h-238',
          icon: bindSuccess,
          way: 'bind',
        });
      }, 2000);
      getBind();
    } else {
      setBindTip({
        type: 'warn',
        msg: data.msg,
        closable: true,
        className: 'h-309',
        icon: bindWarning,
        way: 'unbind',
      });
    }
    return;
  }

  function goBind(data: any) {
    self.open(getUrlOfBindingWechat({
      // returnUrl: 'http://user.testfreelog.com/logged/setting',
      returnUrl: FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.setting(),
      state: data.state,
    }));
  }

  async function getBind() {
    const data = await FServiceAPI.User.thirdPartyList();
    // console.log(data);
    const map = new Map();
    data.data.forEach((item: any) => {
      map.set(item.thirdPartyType, { ...item });
    });
    setBindMap(map);
  }

  AHooks.useMount(() => {
    getBind();
    if (urlParams.type === 'wechat') {
      let data: any = {
        msg: '绑定成功',
        type: 'success',
        className: 'h-214',
        closable: false,
        icon: bindSuccess,
        way: 'bind',
      };
      if (urlParams.status == '2') {
        data.icon = bindError;
        data.msg = '绑定失败';
        data.closable = true;
        data.type = 'error';
        data.className = 'h-309';
      } else if (urlParams.status == '3') {
        data.type = 'warn';
        data.icon = bindWarning;
        data.closable = true;
        data.className = 'h-309';
        data.msg = '此微信账号已经绑定了其他Freelog账号，请换一个账号绑定';
      }
      setBindTip({ ...data });
      if (data.type === 'success') {
        setTimeout(() => {
          setBindTip({
            type: 'success',
            msg: '',
            closable: false,
            className: 'h-238',
            icon: bindSuccess,
            way: 'bind',
          });
        }, 2000);
      }
    }
  });
  AHooks.useInterval(
    () => {
      dispatch<OnChange_BindEmail_CaptchaWait_Action>({
        type: 'settingPage/onChange_BindEmail_CaptchaWait',
        payload: {
          value: settingPage.bindEmail_CaptchaWait - 1,
        },
      });
    },
    settingPage.bindEmail_CaptchaWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      // console.log(settingPage.changeEmail_Old_CaptchaWait, '64456456settingPage.changeEmail_Old_CaptchaWait');
      dispatch<OnChange_ChangeEmail_Old_CaptchaWait_Action>({
        type: 'settingPage/onChange_ChangeEmail_Old_CaptchaWait',
        payload: {
          value: settingPage.changeEmail_Old_CaptchaWait - 1,
        },
      });
    },
    settingPage.changeEmail_Old_CaptchaWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_ChangeEmail_New_CaptchaWait_Action>({
        type: 'settingPage/onChange_ChangeEmail_New_CaptchaWait',
        payload: {
          value: settingPage.changeEmail_New_CaptchaWait - 1,
        },
      });
    },
    settingPage.changeEmail_New_CaptchaWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_BindPhone_CaptchaWait_Action>({
        type: 'settingPage/onChange_BindPhone_CaptchaWait',
        payload: {
          value: settingPage.bindPhone_CaptchaWait - 1,
        },
      });
    },
    settingPage.bindPhone_CaptchaWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_ChangePhone_Old_CaptchaWait_Action>({
        type: 'settingPage/onChange_ChangePhone_Old_CaptchaWait',
        payload: {
          value: settingPage.changePhone_Old_CaptchaWait - 1,
        },
      });
    },
    settingPage.changePhone_Old_CaptchaWait === 0 ? undefined : 1000,
  );

  AHooks.useInterval(
    () => {
      dispatch<OnChange_ChangePhone_New_CaptchaWait_Action>({
        type: 'settingPage/onChange_ChangePhone_New_CaptchaWait',
        payload: {
          value: settingPage.changePhone_New_CaptchaWait - 1,
        },
      });
    },
    settingPage.changePhone_New_CaptchaWait === 0 ? undefined : 1000,
  );

  return (
    <>
      <FFormLayout>
        <FFormLayout.FBlock title={'账号安全'}>
          <Space size={10} direction='vertical' className={styles.info}>
            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'用户名'} type='normal' />
              </div>
              <div className={styles.right}>
                <FComponentsLib.FContentText
                  text={settingPage.username}
                  type='highlight'
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'邮箱'} type='normal' />
              </div>
              {settingPage.email === '' ? (
                <div className={styles.right}>
                  <FComponentsLib.FTipText text={'未绑定'} type='third' />
                  <div style={{ width: 30 }} />
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_BindEmailBtn_Action>({
                        type: 'settingPage/onClick_BindEmailBtn',
                      });
                    }}
                    type='primary'
                  >
                    立即绑定
                  </FComponentsLib.FTextBtn>
                </div>
              ) : (
                <div className={styles.right}>
                  <FComponentsLib.FContentText
                    text={settingPage.email}
                    type='highlight'
                  />
                  <div style={{ width: 30 }} />
                  <FComponentsLib.FTextBtn
                    type='primary'
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_ReplaceEmailBtn_Action>({
                        type: 'settingPage/onClick_ReplaceEmailBtn',
                      });
                    }}
                  >
                    更换邮箱
                  </FComponentsLib.FTextBtn>
                </div>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'手机号'} type='normal' />
              </div>
              {settingPage.phone === '' ? (
                <div className={styles.right}>
                  <FComponentsLib.FTipText text={'未绑定'} type='third' />
                  <div style={{ width: 30 }} />
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_BindPhoneBtn_Action>({
                        type: 'settingPage/onClick_BindPhoneBtn',
                      });
                    }}
                    type='primary'
                  >
                    立即绑定
                  </FComponentsLib.FTextBtn>
                </div>
              ) : (
                <div className={styles.right}>
                  <FComponentsLib.FContentText
                    text={settingPage.phone}
                    type='highlight'
                  />
                  <div style={{ width: 30 }} />
                  <FComponentsLib.FTextBtn
                    type='primary'
                    onClick={() => {
                      // onClick_BindEmailBtn_Action
                      dispatch<OnClick_ReplacePhoneBtn_Action>({
                        type: 'settingPage/onClick_ReplacePhoneBtn',
                      });
                    }}
                  >
                    更换号码
                  </FComponentsLib.FTextBtn>
                </div>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'登陆密码'} type='normal' />
              </div>
              <div className={styles.right}>
                <FComponentsLib.FContentText
                  text={'密码必须包含数字和字母，长度必须为6-24个字'}
                  type='highlight'
                />
                <div style={{ width: 30 }} />
                <FComponentsLib.FTextBtn
                  onClick={() => {
                    dispatch<OnClick_ChangePasswordBtn_Action>({
                      type: 'settingPage/onClick_ChangePasswordBtn',
                    });
                  }}
                  type='primary'
                >
                  修改密码
                </FComponentsLib.FTextBtn>
              </div>
            </div>
          </Space>
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'第三方账号绑定'}>
          <Space size={10} direction='vertical' className={styles.info}>
            <div className={styles.row}>
              <div className={styles.left}>
                <FComponentsLib.FContentText text={'微信'} type='normal' />
              </div>
              {!bindMap.get('weChat') ? (
                <div className={styles.right}>
                  <FComponentsLib.FTipText text={'未绑定'} type='third' />
                  <div style={{ width: 30 }} />
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      // self.open(FUtil.LinkTo.binding());
                      setBindTip({
                        type: 'success',
                        msg: '',
                        closable: false,
                        className: 'h-238',
                        icon: bindSuccess,
                        way: 'bind',
                      });
                      setVerifyPassword(true);
                      // self.open(FUtil.LinkTo.binding());
                    }}
                    type='primary'
                  >
                    立即绑定
                  </FComponentsLib.FTextBtn>
                </div>
              ) : (
                <div className={styles.right}>
                  <FComponentsLib.FContentText
                    text={bindMap.get('weChat').name}
                    type='highlight'
                  />
                  <div style={{ width: 30 }} />
                  {location.host.includes('testfreelog.com') ? <FComponentsLib.FTextBtn
                    type='danger'
                    onClick={() => {
                      if (!settingPage.email && !settingPage.phone) {
                        setBindTip({
                          type: 'warn',
                          msg: '为了你的账号安全，请先绑定手机号或者邮箱再进行解绑微信操作',
                          closable: true,
                          className: 'h-357',
                          icon: bindWarning,
                          way: 'unbind',
                        });
                        return;
                      }
                      setBindTip({
                        type: 'success',
                        msg: '',
                        closable: false,
                        className: 'h-238',
                        icon: bindSuccess,
                        way: 'unbind',
                      });
                      setVerifyPassword(true);
                    }}
                  >
                    解绑
                  </FComponentsLib.FTextBtn> : null}
                </div>
              )}
            </div>
          </Space>
          <FVerifyUserPasswordModal
            visible={verifyPassword}
            actionReturn={bindTip.way === 'unbind' ? unBind : undefined}
            onCancel={() => {
              setVerifyPassword(false);
            }}
            onSuccess={bindTip.way === 'unbind' ? undefined : (data) => {
              // console.log(data, 'data09oiw4ejfslkdfjsldkj');
              setVerifyPassword(false);
              goBind(data);
            }}
          />
        </FFormLayout.FBlock>
      </FFormLayout>
      <Modal
        footer={null}
        centered
        width={bindTip.type === 'success' ? 360 : 571}
        closable={bindTip.closable}
        onCancel={() => {
          setBindTip({
            type: 'success',
            msg: '',
            closable: false,
            className: 'h-238',
            icon: bindSuccess,
            way: 'bind',
          });
        }}
        visible={!!bindTip.msg}
      >
        <div className={bindTip.className + ' flex-column-center w-100x'}>
          {bindTip.type === 'warn' ? (
            <span className={styles.title + ' mb-60'}>提示</span>
          ) : null}
          <div
            className={
              (bindTip.type === 'success' ? ' h-100' : ' h-72') + ' '
            }
          >
            <div className='over-h h-100x'>
              <img src={bindTip.icon} alt='' className='h-100x' />
            </div>
          </div>
          <div className={styles.tip + ' mt-30'}>{bindTip.msg}</div>
          {bindTip.type !== 'success' ? (
            <FComponentsLib.FRectBtn
              type='primary'
              className=' mt-50 py-9'
              onClick={() => {
                setBindTip({
                  type: 'success',
                  msg: '',
                  closable: false,
                  className: 'h-238',
                  icon: bindSuccess,
                  way: 'bind',
                });
                if (bindTip.way === 'bind') {
                  setVerifyPassword(true);
                }
              }}
            >
              {bindTip.way === 'bind' ? '重新扫码' : '知道了'}
            </FComponentsLib.FRectBtn>
          ) : null}
        </div>
      </Modal>
      <Modal
        title='绑定邮箱'
        visible={settingPage.showModal === 'bindEmail'}
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
          <FComponentsLib.FTipText text={'邮箱地址'} type='third' />

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
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              style={{ width: 110 }}
              type='primary'
              disabled={
                settingPage.bindEmail_EmailInput === '' ||
                settingPage.bindEmail_EmailInput_VerifyState !== 'verified' ||
                settingPage.bindEmail_EmailInputError !== '' ||
                settingPage.bindEmail_CaptchaWait > 0
              }
              onClick={() => {
                dispatch<OnClick_BindEmail_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_BindEmail_SendCaptchaBtn',
                });
              }}
            >
              {settingPage.bindEmail_CaptchaWait > 0
                ? `${settingPage.bindEmail_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              type='primary'
              disabled={
                settingPage.bindEmail_EmailInput === '' ||
                settingPage.bindEmail_EmailInput_VerifyState !== 'verified' ||
                settingPage.bindEmail_EmailInputError !== '' ||
                settingPage.bindEmail_CaptchaInput === ''
              }
              onClick={() => {
                dispatch<OnClick_BindEmail_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_BindEmail_ConfirmBtn',
                });
              }}
            >
              立即绑定
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <FVerifyUserPasswordModal
        visible={settingPage.showModal === 'changeEmail_VerifyPass'}
        onCancel={() => {
          dispatch<OnCancel_ChangeEmailVerifyPass_Action>({
            type: 'settingPage/onCancel_ChangeEmailVerifyPass',
          });
        }}
        onSuccess={() => {
          dispatch<OnClick_ChangeEmailVerifyPass_NextBtn_Action>({
            type: 'settingPage/onClick_ChangeEmailVerifyPass_NextBtn',
          });
        }}
      />

      <Modal
        title='更换邮箱身份验证'
        visible={settingPage.showModal === 'changeEmail_Old'}
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
          <FComponentsLib.FTipText text={'原邮箱地址'} type='third' />

          <div style={{ height: 5 }} />
          <div className={styles.modalOldMedium}>{settingPage.email}</div>
          <div style={{ height: 25 }} />
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              disabled={settingPage.changeEmail_Old_CaptchaWait > 0}
              style={{ width: 110 }}
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangeEmail_Old_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_ChangeEmail_Old_SendCaptchaBtn',
                });
              }}
            >
              {settingPage.changeEmail_Old_CaptchaWait > 0
                ? `${settingPage.changeEmail_Old_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              disabled={settingPage.changeEmail_Old_CaptchaInput === ''}
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangeEmail_Old_NextBtn_Action>({
                  type: 'settingPage/onClick_ChangeEmail_Old_NextBtn',
                });
              }}
            >
              下一步
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <Modal
        title='输入新邮箱地址'
        visible={settingPage.showModal === 'changeEmail_New'}
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
          <FComponentsLib.FTipText text={'新邮箱地址'} type='third' />

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
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.changeEmail_New_EmailInput === '' ||
                settingPage.changeEmail_New_EmailInput_VerifyState !==
                'verified' ||
                settingPage.changeEmail_New_EmailInputError !== '' ||
                settingPage.changeEmail_New_CaptchaWait > 0
              }
              style={{ width: 110 }}
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangeEmail_New_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_ChangeEmail_New_SendCaptchaBtn',
                });
              }}
            >
              {settingPage.changeEmail_New_CaptchaWait > 0
                ? `${settingPage.changeEmail_New_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              type='primary'
              disabled={
                settingPage.changeEmail_New_EmailInput === '' ||
                settingPage.changeEmail_New_EmailInput_VerifyState !==
                'verified' ||
                settingPage.changeEmail_New_EmailInputError !== '' ||
                settingPage.changeEmail_New_CaptchaInput === ''
              }
              onClick={() => {
                dispatch<OnClick_ChangeEmail_New_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_ChangeEmail_New_ConfirmBtn',
                });
              }}
            >
              立即绑定
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <Modal
        title='绑定手机'
        visible={settingPage.showModal === 'bindPhone'}
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
          <FComponentsLib.FTipText text={'手机号'} type='third' />
          <div style={{ height: 5 }} />
          <FPhoneInput
            inputValue={settingPage.bindPhone_PhoneInput}
            onChangeInput={(value) => {
              dispatch<OnChange_BindPhone_PhoneInput_Action>({
                type: 'settingPage/onChange_BindPhone_PhoneInput',
                payload: {
                  value: value,
                },
              });
            }}
            onBlurInput={() => {
              dispatch<OnBlur_BindPhone_PhoneInput_Action>({
                type: 'settingPage/onBlur_BindPhone_PhoneInput',
              });
            }}
            // errorText={settingPage.bindPhone_PhoneInputError}
            placeholder='请输入手机号'
            // className={styles.modalBlockInput}
            // wrapClassName={styles.modalBlockInput}
          />
          {
            settingPage.bindPhone_PhoneInputError && (<>
              <div style={{ height: 5 }} />
              <div style={{ color: 'red' }}>{settingPage.bindPhone_PhoneInputError}</div>
            </>)
          }


          <div style={{ height: 25 }} />
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.bindPhone_PhoneInput === '' ||
                settingPage.bindPhone_PhoneInput_VerifyState !== 'verified' ||
                settingPage.bindPhone_PhoneInputError !== '' ||
                settingPage.bindPhone_CaptchaWait > 0
              }
              style={{ width: 110 }}
              type='primary'
              onClick={() => {
                dispatch<OnClick_BindPhone_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_BindPhone_SendCaptchaBtn',
                });
              }}
            >
              {settingPage.bindPhone_CaptchaWait > 0
                ? `${settingPage.bindPhone_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.bindPhone_PhoneInput === '' ||
                settingPage.bindPhone_PhoneInput_VerifyState !== 'verified' ||
                settingPage.bindPhone_PhoneInputError !== '' ||
                settingPage.bindPhone_CaptchaInput === ''
              }
              type='primary'
              onClick={() => {
                dispatch<OnClick_BindPhone_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_BindPhone_ConfirmBtn',
                });
              }}
            >
              立即绑定
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <FVerifyUserPasswordModal
        visible={settingPage.showModal === 'changePhone_VerifyPass'}
        onCancel={() => {
          dispatch<OnCancel_ChangePhoneVerifyPass_Action>({
            type: 'settingPage/onCancel_ChangePhoneVerifyPass',
          });
        }}
        onSuccess={() => {
          dispatch<OnClick_ChangePhoneVerifyPass_NextBtn_Action>({
            type: 'settingPage/onClick_ChangePhoneVerifyPass_NextBtn',
          });
        }}
      />

      <Modal
        title='更换手机号身份验证'
        visible={settingPage.showModal === 'changePhone_Old'}
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
          <FComponentsLib.FTipText text={'原手机号'} type='third' />

          <div style={{ height: 5 }} />
          <div className={styles.modalOldMedium}>{settingPage.phone}</div>
          <div style={{ height: 25 }} />
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              disabled={settingPage.changePhone_Old_CaptchaWait > 0}
              style={{ width: 110 }}
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangePhone_Old_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_ChangePhone_Old_SendCaptchaBtn',
                });
              }}
            >
              {settingPage.changePhone_Old_CaptchaWait > 0
                ? `${settingPage.changePhone_Old_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              disabled={settingPage.changePhone_Old_CaptchaInput === ''}
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangePhone_Old_NextBtn_Action>({
                  type: 'settingPage/onClick_ChangePhone_Old_NextBtn',
                });
              }}
            >
              下一步
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <Modal
        title='输入新手机号'
        visible={settingPage.showModal === 'changePhone_New'}
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
          <FComponentsLib.FTipText text={'新手机号'} type='third' />

          <div style={{ height: 5 }} />
          <FPhoneInput
            inputValue={settingPage.changePhone_New_PhoneInput}
            onChangeInput={(value) => {
              dispatch<OnChange_ChangePhone_New_PhoneInput_Action>({
                type: 'settingPage/onChange_ChangePhone_New_PhoneInput',
                payload: {
                  value: value,
                },
              });
            }}
            onBlurInput={() => {
              // console.log('BBBBBBLLLLLUUUURRRR');
              dispatch<OnBlur_ChangePhone_New_PhoneInput_Action>({
                type: 'settingPage/onBlur_ChangePhone_New_PhoneInput',
              });
            }}
            // errorText={settingPage.changePhone_New_PhoneInputError}
            placeholder='请输入手机号'
            // className={styles.modalBlockInput}
            // wrapClassName={styles.modalBlockInput}
          />
          {
            settingPage.changePhone_New_PhoneInputError && (<>
              <div style={{ height: 5 }} />
              <div style={{ color: 'red' }}>{settingPage.changePhone_New_PhoneInputError}</div>
            </>)
          }
          <div style={{ height: 25 }} />
          <FComponentsLib.FTipText text={'验证码'} type='third' />
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
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.changePhone_New_PhoneInput === '' ||
                settingPage.changePhone_New_PhoneInput_VerifyState !==
                'verified' ||
                settingPage.changePhone_New_PhoneInputError !== '' ||
                settingPage.changePhone_New_CaptchaWait > 0
              }
              onClick={() => {
                // OnClick_ChangePhone_New_SendCaptchaBtn_Action
                dispatch<OnClick_ChangePhone_New_SendCaptchaBtn_Action>({
                  type: 'settingPage/onClick_ChangePhone_New_SendCaptchaBtn',
                });
              }}
              style={{ width: 110 }}
              type='primary'
            >
              {settingPage.changePhone_New_CaptchaWait > 0
                ? `${settingPage.changePhone_New_CaptchaWait}s`
                : '获取验证码'}
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.changePhone_New_PhoneInput === '' ||
                settingPage.changePhone_New_PhoneInput_VerifyState !==
                'verified' ||
                settingPage.changePhone_New_PhoneInputError !== '' ||
                settingPage.changePhone_New_CaptchaInput === ''
              }
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangePhone_New_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_ChangePhone_New_ConfirmBtn',
                });
              }}
            >
              立即绑定
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>

      <Modal
        title='修改密码'
        visible={settingPage.showModal === 'changePassword'}
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
          <FComponentsLib.FTipText text={'原密码'} type='third' />

          <div style={{ height: 5 }} />
          <FPasswordInput
            // type='password'
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
            // wrapClassName={styles.modalBlockInput}
          />
          <div style={{ height: 25 }} />

          <FComponentsLib.FTipText text={'新密码'} type='third' />

          <div style={{ height: 5 }} />
          <FPasswordInput
            // type='password'
            value={settingPage.changePassword_New1_PasswordInput}
            // errorText={}
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
            // wrapClassName={styles.modalBlockInput}
          />

          {
            settingPage.changePassword_New1_PasswordInput_Error && (<>
              <div style={{ height: 5 }} />
              <div style={{ color: 'red' }}>{settingPage.changePassword_New1_PasswordInput_Error}</div>
            </>)
          }

          <div style={{ height: 25 }} />

          <FComponentsLib.FTipText text={FI18n.i18nNext.t('account_reenter_password')} type='third' />

          <div style={{ height: 5 }} />
          <FPasswordInput
            // type='password'
            value={settingPage.changePassword_New2_PasswordInput}
            // errorText={settingPage.changePassword_New2_PasswordInput_Error}
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
            placeholder={FI18n.i18nNext.t('account_reenter_password_hint')}
            className={styles.modalBlockInput}
            // wrapClassName={styles.modalBlockInput}
          />

          {
            settingPage.changePassword_New2_PasswordInput_Error && (<>
              <div style={{ height: 5 }} />
              <div style={{ color: 'red' }}>{settingPage.changePassword_New2_PasswordInput_Error}</div>
            </>)
          }

          <div style={{ height: 80 }} />
          <div className={styles.modalFooter}>
            <FComponentsLib.FRectBtn
              disabled={
                settingPage.changePassword_Old_PasswordInput === '' ||
                settingPage.changePassword_New1_PasswordInput === '' ||
                settingPage.changePassword_New1_PasswordInput_Error !== '' ||
                settingPage.changePassword_New2_PasswordInput === '' ||
                settingPage.changePassword_New2_PasswordInput_Error !== ''
              }
              type='primary'
              onClick={() => {
                dispatch<OnClick_ChangePassword_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_ChangePassword_ConfirmBtn',
                });
              }}
            >
              修改密码
            </FComponentsLib.FRectBtn>
          </div>
          <div style={{ height: 5 }} />
        </div>
      </Modal>
    </>
  );
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Security);
