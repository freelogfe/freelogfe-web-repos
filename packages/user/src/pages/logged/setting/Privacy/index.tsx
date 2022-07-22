import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, SettingPageModelState } from '@/models/connect';
import FDrawer from '@/components/FDrawer';
import FCheckbox from '@/components/FCheckbox';
import {
  OnCancel_NodeDate_Drawer_Action,
  OnChange_NodeDate_CheckedAll_Action,
  OnChange_NodeDate_ItemChecked_Action,
  OnClick_DataCleaningBtn_Action,
  OnClick_NodeDate_ConfirmBtn_Action,
} from '@/models/settingPage';
import fConfirmModal from '@/components/fConfirmModal';
import FComponentsLib from '@freelog/components-lib';

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
              <FComponentsLib.FContentText text={'已存储的节点数据文件'} type='normal' />
            </div>
            <div className={styles.right}>
              <FComponentsLib.FContentText text={settingPage.nodeDataSize} type='highlight' />
              <div style={{ width: 30 }} />
              {
                settingPage.nodeDataSize !== '0 B' && (<FComponentsLib.FTextBtn
                  type='danger'
                  onClick={() => {
                    // OnClick_DataCleaningBtn_Action
                    dispatch<OnClick_DataCleaningBtn_Action>({
                      type: 'settingPage/onClick_DataCleaningBtn',
                    });
                  }}
                >清理节点数据</FComponentsLib.FTextBtn>)
              }

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
        <FComponentsLib.FTextBtn
          type='default'
          onClick={() => {
            dispatch<OnCancel_NodeDate_Drawer_Action>({
              type: 'settingPage/onCancel_NodeDate_Drawer',
            });
          }}
        >取消</FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          disabled={!settingPage.nodeDataList.some((nd) => {
            return nd.checked;
          })}
          type='danger1'
          onClick={() => {
            fConfirmModal({
              message: '一旦删除则无法恢复，确认删除吗？',
              onOk() {
                dispatch<OnClick_NodeDate_ConfirmBtn_Action>({
                  type: 'settingPage/onClick_NodeDate_ConfirmBtn',
                });
              },
            });

          }}
        >清理</FComponentsLib.FRectBtn>
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
              onChange={(e) => {
                dispatch<OnChange_NodeDate_CheckedAll_Action>({
                  type: 'settingPage/onChange_NodeDate_CheckedAll',
                  payload: {
                    value: e.target.checked,
                  },
                });
              }}
            />
          </div>
          <div className={styles.nodeName}>
            <FComponentsLib.FTitleText text={'节点名称/地址'} type='table' />
          </div>
          <div className={styles.nodeSize}>
            <FComponentsLib.FTitleText text={'数据文件大小'} type='table' />
          </div>
          <div className={styles.nodeDateTime}>
            <FComponentsLib.FTitleText text={'最近访问时间'} type='table' />
          </div>
        </div>

        {
          settingPage.nodeDataList.map((nd) => {
            return (<div key={nd.id} className={styles.nodeItem}>
              <div className={styles.nodeCheckBox}>
                <FCheckbox
                  checked={nd.checked}
                  onChange={(e) => {
                    dispatch<OnChange_NodeDate_ItemChecked_Action>({
                      type: 'settingPage/onChange_NodeDate_ItemChecked',
                      payload: {
                        nodeID: nd.id,
                        value: e.target.checked,
                      },
                    });
                  }}
                />
              </div>
              <div className={styles.nodeName}>
                <FComponentsLib.FContentText text={nd.name} type='highlight' />
                <div style={{ height: 2 }} />
                <FComponentsLib.FContentText text={nd.url} type='additional2' />
              </div>
              <div className={styles.nodeSize}>
                <FComponentsLib.FContentText text={nd.size} type='highlight' />
              </div>
              <div className={styles.nodeDateTime}>
                <FComponentsLib.FContentText text={nd.dateTime} type='highlight' />
              </div>
            </div>);
          })
        }
      </div>
    </FDrawer>
  </>);
}

export default connect(({ settingPage }: ConnectState) => ({
  settingPage,
}))(Privacy);
