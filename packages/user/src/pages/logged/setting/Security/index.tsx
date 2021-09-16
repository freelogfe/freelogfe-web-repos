import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import FInput from '@/components/FInput';
import { Cascader, DatePicker, Input, Modal, Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';

interface SecurityProps {

}

function Security({}: SecurityProps) {
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
              <FTextBtn type='primary'>立即绑定</FTextBtn>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'手机号'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={'13344556677'} type='highlight' />
              <div style={{ width: 30 }} />
              <FTextBtn type='primary'>更换号码</FTextBtn>
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
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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
          <FRectBtn type='primary'>立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='输入新邮箱地址'
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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
          <FRectBtn type='primary'>立即绑定</FRectBtn>
        </div>
        <div style={{ height: 5 }} />
      </div>
    </Modal>

    <Modal
      title='输入新邮箱地址'
      visible={false}
      // onOk={handleOk}
      // onCancel={handleCancel}
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

export default Security;
