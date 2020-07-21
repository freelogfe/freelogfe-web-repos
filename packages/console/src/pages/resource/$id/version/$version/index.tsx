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

// 富文本内容预览
/**
 <!Doctype html>
 <html>
 <head>
 <title>Preview Content</title>
 <style>
 html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
 .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
 .container img,
 .container audio,
 .container video{
              max-width: 100%;
              height: auto;
            }
 .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
 .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
 .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
 </style>
 </head>
 <body>
 <div class="container">${this.state.editorState.toHTML()}</div>
 </body>
 </html>
 **/
