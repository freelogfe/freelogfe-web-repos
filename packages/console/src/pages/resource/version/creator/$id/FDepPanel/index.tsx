import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceVersionCreatorPageModelState } from '@/models/connect';
import { ChangeAction, DepResources, ImportLastVersionDataAction } from '@/models/resourceVersionCreatorPage';
import FDrawer from '@/components/FDrawer';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

export interface FDepPanelProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function FDepPanel({ dispatch, resourceVersionCreatorPage }: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const resource = resourceVersionCreatorPage.dependencies.find((i) => i.id === resourceVersionCreatorPage.depActivatedID) as DepResources[number];

  return (<>
    <Space size={15}>
      <FComponentsLib.FRectBtn
        onClick={() => setModalVisible(true)}
        type='default'
      >添加依赖</FComponentsLib.FRectBtn>
      {
        resourceVersionCreatorPage.preVersionDeps.relationships.length > 0 &&
        <FComponentsLib.FRectBtn
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
        >{FI18n.i18nNext.t('import_from_previous_version')}</FComponentsLib.FRectBtn>
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
              // resource?.status === 0 && resource.enableReuseContracts.length === 0 && resource.enabledPolicies.length === 0 && (
              resource?.error === 'offline' && resource.enableReuseContracts.length === 0 && resource.enabledPolicies.length === 0 && (
                <div className={styles.errorBox}>
                  <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
                  <FComponentsLib.FTipText
                    text={FI18n.i18nNext.t('authorization_issue_offline_resource')}
                    type='second'
                  />
                </div>)
            }
            {
              // resource?.status === 2 && (<div className={styles.errorBox}>
              resource?.error === 'cyclicDependency' && (<div className={styles.errorBox}>
                <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
                <FComponentsLib.FTipText
                  text={FI18n.i18nNext.t('authorization_issue_circular_reply')}
                  type='second'
                />
              </div>)
            }
            {
              // resource?.status === 3 && (<div className={styles.errorBox}>
              resource?.error === 'storageObject' && (<div className={styles.errorBox}>
                <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
                <FComponentsLib.FTipText text={'该依赖是存储空间对象，无法获取授权。'} type='second' />
              </div>)
            }
            {
              // resource?.status === 4 && (<div className={styles.errorBox}>
              resource?.error === 'upThrow' && (<div className={styles.errorBox}>
                <FComponentsLib.FIcons.FUpcast className={styles.errorIcon} />
                <FComponentsLib.FTipText text={'此依赖为当前资源的基础上抛'} type='second' />
              </div>)
            }
            {
              resource?.error === 'freeze' && (<div className={styles.errorBox}>
                <FComponentsLib.FIcons.FForbid className={styles.errorIcon} />
                <FComponentsLib.FTipText text={'此资源因违规无法授权'} type='second' />
              </div>)
            }
            {
              // (resource?.status === 1
              (resource?.error === ''
                // || (resource?.status === 0
                || (resource?.error === 'offline'
                  && (resource?.enableReuseContracts.length !== 0 || resource.enabledPolicies.length !== 0)))
              && (<Space
                style={{ width: '100%' }}
                size={25}
                direction='vertical'
              >

                {
                  // resource.authProblem && (<Space size={10}>
                  resource.warning === 'authException' && (<Space size={10}>
                    <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
                    <span style={{ fontSize: 14, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
                  </Space>)
                }

                {
                  // resource.authProblem && (<Space size={10}>
                  resource.warning === 'ownerFreeze' && (<Space size={10}>
                    <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
                    <span style={{ fontSize: 14, color: '#C78D12' }}>该资源发行方账号因违规已被冻结，请谨慎处理授权。</span>
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
