import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FNormalButton, FCircleButton, FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import {CopyOutlined, LoadingOutlined, ExclamationCircleFilled} from '@ant-design/icons';

// import FSelectObjectModal from '@/pages/resource/components/FSelectObjectModal';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/pages/resource/components/FCustomProperties';
import FDepPanel from '@/pages/resource/components/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceVersionCreatorPageModelState} from "@/models/connect";
import {
  OnChangeDescriptionAction,
  OnChangeResourceObjectAction,
  OnChangeVersionAction
} from "@/models/resourceVersionCreatorPage";

interface VersionCreatorProps {
  dispatch: Dispatch;
  version: ResourceVersionCreatorPageModelState,
}


function VersionCreator({dispatch, version}: VersionCreatorProps) {

  return (<FInfoLayout>
    <FContentLayout header={<Header/>}>
      <FEditorCard dot={true} title={'版本号'}>
        <FInput
          value={version.version}
          onChange={(e) => dispatch<OnChangeVersionAction>({
            type: 'resourceVersionCreatorPage/onChangeVersion',
            payload: e.target.value,
          })}
          className={styles.versionInput}
        />
      </FEditorCard>
      <FEditorCard dot={true} title={'对象'}>
        <FSelectObject
          resourceObject={version.resourceObject}
          onChange={(value) => dispatch<OnChangeResourceObjectAction>({
            type: 'resourceVersionCreatorPage/onChangeResourceObject',
            payload: value,
          })}
        />
      </FEditorCard>

      <FEditorCard dot={false} title={'依赖'}>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton theme="weaken"/>
            <FContentText text={'添加'}/>
          </Space>
          <Space size={10}>
            <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
            <FContentText text={'从上一版本导入'}/>
          </Space>
        </Space>

        <div className={styles.depUpthrow}>
          <FTitleText text={'基础上抛'} type="form"/>
          <ExclamationCircleFilled style={{color: '#C7C7C7', marginLeft: 5}}/>
          <div className={styles.depUpthrowLabel}>
            <label>ww-zh/PB-markdown</label>
            <label>ww-zh/PB-markdown</label>
            <label>ww-zh/PB-markdown</label>
          </div>
        </div>

        <>
          <div style={{height: 20}}/>
          {/* TODO: */}
          {/*<FDepPanel />*/}
        </>
      </FEditorCard>
      <FEditorCard dot={false} title={'自定义属性'}>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton theme="weaken"/>
            <FContentText text={'添加'}/>
          </Space>
          <Space size={10}>
            <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
            <FContentText text={'从上一版本导入'}/>
          </Space>
        </Space>
        <div style={{height: 35}}/>
        <FCustomProperties stubborn={false}/>
      </FEditorCard>
      <FEditorCard dot={false} title={'版本描述'}>
        <FBraftEditor
          onChange={(value) => dispatch<OnChangeDescriptionAction>({
            type: 'resourceVersionCreatorPage/onChangeDescription',
            payload: value,
          })}
        />
      </FEditorCard>

      {/*<FSelectObjectModal/>*/}
    </FContentLayout>
  </FInfoLayout>);
}

function Header() {
  return (<div className={styles.Header}>
    <FTitleText text={'创建版本'} type={'h2'}/>

    <Space size={30}>
      <FTextButton>暂存草稿</FTextButton>
      <FNormalButton style={{width: 108}}>创建</FNormalButton>
    </Space>
  </div>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  version: resourceVersionCreatorPage,
}))(VersionCreator);
