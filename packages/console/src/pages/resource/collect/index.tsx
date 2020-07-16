import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceCollectPageModelState} from '@/models/connect';
import {router} from 'umi';
import {
  OnChangeInputTextAction,
  OnChangePageCurrentAction, OnChangePageSizeAction,
  OnChangeResourceStatusAction,
  OnChangeResourceTypeAction
} from "@/models/resourceCollectPage";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";

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

interface ResourceCollectProps {
  dispatch: Dispatch;
  resource: ResourceCollectPageModelState;
}

function ResourceCollect({dispatch, resource}: ResourceCollectProps) {

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push('/resource/list');
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        value={'2'}
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
          type: 'resourceCollectPage/onChangeResourceType',
          payload: value
        })}
        onChangeResourceStatus={(value) => dispatch<OnChangeResourceStatusAction>({
          type: 'resourceCollectPage/onChangeResourceStatus',
          payload: value
        })}
        onChangeInputText={(value) => dispatch<OnChangeInputTextAction>({
          type: 'resourceCollectPage/onChangeInputText',
          payload: value
        })}
        onChangePageCurrent={(value) => dispatch<OnChangePageCurrentAction>({
          type: 'resourceCollectPage/onChangePageCurrent',
          payload: value
        })}
        onChangePageSize={(value) => dispatch<OnChangePageSizeAction>({
          type: 'resourceCollectPage/onChangePageSize',
          payload: value
        })}
        isCollect={true}
        onBoomJuice={() => null}
        onClickMore={() => null}
      />

    </FCenterLayout>
  );
}

export default connect(({resourceCollectPage}: ConnectState) => ({
  resource: resourceCollectPage,
}))(ResourceCollect);
