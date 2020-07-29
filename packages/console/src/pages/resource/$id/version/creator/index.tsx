import * as React from 'react';

import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FNormalButton, FTextButton} from '@/components/FButton';
import {Space} from 'antd';

import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/pages/resource/components/FCustomProperties';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from "@/models/connect";
import {
  CreateVersionAction,
  OnChangeDescriptionAction, OnChangePropertiesAction,
  OnChangeResourceObjectAction,
  OnChangeVersionAction
} from '@/models/resourceVersionCreatorPage';
import {withRouter} from "umi";

interface VersionCreatorProps {
  dispatch: Dispatch;
  version: ResourceVersionCreatorPageModelState,
  resource: ResourceInfoModelState,
  match: {
    params: {
      id: string;
    };
  };
}

function VersionCreator({dispatch, version, match, resource}: VersionCreatorProps) {

  function onClickCache() {

  }

  function onClickCreate() {
    dispatch<CreateVersionAction>({
      type: 'resourceVersionCreatorPage/createVersion',
      payload: match.params.id,
    });
  }

  return (<FInfoLayout>
    <FContentLayout header={<Header onClickCreate={onClickCreate} onClickCache={onClickCache}/>}>
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
          resourceType={resource.info?.resourceType || ''}
          resourceObject={version.resourceObject}
          onChange={(value) => dispatch<OnChangeResourceObjectAction>({
            type: 'resourceVersionCreatorPage/onChangeResourceObject',
            payload: value,
          })}
        />
      </FEditorCard>

      <FEditorCard dot={false} title={'依赖'}>
        <FDepPanel/>
      </FEditorCard>

      <FEditorCard dot={false} title={'自定义属性'}>
        <FCustomProperties
          stubborn={false}
          dataSource={version.properties}
          onChange={(value) => dispatch<OnChangePropertiesAction>({
            type: 'resourceVersionCreatorPage/onChangeProperties',
            payload: value,
          })}
        />
      </FEditorCard>

      <FEditorCard dot={false} title={'版本描述'}>
        <FBraftEditor
          onChange={(value) => dispatch<OnChangeDescriptionAction>({
            type: 'resourceVersionCreatorPage/onChangeDescription',
            payload: value,
          })}
        />
      </FEditorCard>

    </FContentLayout>
  </FInfoLayout>);
}


//CreateVersionAction

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
}

function Header({onClickCache, onClickCreate}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={'创建版本'} type={'h2'}/>

    <Space size={30}>
      <FTextButton onClick={onClickCache}>暂存草稿</FTextButton>
      <FNormalButton
        style={{width: 108}}
        onClick={onClickCreate}
      >创建</FNormalButton>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
  version: resourceVersionCreatorPage,
  resource: resourceInfo,
}))(VersionCreator));
