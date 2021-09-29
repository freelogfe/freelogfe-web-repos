import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { FContentText, FTitleText } from '@/components/FText';
import FRadio from '@/components/FRadio';
import { Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import { connect, Dispatch } from 'dva';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import FDrawer from '@/components/FDrawer';
import FCheckbox from '@/components/FCheckbox';
import {
  OnCancel_NodeDate_Drawer_Action,
  OnClick_DataCleaningBtn_Action,
  OnClick_NodeDate_ConfirmBtn_Action,
} from '@/models/settingPage';

interface PrivacyProps {
  dispatch: Dispatch;
  settingPage: SettingPageModelState;
}

function Privacy({ dispatch, settingPage }: PrivacyProps) {
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
              <FTextBtn
                type='danger'
                onClick={() => {
                  // OnClick_DataCleaningBtn_Action
                  dispatch<OnClick_DataCleaningBtn_Action>({
                    type: 'settingPage/onClick_DataCleaningBtn',
                  });
                }}
              >清理节点数据</FTextBtn>
            </div>
          </div>
        </Space>
      </FFormLayout.FBlock>
    </FFormLayout>

    <FDrawer
      visible={settingPage.nodeDataDrawerVisible}
      title={'清理节点数据'}
      width={700}
      topRight={<Space size={30}>
        <FTextBtn
          type='default'
          onClick={() => {
            dispatch<OnCancel_NodeDate_Drawer_Action>({
              type: 'settingPage/onCancel_NodeDate_Drawer',
            });
          }}
        >取消</FTextBtn>
        <FRectBtn
          type='danger1'
          onClick={() => {
            dispatch<OnClick_NodeDate_ConfirmBtn_Action>({
              type: 'settingPage/onClick_NodeDate_ConfirmBtn',
            });
          }}
        >清理</FRectBtn>
      </Space>}
    >
      <div className={styles.nodesList}>
        <div className={styles.nodeItem} style={{ paddingTop: 0 }}>
          <div className={styles.nodeCheckBox}>
            <FCheckbox
              checked={settingPage.nodeDataList.every((nd) => {
                return nd.checked;
              })}
              indeterminate={!(settingPage.nodeDataList.every((nd) => {
                return nd.checked;
              }) || settingPage.nodeDataList.every((nd) => {
                return !nd.checked;
              }))}
            />
          </div>
          <div className={styles.nodeName}>
            <FTitleText text={'节点名称/地址'} type='table' />
          </div>
          <div className={styles.nodeSize}>
            <FTitleText text={'数据文件大小'} type='table' />
          </div>
          <div className={styles.nodeDateTime}>
            <FTitleText text={'最近访问时间'} type='table' />
          </div>
        </div>

        <div className={styles.nodeItem}>
          <div className={styles.nodeCheckBox}>
            <FCheckbox checked={true} />
          </div>
          <div className={styles.nodeName}>
            <FContentText text={'节点名称'} type='highlight' />
            <div style={{ height: 2 }} />
            <FContentText text={'www.jiedian.com'} type='additional2' />
          </div>
          <div className={styles.nodeSize}>
            <FContentText text={'235K'} type='highlight' />
          </div>
          <div className={styles.nodeDateTime}>
            <FContentText text={'2020/04/22  13:23'} type='highlight' />
          </div>
        </div>
      </div>


    </FDrawer>
  </>);
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Privacy);
