import * as React from 'react';
import {
  OnChangeKeywordsAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnClickLoadingMordAction,
  OnMountAction,
  OnUnmountAction,
  ResourceListPageModelState,
} from "@/models/resourceListPage";
import {router} from "umi";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";
import {connect, Dispatch} from "dva";
import {ConnectState} from "@/models/connect";
import FNoDataTip from "@/components/FNoDataTip";
import FLoadingTip from "@/components/FLoadingTip";
import {FUtil} from '@freelog/tools-lib';
import * as AHooks from "ahooks";

interface ResourceProps {
  dispatch: Dispatch;
  resource: ResourceListPageModelState;
}

function Resources({dispatch, resource}: ResourceProps) {

  AHooks.useMount(() => {
    dispatch<OnMountAction>({
      type: 'resourceListPage/onMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountAction>({
      type: 'resourceListPage/onUnmount',
    });
  });

  if (resource.totalNum === -1) {
    return (<FLoadingTip height={'calc(100vh - 140px)'}/>);
  }

  if (resource.dataSource.length === 0 && resource.inputText === '' && resource.resourceType === '-1' && resource.resourceStatus === '2') {
    return (<FNoDataTip
      height={'calc(100vh - 140px)'}
      tipText={'未创建任何资源'}
      btnText={'创建资源'}
      onClick={() => router.push(FUtil.LinkTo.resourceCreator())}
    />);
  }

  return (<FResourceCardsList
    resourceType={resource.resourceType}
    resourceStatus={resource.resourceStatus}
    inputText={resource.inputText}
    dataSource={resource.dataSource}
    totalNum={resource.totalNum}
    onChangeResourceType={(value) => {
      dispatch<OnChangeResourceTypeAction>({
        type: 'resourceListPage/onChangeResourceType',
        payload: {
          value: value,
        },
      });
    }}
    onChangeResourceStatus={(value) => {
      dispatch<OnChangeStatusAction>({
        type: 'resourceListPage/onChangeStatus',
        payload: {
          value: value,
        },
      });
    }}
    onChangeInputText={(value) => {
      dispatch<OnChangeKeywordsAction>({
        type: 'resourceListPage/onChangeKeywords',
        payload: {
          value: value,
        },
      });
    }}
    showGotoCreateBtn={true}
    onClickDetails={(id) => router.push(FUtil.LinkTo.resourceDetails({
      resourceID: String(id),
    }))}
    onClickEditing={(id) => router.push(FUtil.LinkTo.resourceInfo({
      resourceID: String(id),
    }))}
    onClickRevision={(id, record) => router.push(FUtil.LinkTo.resourceCreateVersion({
      resourceID: String(id),
    }))}
    // onClickMore={(id) => router.push(`/resource/${id}`)}
    onloadMore={() => {
      dispatch<OnClickLoadingMordAction>({
        type: 'resourceListPage/onClickLoadingMord',
      });
    }}
  />)
}

export default connect(({resourceListPage}: ConnectState) => ({
  resource: resourceListPage,
}))(Resources);
