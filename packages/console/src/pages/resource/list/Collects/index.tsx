import * as React from 'react';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceCollectPageModelState} from '@/models/connect';
import {router} from 'umi';
import FResourceCardsList from '@/pages/resource/components/FResourceCardsList';
import {ChangeStatesAction} from '@/models/resourceCollectPage';
import {BoomJuiceAction} from '@/models/resourceCollectPage';
import FNoDataTip from '@/components/FNoDataTip';

interface ResourceCollectProps {
  dispatch: Dispatch;
  resource: ResourceCollectPageModelState;
}

function ResourceCollect({dispatch, resource}: ResourceCollectProps) {

  const [contentMinHeight, setContentMinHeight] = React.useState<number>(window.innerHeight - 220);

  React.useEffect(() => {
    window.addEventListener('resize', setHeight);

    return () => {
      window.removeEventListener('resize', setHeight)
    }
  }, []);

  function setHeight() {
    setContentMinHeight(window.innerHeight - 140);
  }

  console.log(resource.inputText, resource.resourceType, resource.resourceStatus, '@#@#@##@#@#');
  if (resource.dataSource.length === 0 && !resource.inputText && resource.resourceType === '-1' && resource.resourceStatus === '2') {
    return (<FNoDataTip
      height={contentMinHeight}
      tipText={'未收藏任何资源'}
      btnText={'前往资源市场'}
      onClick={() => router.push('/market')}
    />);
  }

  function changeStatus(payload: ChangeStatesAction['payload']) {
    dispatch<ChangeStatesAction>({
      type: 'resourceCollectPage/changeStates',
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
    onChangeResourceStatus={(value: string) => {
      if (value === resource.resourceStatus) {
        return;
      }
      changeStatus({resourceStatus: value as '0' | '1' | '2'});
    }}
    onChangeInputText={(value) => {
      if (value === resource.inputText) {
        return;
      }
      changeStatus({inputText: value});
    }}
    isCollect={true}
    onBoomJuice={(id) => {
      dispatch<BoomJuiceAction>({
        type: 'resourceCollectPage/boomJuice',
        payload: id.toString(),
      })
    }}
    onClickMore={() => null}
  />);
}

export default connect(({resourceCollectPage}: ConnectState) => ({
  resource: resourceCollectPage,
}))(ResourceCollect);
