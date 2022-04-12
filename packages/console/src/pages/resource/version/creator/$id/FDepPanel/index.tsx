import * as React from 'react';
import styles from './index.less';
import { FTipText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import { Space } from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
// import { CloseCircleFilled } from '@ant-design/icons';
import { ChangeAction, DepResources, ImportLastVersionDataAction } from '@/models/resourceVersionCreatorPage';
import FDrawer from '@/components/FDrawer';
import FUtil1 from '@/utils';
// import { FUtil } from '@freelog/tools-lib';
import FForbid from '@/components/FIcons/FForbid';
import FUpcast from '@/components/FIcons/FUpcast';
import { FWarning } from '@/components/FIcons';

export interface FDepPanelProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function FDepPanel({ dispatch, resourceVersionCreatorPage }: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const resource = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as DepResources[number];
  // console.log(resource, 'resource23qeasdj98io');

  return (<>
    <Space size={15}>
      <FRectBtn
        onClick={() => setModalVisible(true)}
        type='default'
      >添加依赖</FRectBtn>
      {
        resourceVersionCreatorPage.preVersionDeps.relationships.length > 0 &&
        <FRectBtn
          type='default'
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
              caller: '23453243434(((()00005234324534%#$%#$%#$%#$#$',
            });
          }}
        >{FUtil1.I18n.message('import_from_previous_version')}</FRectBtn>
      }

    </Space>

    {
      resourceVersionCreatorPage.depRelationship.length > 0 && (<>
        <UpthrowList />

        <div style={{ height: 20 }} />
        <div className={styles.DepPanel}>

          <div className={styles.DepPanelNavs}>
            <div>
              <Resources />
            </div>
          </div>

          <div className={styles.DepPanelContent}>

            {
              resource?.status === 0 && resource.enableReuseContracts.length === 0 && resource.enabledPolicies.length === 0 && (
                <div className={styles.errorBox}>
                  <FForbid className={styles.errorIcon} />
                  <FTipText
                    text={FUtil1.I18n.message('authorization_issue_offline_resource')}
                    type='second'
                  />
                </div>)
            }
            {
              resource?.status === 2 && (<div className={styles.errorBox}>
                <FForbid className={styles.errorIcon} />
                <FTipText
                  text={FUtil1.I18n.message('authorization_issue_circular_reply')}
                  type='second'
                />
              </div>)
            }
            {
              resource?.status === 3 && (<div className={styles.errorBox}>
                <FForbid className={styles.errorIcon} />
                <FTipText text={'该依赖是存储空间对象，无法获取授权。'} type='second' />
              </div>)
            }
            {
              resource?.status === 4 && (<div className={styles.errorBox}>
                <FUpcast className={styles.errorIcon} />
                <FTipText text={'此依赖为当前资源的基础上抛'} type='second' />
              </div>)
            }
            {
              (resource?.status === 1 || (resource?.status === 0 && (resource?.enableReuseContracts.length !== 0 || resource.enabledPolicies.length !== 0)))
              && (<Space
                style={{ width: '100%' }}
                size={25}
                direction='vertical'
              >

                {
                  resource.authProblem && (<Space size={10}>
                    <FWarning style={{ fontSize: 20 }} />
                    <span style={{ fontSize: 14, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
                  </Space>)
                }

                <IsUpthrow />

                <Contracts />

                <Policies />

              </Space>)
            }

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
      <Market />
    </FDrawer>
  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(FDepPanel);
