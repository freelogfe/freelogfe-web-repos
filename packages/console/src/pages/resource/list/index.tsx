import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourcePageModelState} from '@/models/connect';
import {router} from 'umi';
import {
  OnChangeInputTextAction,
  OnChangePageCurrentAction, OnChangePageSizeAction,
  OnChangeResourceStatusAction,
  OnChangeResourceTypeAction
} from '@/models/resourcePage';
import FResourceCardsList from '@/pages/resource/components/FResourceCardsList';

const navs = [
  {
    value: '1',
    text: '我的资源',
  },
  {
    value: '2',
    text: '我的收藏',
  },
];

interface ResourceProps {
  dispatch: Dispatch;
  resource: ResourcePageModelState;
}

function Resource({dispatch, resource}: ResourceProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '2') {
      return router.push('/resource/collect');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        value={'1'}
        options={navs}
        onChange={onChangeTab}
      />

      <FResourceCardsList
        resourceType={resource.resourceType}
        resourceStatus={resource.resourceStatus}
        inputText={resource.inputText}
        dataSource={resource.dataSource}
        pageCurrent={resource.pageCurrent}
        pageSize={resource.pageSize}
        totalNum={resource.totalNum}
        onChangeResourceType={(value) => dispatch<OnChangeResourceTypeAction>({
          type: 'resourcePage/onChangeResourceType',
          payload: value
        })}
        onChangeResourceStatus={(value) => dispatch<OnChangeResourceStatusAction>({
          type: 'resourcePage/onChangeResourceStatus',
          payload: value
        })}
        onChangeInputText={(value) => dispatch<OnChangeInputTextAction>({
          type: 'resourcePage/onChangeInputText',
          payload: value
        })}
        onChangePageCurrent={(value) => dispatch<OnChangePageCurrentAction>({
          type: 'resourcePage/onChangePageCurrent',
          payload: value
        })}
        onChangePageSize={(value) => dispatch<OnChangePageSizeAction>({
          type: 'resourcePage/onChangePageSize',
          payload: value
        })}
        showGotoCreateBtn={true}
        onClickDetails={() => null}
        onClickEditing={(id) => router.push(`/resource/${id}/info`)}
        onClickRevision={(id,record) => router.push(`/resource/${id}/version/${record.version}`)}
      />

    </FCenterLayout>
  );
}

export default connect(({resourcePage}: ConnectState) => ({
  resource: resourcePage,
}))(Resource);
