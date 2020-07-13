import * as React from 'react';

import styles from './index.less';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FEditorCard from '@/components/FEditorCard';
import {FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import FBraftEditor from '@/components/FBraftEditor';
import FCustomProperties from '@/pages/resource/components/FCustomProperties';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceVersionEditorPageModelState} from "@/models/connect";

interface VersionEditorProps {
  dispatch: Dispatch;
  version: ResourceVersionEditorPageModelState,
}

function VersionEditor({dispatch, version}: VersionEditorProps) {
  return (<FInfoLayout>
    <FContentLayout
      header={<Header
        version={version.version}
        signingDate={version.signingDate}
        resourceID={version.resourceID}
      />}>
      <FEditorCard title={'版本描述'}>
        {false && <FBraftEditor/>}
        {true && <div className={styles.description}></div>}
      </FEditorCard>
      <FEditorCard title={'相关视图'}>
        <div className={styles.diagram}/>
      </FEditorCard>
      <FEditorCard title={'自定义属性'}>
        <FCustomProperties stubborn={true}/>
      </FEditorCard>
    </FContentLayout>
  </FInfoLayout>);
}

interface HeaderProps {
  version: string;
  resourceID: string;
  signingDate: string;
}

function Header({version, resourceID, signingDate}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={version} type="h2"/>
    <div style={{height: 10}}/>
    <Space size={0}>
      <FContentText type="additional2" text={'签约时间：' + signingDate}/>
      <div style={{width: 40}}/>
      <FContentText type="additional2" text={'资源ID：' + resourceID}/>
      <div style={{width: 20}}/>
      <FTextButton
        theme="primary"
      >
        <DownloadOutlined style={{fontSize: 16, fontWeight: 600}}/>
      </FTextButton>
    </Space>
  </div>);
}

export default connect(({resourceVersionEditorPage}: ConnectState) => ({
  version: resourceVersionEditorPage,
}))(VersionEditor);
