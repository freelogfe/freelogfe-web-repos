import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import FInput from '@/components/FInput';
import { Cascader, DatePicker, Space } from 'antd';
import { FTextBtn } from '@/components/FButton';

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
  </>);
}

export default Security;
