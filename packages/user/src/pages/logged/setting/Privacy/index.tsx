import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { FContentText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import { Space } from 'antd';
import { FTextBtn } from '@/components/FButton';
import { connect } from 'dva';
import { ConnectState, SettingPageModelState } from '@/models/connect';

interface PrivacyProps {
  settingPage: SettingPageModelState;
}

function Privacy({ settingPage }: PrivacyProps) {
  return (<>
    <FFormLayout>
      <FFormLayout.FBlock
        title={'节点用户数据'}
      >
        <Space size={10} direction='vertical' className={styles.info}>
          <div className={styles.row}>
            <div className={styles.left}>
              <FContentText text={'已存储的节点数据文件'} type='normal' />
            </div>
            <div className={styles.right}>
              <FContentText text={settingPage.nodeDataSize} type='highlight' />
              <div style={{ width: 30 }} />
              <FTextBtn type='danger'>清理节点数据</FTextBtn>
            </div>
          </div>
        </Space>
      </FFormLayout.FBlock>
    </FFormLayout>
  </>);
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Privacy);
