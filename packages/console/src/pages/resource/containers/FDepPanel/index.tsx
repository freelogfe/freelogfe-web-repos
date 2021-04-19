import * as React from 'react';
import styles from './index.less';
import {FTipText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import {Space} from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {CloseCircleFilled} from '@ant-design/icons';
import {ChangeAction, DepResources, ImportLastVersionDataAction} from '@/models/resourceVersionCreatorPage';
import FDrawer from "@/components/FDrawer";
import FUtil from "@/utils";

export interface FDepPanelProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function FDepPanel({dispatch, resourceVersionCreatorPage}: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const resource = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as DepResources[number];
  // console.log(resource, 'resource23qeasdj98io');
  return (<>
    <Space size={15}>
      {/*<FNormalButton*/}
      {/*  onClick={() => setModalVisible(true)}*/}
      {/*  theme="grey"*/}
      {/*>{FUtil.I18n.message('add_rely_resource')}</FNormalButton>*/}
      <FRectBtn
        onClick={() => setModalVisible(true)}
        type="default"
      >添加依赖</FRectBtn>
      {
        resourceVersionCreatorPage.preVersionDeps.relationships.length > 0 &&
        <FRectBtn
          type="default"
          onClick={() => {
            dispatch<ImportLastVersionDataAction>({
              type: 'resourceVersionCreatorPage/importLastVersionData',
              payload: 'deps',
            });
            dispatch<ChangeAction>({
              type: 'resourceVersionCreatorPage/change',
              payload: {
                dataIsDirty: true,
              },
            });
          }}
        >{FUtil.I18n.message('import_from_previous_version')}</FRectBtn>
      }

    </Space>

    {
      resourceVersionCreatorPage.depRelationship.length > 0 && (<>
        <UpthrowList/>

        <div style={{height: 20}}/>
        <div className={styles.DepPanel}>

          <div className={styles.DepPanelNavs}>
            <div>
              <Resources/>
            </div>
          </div>

          <div className={styles.DepPanelContent}>
            <div>
              {
                resource.status === 0 && resource.enableReuseContracts.length === 0 && (
                  <div className={styles.errorBox}>
                    <CloseCircleFilled className={styles.errorIcon}/>
                    <FTipText text={FUtil.I18n.message('authorization_issue_offline_resource')} type="secondary"/>
                  </div>)
              }
              {/*{resource.status === 2 && <FTipText text={FUtil.I18n.message('authorization_issue_circular_reply')} type="secondary"/>}*/}
              {
                resource.status === 2 && (<div className={styles.errorBox}>
                  <CloseCircleFilled className={styles.errorIcon}/>
                  <FTipText
                    text={FUtil.I18n.message('authorization_issue_circular_reply')}
                    type="secondary"
                  />
                </div>)
              }
              {
                resource.status === 3 && (<div className={styles.errorBox}>
                  <CloseCircleFilled className={styles.errorIcon}/>
                  <FTipText text={'该依赖是存储空间对象，无法获取授权。'} type="secondary"/>
                </div>)
              }
              {
                resource.status === 4 && (<div className={styles.errorBox}>
                  <CloseCircleFilled className={styles.errorIcon}/>
                  <FTipText text={'该依赖是基础上抛资源，无法获取授权'} type="secondary"/>
                </div>)
              }

              {
                (resource.status === 1 || resource.enableReuseContracts.length !== 0 || resource.enabledPolicies.length !== 0)
                && (<Space style={{width: '100%'}} size={25} direction="vertical">

                  <IsUpthrow/>

                  <Contracts/>

                  <Policies/>

                </Space>)
              }

            </div>
          </div>
        </div>
      </>)
    }

    <FDrawer
      // title={FUtil.I18n.message('add_rely_resource')}
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
    >
      <Market/>
    </FDrawer>
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(FDepPanel);
