import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceCollectPageModelState} from '@/models/connect';
import {router} from 'umi';
import {} from "@/models/resourceCollectPage";
import FResourceCardsList from "@/pages/resource/components/FResourceCardsList";
import {ChangeStatesAction} from "@/models/resourceCollectPage";
import {BoomJuiceAction} from "@/models/resourceCollectPage";
import FNoDataTip from "@/components/FNoDataTip";

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
    pageCurrent={resource.pageCurrent}
    pageSize={resource.pageSize}
    totalNum={resource.totalNum}
    onChangeResourceType={(value) => changeStatus({resourceType: value})}
    onChangeResourceStatus={(value) => changeStatus({resourceStatus: value})}
    onChangeInputText={(value) => changeStatus({inputText: value})}
    onChangePageCurrent={(value) => changeStatus({pageCurrent: value})}
    onChangePageSize={(value) => changeStatus({pageSize: value})}
    isCollect={true}
    onBoomJuice={(id) => {
      // console.log(id, '3029jdaslkfasdf');
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
