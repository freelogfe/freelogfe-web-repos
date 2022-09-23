import * as React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceCollectPageModelState } from '@/models/connect';
import { history } from 'umi';
import FResourceCardsList from '@/pages/resource/components/FResourceCardsList';
import {
  // ChangeStatesAction,
  OnMountAction,
  OnUnmountAction,
  OnChangeResourceTypeAction,
  OnChangeStatusAction,
  OnChangeKeywordsAction, OnBoomJuiceAction, OnClickLoadingMordAction,
} from '@/models/resourceCollectPage';
import FNoDataTip from '@/components/FNoDataTip';
import FLoadingTip from '@/components/FLoadingTip';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface ResourceCollectProps {
  dispatch: Dispatch;
  resource: ResourceCollectPageModelState;
}

function ResourceCollect({ dispatch, resource }: ResourceCollectProps) {

  AHooks.useMount(() => {
    dispatch<OnMountAction>({
      type: 'resourceCollectPage/onMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountAction>({
      type: 'resourceCollectPage/onUnmount',
    });
  });

  if (resource.totalNum === -1) {
    return (<FLoadingTip height={'calc(100vh - 140px)'} />);
  }

  // console.log(resource.inputText, resource.resourceType, resource.resourceStatus, '@#@#@##@#@#');
  if (resource.dataSource.length === 0 && !resource.inputText && resource.resourceType === '-1' && resource.resourceStatus === '2') {
    return (<FNoDataTip
      height={'calc(100vh - 140px)'}
      tipText={'未收藏任何资源'}
      btnText={'前往资源市场'}
      onClick={() => history.push(FUtil.LinkTo.market())}
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
        type: 'resourceCollectPage/onChangeResourceType',
        payload: {
          value: value,
        },
      });
    }}
    onChangeResourceStatus={(value: string) => {
      dispatch<OnChangeStatusAction>({
        type: 'resourceCollectPage/onChangeStatus',
        payload: {
          value: value,
        },
      });
    }}
    onChangeInputText={(value) => {
      dispatch<OnChangeKeywordsAction>({
        type: 'resourceCollectPage/onChangeKeywords',
        payload: {
          value: value,
        },
      });
    }}
    isCollect={true}
    onBoomJuice={(id) => {
      dispatch<OnBoomJuiceAction>({
        type: 'resourceCollectPage/onBoomJuice',
        payload: id.toString(),
      });
    }}
    onClickDetails={(id) => {
      window.open(FUtil.LinkTo.resourceDetails({
        resourceID: String(id),
      }));
    }}
    onClickMore={() => {
      dispatch<OnClickLoadingMordAction>({
        type: 'resourceCollectPage/onClickLoadingMord',
      });
    }}
  />);
}

export default connect(({ resourceCollectPage }: ConnectState) => ({
  resource: resourceCollectPage,
}))(ResourceCollect);
