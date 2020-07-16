import * as React from 'react';
import styles from './index.less';
import FResourceCover from '@/components/FResourceCover';
import {FContentText} from '@/components/FText';
import {Space} from 'antd';
import {FTextButton} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceSilderModelState} from '@/models/connect';
import {withRouter, router} from 'umi';

interface SilderProps {
  dispatch: Dispatch;
  silder: ResourceSilderModelState;
  match: {
    params: { [key: string]: string };
    path: string;
  };
}

function Sider({silder: {info}, match}: SilderProps) {
  // console.log(match, 'props');
  return (<div className={styles.Sider}>
    <FResourceCover
      src={info.cover}
      status={info.status}
    />
    <div style={{height: 15}}/>
    <FContentText text={info.name}/>
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
          <a className={''}>版本列表</a>
          <FTextButton onClick={() => router.push(`/resource/${match.params.id}/version/creator`)}><i className="freelog fl-icon-add"/></FTextButton>
        </div>

        <Space size={16} direction="vertical" className={styles.versions + ' ' + styles.Space}>
          {
            match.path === '/resource/:id/version/creator' && (
              <div className={styles.radio + ' ' + styles.smallVersion}>
                <a className={styles.activatedRadio}>正在创建版本</a>
              </div>)
          }

          {
            info.versions.map((i) => (<div key={i} className={styles.radio + ' ' + styles.smallVersion}>
              <a
                onClick={() => router.push(`/resource/${match.params.id}/version/${i}`)}
                className={(match.path === '/resource/:id/version/:version' && match.params.version === i) ? styles.activatedRadio : ''}
              >{i}</a>
            </div>))
          }
        </Space>
      </Space>
    </div>
  </div>)
}

export default withRouter(connect(({resourceSilder}: ConnectState) => ({
  silder: resourceSilder,
}))(Sider))
