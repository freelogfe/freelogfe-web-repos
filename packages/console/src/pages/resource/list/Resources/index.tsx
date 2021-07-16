import * as React from 'react';
import {
  ChangeStatesAction,
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

  // React.useEffect(() => {
  //   dispatch<FetchDataSourceAction>({
  //     type: 'resourceListPage/fetchDataSource',
  //   });
  //
  //   return () => {
  //     dispatch<ClearDataAction>({
  //       type: 'resourceListPage/clearData',
  //     });
  //   };
  // }, []);

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

  function changeStatus(payload: ChangeStatesAction['payload']) {
    dispatch<ChangeStatesAction>({
      type: 'resourceListPage/changeStates',
      payload,
    })
  }

  return (<FResourceCardsList
    resourceType={resource.resourceType}
    resourceStatus={resource.resourceStatus}
    inputText={resource.inputText}
    dataSource={resource.dataSource}
    totalNum={resource.totalNum}
    onChangeResourceType={(value) => {
      if (value === resource.resourceType) {
        return;
      }
      changeStatus({resourceType: value});
    }}
    onChangeResourceStatus={(value) => {
      if (value === resource.resourceStatus) {
        return;
      }
      changeStatus({resourceStatus: value});
    }}
    onChangeInputText={(value) => {
      if (value === resource.inputText) {
        return;
      }
      changeStatus({inputText: value});
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
