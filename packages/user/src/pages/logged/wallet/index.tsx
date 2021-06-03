import * as React from 'react';
import styles from './index.less';
import {FContentText, FTipText, FTitleText} from '@/components/FText';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import FSafetyLock from "@/components/FIcons/FSafetyLock";
import FTable from "@/components/FTable";
import {ColumnsType} from "antd/lib/table";
import {Modal, Space, Radio, message} from 'antd';
import FInput from "@/components/FInput";
import * as AHooks from 'ahooks';
import {connect, Dispatch} from 'dva';
import {ConnectState, UserModelState, WalletPageModelState} from "@/models/connect";
import {ActiveAccountAction, ChangeAction, ChangePasswordAction, FetchAccountInfoAction} from "@/models/walletPage";
import {PAY_PASSWORD} from "@/utils/regexp";
import {FCheck} from "@/components/FIcons";
import FLoadingTip from "@/components/FLoadingTip";

interface WalletProps {
  dispatch: Dispatch;
  walletPage: WalletPageModelState;
  user: UserModelState;
}

function Wallet({dispatch, walletPage, user}: WalletProps) {

  AHooks.useMount(() => {
    dispatch<FetchAccountInfoAction>({
      type: 'walletPage/fetchAccountInfo',
    });
  });

  async function onChange(payload: Partial<WalletPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'walletPage/change',
      payload,
    });
  }

  const columns: ColumnsType<{
    serialNo: string;
    date: string;
    time: string;
    digest: string;
    reciprocalAccountId: string;
    reciprocalAccountName: string;
    reciprocalAccountType: string;
    transactionAmount: string;
    afterBalance: string;
    status: 1 | 2 | 3 | 4;
  }> = [
    {
      title: (<FTitleText text={'时间'} type="table"/>),
      dataIndex: 'dataTime',
      key: 'dataTime',
      render(_, record) {
        return (<div>
          {
            record.date && (<FContentText text={record.date} type="normal"/>)
          }
          <FContentText text={record.time} type="normal"/>
        </div>);
      }
    }, {
      title: (<FTitleText text={'交易说明｜对方｜流水号'} type="table"/>),
      dataIndex: 'num',
      key: 'num',
      render(_, record) {
        return (<div>
          <FContentText
            text={record.digest}
            type="highlight"
          />
          <FContentText
            text={`${record.reciprocalAccountName}｜${record.serialNo}`}
            type="additional1"
          />
        </div>);
      }
    }, {
      title: (<FTitleText text={'金额'} type="table"/>),
      dataIndex: 'amount',
      key: 'amount',
      render(_, record) {
        return (<div>
          <FTitleText
            text={record.transactionAmount.startsWith('-') ? record.transactionAmount : ('+' + record.transactionAmount)}
            type="h1"
          />
          <FContentText
            text={`余额 ${record.afterBalance}`}
            type="additional1"
          />
        </div>);
      }
    }, {
      title: (<FTitleText text={'交易状态'} type="table"/>),
      dataIndex: 'status',
      key: 'status',
      render(_, record) {
        const allStatus = ['交易确认中', '交易成功', '交易取消', '交易失败'];
        if (true) {
          return (<div className={styles.tipProcessing}>{allStatus[record.status]}</div>);
        }
        return (<div className={styles.tipCompleted}>{allStatus[record.status]}</div>);
      }
    },
  ];

  if (walletPage.accountStatus === -1) {
    return (<FLoadingTip height={'calc(100vh - 70px)'}/>);
  }

  return (<div className={styles.styles}>
    <div style={{height: 40}}/>
    <FTitleText
      type="h1"
      text={'羽币账户'}
    />
    <div style={{height: 20}}/>
    {
      walletPage.accountStatus === 0
        ? (<div className={styles.Inactive}>
          <FTipText text={'账户未激活，点击按钮激活'} type="second"/>
          <div style={{width: 30}}/>
          <FRectBtn
            type="primary"
            onClick={() => {
              onChange({
                activatingAccount: true,
                activatingAccountMobile: user.userInfo?.mobile || '',
                activatingAccountEmail: user.userInfo?.email || '',
                activatingAccountType: user.userInfo?.mobile ? 'mobile' : 'email',
              });
            }}
          >激活账户</FRectBtn>
        </div>)
        : (<>
          <div className={styles.AccountInfo}>
            <div>
              <FTitleText
                type="h4"
                text={'账户余额（枚）'}
              />
              <div style={{height: 15}}/>
              <div className={styles.Gold}>{walletPage.accountBalance}</div>
            </div>
            <div
              className={styles.ChangePassword}
              onClick={() => {
                onChange({
                  changingPassword: true,
                  changingPasswordMobile: user.userInfo?.mobile || '',
                  changingPasswordEmail: user.userInfo?.email || '',
                  changingPasswordType: user.userInfo?.mobile ? 'mobile' : 'email',
                });
              }}
            >
              <FSafetyLock style={{fontSize: 32, color: '#DA6666'}}/>
              {/*<div style={{height: 10}}/>*/}
              <div style={{color: '#333', fontSize: 13}}>修改支付密码</div>
            </div>
          </div>
          {
            walletPage.transactionRecord.length > 0 && (<>
              <div style={{height: 40}}/>
              <FTitleText type="h1" text={'交易记录'}/>
              <div style={{height: 20}}/>
              <FTable
                columns={columns}
                dataSource={walletPage.transactionRecord.map((tr) => {
                  return {
                    key: tr.serialNo,
                    ...tr,
                  };
                })}
              />
            </>)
          }

        </>)
    }
    <div style={{height: 100}}/>

    <Modal
      title={<FTitleText text={'激活账户验证'} type="popup"/>}
      visible={walletPage.activatingAccount}
      // onOk={handleOk}
      onCancel={() => {
        onChange({
          activatingAccount: false,
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction="vertical" style={{width: 320}}>
          <Space size={15} direction="vertical">
            <FTipText type="third" text={'验证方式'}/>
            {
              walletPage.activatingAccountMobile && (<Space size={2}>
                <Radio
                  checked={walletPage.activatingAccountType === 'mobile'}
                  onChange={(e) => {
                    onChange({
                      activatingAccountType: 'mobile',
                    });
                  }}
                />
                <FContentText text={walletPage.activatingAccountMobile} type="normal"/>
              </Space>)
            }

            {
              walletPage.activatingAccountEmail && (<Space size={2}>
                <Radio
                  checked={walletPage.activatingAccountType === 'email'}
                  onChange={(e) => {
                    onChange({
                      activatingAccountType: 'email',
                    });
                  }}
                />
                <FContentText text={walletPage.activatingAccountEmail} type="normal"/>
              </Space>)
            }

          </Space>

          <div>
            <FTipText type="third" text={'验证码'}/>
            <div style={{height: 5}}/>
            <Space size={10}>
              <FInput
                className={styles.verificationCodeInput}
                wrapClassName={styles.verificationCodeInput}
                size="middle"
              />
              <FRectBtn
                style={{width: 110}}
                type="primary"
              >获取验证码</FRectBtn>
            </Space>
          </div>

          <div>
            <FTipText type="third" text={'支付密码'}/>
            <div style={{height: 5}}/>
            <FInput
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size="middle"
              value={walletPage.activatingAccountPasswordOne}
              errorText={walletPage.activatingAccountPasswordOneError}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  activatingAccountPasswordOne: value,
                  activatingAccountPasswordOneError: PAY_PASSWORD.test(value) ? '' : '必须为6为数字',
                  activatingAccountPasswordTwoError: (walletPage.activatingAccountPasswordTwo && value !== walletPage.activatingAccountPasswordTwo) ? '两次密码必须一致' : '',
                });
              }}
            />
          </div>

          <div>
            <FTipText type="third" text={'验证支付密码'}/>
            <div style={{height: 5}}/>
            <FInput
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size="middle"
              value={walletPage.activatingAccountPasswordTwo}
              errorText={walletPage.activatingAccountPasswordTwoError}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  activatingAccountPasswordTwo: value,
                  activatingAccountPasswordTwoError: value === walletPage.activatingAccountPasswordOne ? '' : '两次密码必须一致',
                });
              }}
            />
          </div>
        </Space>
        <div style={{height: 40}}/>
        <FRectBtn
          type="primary"
          disabled={!walletPage.activatingAccountPasswordOne
          || !walletPage.activatingAccountPasswordTwo
          || !!walletPage.activatingAccountPasswordOneError
          || !!walletPage.activatingAccountPasswordTwoError}
          onClick={() => {
            dispatch<ActiveAccountAction>({
              type: 'walletPage/activeAccount',
            });
          }}
        >激活feth账户</FRectBtn>
      </div>

    </Modal>

    <Modal
      title={<FTitleText text={'修改支付密码'} type="popup"/>}
      visible={walletPage.changingPassword}
      // onOk={handleOk}
      onCancel={() => {
        onChange({
          changingPassword: false,
        });
      }}
      footer={null}
      width={500}
    >
      <div className={styles.ActivateAccountContent}>
        <Space size={25} direction="vertical" style={{width: 320}}>
          <Space size={15} direction="vertical">
            <FTipText type="third" text={'验证方式'}/>
            {
              walletPage.changingPasswordMobile && (<Space size={2}>
                <Radio
                  checked={walletPage.changingPasswordType === 'mobile'}
                  onChange={(e) => {
                    onChange({
                      changingPasswordType: 'mobile',
                    });
                  }}
                />
                <FContentText
                  text={walletPage.changingPasswordMobile}
                  type="normal"
                />
              </Space>)
            }

            {
              walletPage.changingPasswordEmail && (<Space size={2}>
                <Radio
                  checked={walletPage.changingPasswordType === 'email'}
                  onChange={(e) => {
                    onChange({
                      changingPasswordType: 'email',
                    });
                  }}
                />
                <FContentText
                  text={walletPage.changingPasswordEmail}
                  type="normal"
                />
              </Space>)
            }

          </Space>

          <div>
            <FTipText type="third" text={'验证码'}/>
            <div style={{height: 5}}/>
            <Space size={10}>
              <FInput
                className={styles.verificationCodeInput}
                wrapClassName={styles.verificationCodeInput}
                size="middle"
              />
              <FRectBtn
                style={{width: 110}}
                type="primary"
              >获取验证码</FRectBtn>
            </Space>
          </div>

          <div>
            <FTipText type="third" text={'原支付密码'}/>
            <div style={{height: 5}}/>
            <FInput
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size="middle"
              value={walletPage.changingPasswordPasswordOld}
              errorText={walletPage.changingPasswordPasswordOldError}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  changingPasswordPasswordOld: value,
                  changingPasswordPasswordOldError: PAY_PASSWORD.test(value) ? '' : '必须为6为数字',
                });
              }}
            />
          </div>

          <div>
            <FTipText type="third" text={'支付密码'}/>
            <div style={{height: 5}}/>
            <FInput
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size="middle"
              value={walletPage.changingPasswordPasswordOne}
              errorText={walletPage.changingPasswordPasswordOneError}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  changingPasswordPasswordOne: value,
                  changingPasswordPasswordOneError: PAY_PASSWORD.test(value) ? '' : '必须为6为数字',
                  changingPasswordPasswordTwoError: (walletPage.changingPasswordPasswordTwo && value !== walletPage.changingPasswordPasswordTwo) ? '两次密码必须一致' : '',
                });
              }}
            />
          </div>

          <div>
            <FTipText type="third" text={'验证支付密码'}/>
            <div style={{height: 5}}/>
            <FInput
              className={styles.blockInput}
              wrapClassName={styles.blockInput}
              size="middle"
              value={walletPage.changingPasswordPasswordTwo}
              errorText={walletPage.changingPasswordPasswordTwoError}
              onChange={(e) => {
                const value = e.target.value;
                onChange({
                  changingPasswordPasswordTwo: value,
                  changingPasswordPasswordTwoError: value === walletPage.changingPasswordPasswordOne ? '' : '两次密码必须一致',
                });
              }}
            />
          </div>
        </Space>
        <div style={{height: 40}}/>
        <FRectBtn
          type="primary"
          disabled={!walletPage.changingPasswordPasswordOne
          || !walletPage.changingPasswordPasswordTwo
          || !!walletPage.changingPasswordPasswordOneError
          || !!walletPage.changingPasswordPasswordTwoError
          || !!walletPage.changingPasswordPasswordOldError
          }
          onClick={() => {
            dispatch<ChangePasswordAction>({
              type: 'walletPage/changePassword',
            });
          }}
        >激活feth账户</FRectBtn>
      </div>

    </Modal>
  </div>);
}

export default connect(({walletPage, user}: ConnectState) => ({
  walletPage,
  user,
}))(Wallet);

export function successMessage() {
  message.success({
    content: (<div className={styles.success}>
      <FCheck style={{fontSize: 76}}/>
      <div style={{height: 20}}/>
      <FTitleText type="popup" text={'支付密码修改成功!'}/>
    </div>),
    // className: 'custom-class',
    style: {
      marginTop: '20vh',
    },
    icon: <div/>,
    duration: 1,
  })
}
