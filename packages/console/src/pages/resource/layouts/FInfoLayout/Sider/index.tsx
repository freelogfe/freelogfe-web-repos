import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {FContentText} from '@/components/FText';
import {Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {ChangeAction, FetchDataSourceAction} from "@/models/resourceInfo";
import {FetchDraftDataAction} from "@/models/resourceInfo";
import {i18nMessage} from "@/utils/i18n";

interface SilderProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
  // resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  match: {
    params: {
      id: string;
      version: string;
    };
  };
}

function Sider({resourceInfo, match, dispatch, route}: RouterTypes & SilderProps) {

  // React.useEffect(() => {
  //   if (match.params.id === resourceInfo.info?.resourceId) {
  //     return;
  //   }
  //   dispatch<FetchDataSourceAction>({
  //     type: 'resourceInfo/fetchDataSource',
  //     payload: match.params.id,
  //   });
  //   // dispatch<FetchDraftAction>({
  //   //   type: 'resourceVersionCreatorPage/fetchDraft',
  //   //   payload: match.params.id,
  //   // });
  // }, [resourceInfo.info, match.params.id]);

  React.useEffect(() => {
    onChangeMatchParamsId();
  }, [match.params.id]);

  async function onChangeMatchParamsId() {
    await dispatch<ChangeAction>({
      type: 'resourceInfo/change',
      payload: {
        resourceID: match.params.id,
      }
    });
    dispatch<FetchDraftDataAction>({
      type: 'resourceInfo/fetchDraftData',
    });
    dispatch<FetchDataSourceAction>({
      type: 'resourceInfo/fetchDataSource',
      payload: match.params.id,
    });
  }

  function gotoCreator() {
    router.push(`/resource/${match.params.id}/version/creator`);
  }

  if (!resourceInfo.info) {
    return null;
  }

  return (<div className={styles.Sider}>
    <div style={{height: 40}}/>
    <FResourceCover
      src={resourceInfo.info?.coverImages.length > 0 ? resourceInfo.info?.coverImages[0] : ''}
      status={resourceInfo.info?.status === 1 ? 'online' : 'stopped'}
    />
    <div style={{height: 15}}/>
    <FContentText className={styles.breakWord} text={resourceInfo.info?.resourceName}/>
    <div style={{height: 10}}/>
    <label className={styles.label}>{resourceInfo.info.resourceType}</label>
    <div style={{height: 15}}/>
    <div className={styles.radios}>
      <div style={{height: 20}}/>
      <Space className={styles.Space} size={16} direction="vertical">
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/info' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/info`)}
          >{i18nMessage('resource_information')}</a>
        </div>
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/auth' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/auth`)}
          >{i18nMessage('authorization_infomation')}</a>
          {resourceInfo.info?.policies.length === 0 && (
            <div style={{backgroundColor: 'red', borderRadius: '50%', width: 4, height: 4}}/>)}
          <div style={{width: 75}}/>
        </div>

        <div className={styles.radio}>
          <a style={{cursor: 'default'}}>{i18nMessage('verions')}</a>
          <FTextButton onClick={gotoCreator}><i
            className="freelog fl-icon-add"/></FTextButton>
        </div>

        <Space size={16} direction="vertical" className={styles.versions + ' ' + styles.Space}>
          {
            match.path === '/resource/:id/version/creator'
              ? (
                <div className={styles.radio + ' ' + styles.smallVersion}>
                  {/*<a className={styles.activatedRadio}>{i18nMessage('unamed_version')}</a>*/}
                  <a className={styles.activatedRadio}>正在创建版本</a>
                </div>)
              : (resourceInfo.draftData && (<div className={styles.radio + ' ' + styles.smallVersion}>
                <a onClick={gotoCreator}>{resourceInfo.draftData?.version || '未输入版本号'}（草稿）</a>
              </div>))
          }

          {
            [...resourceInfo.info?.resourceVersions].reverse().map((i) => (
              <div key={i.versionId} className={styles.radio + ' ' + styles.smallVersion}>
                <a
                  onClick={() => {
                    if (match.params.version === i.version) {
                      return;
                    }
                    router.push(`/resource/${match.params.id}/version/${i.version}`);
                  }}
                  className={(match.path === '/resource/:id/version/:version' && match.params.version === i.version) ? styles.activatedRadio : ''}
                >{i.version}</a>
              </div>))
          }
        </Space>
      </Space>
    </div>
    <div style={{height: 40}}/>
  </div>)
}

export default withRouter(connect(({resourceInfo, resourceVersionCreatorPage}: ConnectState) => ({
  resourceInfo: resourceInfo,
  resourceVersionCreatorPage: resourceVersionCreatorPage,
}))(Sider))

