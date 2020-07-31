import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {FContentText} from '@/components/FText';
import {Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState} from '@/models/connect';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {FetchDataSourceAction} from "@/models/resourceInfo";

interface SilderProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState;
  match: {
    params: {
      id: string;
      version: string;
    };
  };
}

function Sider({resourceInfo: {info}, match, dispatch}: RouterTypes & SilderProps) {
  // console.log(match, 'props');

  React.useEffect(() => {
    // console.log('##@@#@##@#@#');
    dispatch<FetchDataSourceAction>({
      type: 'resourceInfo/fetchDataSource',
      payload: match.params.id,
    });
  }, [dispatch, match.params.id]);

  function gotoCreator() {
    router.push(`/resource/${match.params.id}/version/creator`);
  }

  if (!info) {
    return null;
  }

  return (<div className={styles.Sider}>
    <FResourceCover
      src={info?.coverImages.length > 0 ? info?.coverImages[0] : ''}
      status={info?.status === 1 ? 'online' : 'stopped'}
    />
    <div style={{height: 15}}/>
    <FContentText text={info?.resourceName}/>
    <div style={{height: 10}}/>
    <label className={styles.label}>{info.resourceType}</label>
    <div style={{height: 15}}/>
    <div className={styles.radios}>
      <div style={{height: 20}}/>
      <Space className={styles.Space} size={16} direction="vertical">
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/info' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/info`)}
          >资源信息</a>
        </div>
        <div className={styles.radio}>
          <a
            className={match.path === '/resource/:id/auth' ? styles.activatedRadio : ''}
            onClick={() => router.push(`/resource/${match.params.id}/auth`)}
          >授权信息</a>
        </div>

        <div className={styles.radio}>
          <a>版本列表</a>
          <FTextButton onClick={gotoCreator}><i
            className="freelog fl-icon-add"/></FTextButton>
        </div>

        <Space size={16} direction="vertical" className={styles.versions + ' ' + styles.Space}>
          {
            match.path === '/resource/:id/version/creator'
              ? (
                <div className={styles.radio + ' ' + styles.smallVersion}>
                  <a className={styles.activatedRadio}>正在创建版本</a>
                </div>)
              : (<div className={styles.radio + ' ' + styles.smallVersion}>
                <a onClick={gotoCreator}>{true ? '10.15.4' : '未输入版本号'}（草稿）</a>
              </div>)
          }

          {
            [...info?.resourceVersions].reverse().map((i) => (
              <div key={i.versionId} className={styles.radio + ' ' + styles.smallVersion}>
                <a
                  onClick={() => router.push(`/resource/${match.params.id}/version/${i.version}`)}
                  className={(match.path === '/resource/:id/version/:version' && match.params.version === i.version) ? styles.activatedRadio : ''}
                >{i.version}</a>
              </div>))
          }
        </Space>
      </Space>
    </div>
  </div>)
}

export default withRouter(connect(({resourceInfo}: ConnectState) => ({
  resourceInfo: resourceInfo,
}))(Sider))

