import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceListPageModelState} from '@/models/connect';
import {router} from 'umi';
import {
  FetchDataSourceAction,
  OnChangeInputTextAction,
  OnChangePageCurrentAction, OnChangePageSizeAction,
  OnChangeResourceStatusAction,
  OnChangeResourceTypeAction
} from '@/models/resourceListPage';
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
  resource: ResourceListPageModelState;
}

function Resource({dispatch, resource}: ResourceProps) {

  React.useEffect(() => {
    dispatch<FetchDataSourceAction>({
      type: 'resourceListPage/fetchDataSource',
    });
  }, [dispatch]);

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
          type: 'resourceListPage/onChangeResourceType',
          payload: value
        })}
        onChangeResourceStatus={(value) => dispatch<OnChangeResourceStatusAction>({
          type: 'resourceListPage/onChangeResourceStatus',
          payload: value
        })}
        onChangeInputText={(value) => dispatch<OnChangeInputTextAction>({
          type: 'resourceListPage/onChangeInputText',
          payload: value
        })}
        onChangePageCurrent={(value) => dispatch<OnChangePageCurrentAction>({
          type: 'resourceListPage/onChangePageCurrent',
          payload: value
        })}
        onChangePageSize={(value) => dispatch<OnChangePageSizeAction>({
          type: 'resourceListPage/onChangePageSize',
          payload: value
        })}
        showGotoCreateBtn={true}
        onClickDetails={() => null}
        onClickEditing={(id) => router.push(`/resource/${id}/info`)}
        onClickRevision={(id, record) => router.push(`/resource/${id}/version/creator`)}
      />

    </FCenterLayout>
  );
}

export default connect(({resourceListPage}: ConnectState) => ({
  resource: resourceListPage,
}))(Resource);
