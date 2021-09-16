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
  OnCancel_BindEmail_Modal_Action,
  OnCancel_BindPhone_Modal_Action,
  OnCancel_ChangeEmail_New_Modal_Action,
  OnCancel_ChangeEmail_Old_Modal_Action, OnCancel_ChangePhone_New_Modal_Action, OnCancel_ChangePhone_Old_Modal_Action,
  OnClick_BindEmailBtn_Action,
  OnClick_ChangePhone_Old_NextBtn_Action,
  OnClick_ReplacePhoneBtn_Action,
} from '@/models/settingPage';

interface SecurityProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Security({ dispatch, settingPage }: SecurityProps) {
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
              <FContentText text={'YANGHONGTIAN'} type='highlight' />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'邮箱'} type='normal' />
            </div>
            <div className={styles.right}>
              <FTipText text={'未绑定'} type='third' />
              <div style={{ width: 30 }} />
              <FTextBtn onClick={() => {
                // onClick_BindEmailBtn_Action
                dispatch<OnClick_BindEmailBtn_Action>({
                  type: 'settingPage/onClick_BindEmailBtn',
                });
              }} type='primary'>立即绑定</FTextBtn>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'手机号'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={'13344556677'} type='highlight' />
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
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'登陆密码'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={'密码必须包含数字和字母，长度必须为6-24个字'} type='highlight' />
              <div style={{ width: 30 }} />
              <FTextBtn type='primary'>修改密码</FTextBtn>
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
          placeholder='请输入邮箱'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn type='primary'>立即绑定</FRectBtn>
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
          123***@freelog.com
        </div>
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn type='primary'>下一步</FRectBtn>
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
          placeholder='请输入邮箱'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn type='primary'>立即绑定</FRectBtn>
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
          placeholder='请输入手机号'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn type='primary'>立即绑定</FRectBtn>
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
          123***@freelog.com
        </div>
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn
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
          placeholder='请输入手机号'
          className={styles.modalBlockInput}
          wrapClassName={styles.modalBlockInput}
        />
        <div style={{ height: 25 }} />
        <FTipText text={'验证码'} type='third' />
        <div style={{ height: 5 }} />
        <div className={styles.modalCaptcha}>
          <FInput
            placeholder='请输入验证码'
            className={styles.modalCaptchaInput}
            wrapClassName={styles.modalCaptchaInput}
          />
          <FRectBtn style={{ width: 110 }} type='primary'>获取验证码</FRectBtn>
        </div>
        <div style={{ height: 80 }} />
        <div className={styles.modalFooter}>
          <FRectBtn type='primary'>立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>
  </>);
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Security);
