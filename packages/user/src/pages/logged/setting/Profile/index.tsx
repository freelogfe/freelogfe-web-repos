import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { connect } from 'dva';
import { ConnectState, UserModelState } from '@/models/connect';
import { FContentText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import { Cascader, DatePicker } from 'antd';
import { FRectBtn } from '@/components/FButton';

interface ProfileProps {
  user: UserModelState;
}

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];


function Profile({ user }: ProfileProps) {
  return (<>
    <div className={styles.avatar}>
      <div>
        <img
          src={user.userInfo?.headImage || ''}
          alt={'头像'} />
      </div>
    </div>
    <div style={{ height: 30 }} />
    <FFormLayout>
      <FFormLayout.FBlock
        title={'基本信息'}
      >
        <Space size={10} direction='vertical' className={styles.info}>
          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'性别'} type='normal' />
            </div>
            <div className={styles.right}>
              <FRadio>男</FRadio>
              <div style={{ width: 20 }} />
              <FRadio>女</FRadio>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'个人简介'} type='normal' />
            </div>
            <div className={styles.right}>
              <FInput
                className={styles.blockInput}
                wrapClassName={styles.blockInput}
                placeholder={'一句话介绍自己'}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'出生年月'} type='normal' />
            </div>
            <div className={styles.right}>
              <DatePicker
                style={{ width: 220, height: 38 }}
                placeholder={'出生年月日'}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'居住地'} type='normal' />
            </div>
            <div className={styles.right}>
              <Cascader
                className={styles.Cascader}
                options={options}
                // onChange={onChange}
                placeholder='常驻城市'
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'职业'} type='normal' />
            </div>
            <div className={styles.right}>
              <FInput
                placeholder='职位名称'
                className={styles.widthInput}
                wrapClassName={styles.widthInput}
              />
            </div>
          </div>
        </Space>
        <div style={{ height: 40 }} />
        <div className={styles.submit}>
          <FRectBtn type='primary'>提交修改</FRectBtn>
        </div>

      </FFormLayout.FBlock>
    </FFormLayout>
  </>);
}

export default connect(({ user }: ConnectState) => ({
  user,
}))(Profile);
