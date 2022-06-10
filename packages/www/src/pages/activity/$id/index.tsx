import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';
import { connect, Dispatch } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import ResourceCompetition from '@/pages/activity/$id/ResourceCompetition';
import PlayNewer from './PlayNewer';
import * as AHooks from 'ahooks';
import {
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/activityDetailsPage';
import { IRouteComponentProps, withRouter } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import FResultTip from '@/components/FResultTip';
import { FUtil } from '@freelog/tools-lib';
import { Helmet } from 'react-helmet';

interface ActivityProps extends IRouteComponentProps {
  dispatch: Dispatch;
  activityDetailsPage: ActivityDetailsPageModelState;

  // match: {
  //   params: {
  //     id: string;
  //   }
  // };
}

const Activities: any = {
  'ResourceCompetition': (<ResourceCompetition />),
  'play-newer': (<PlayNewer />),
};

function Activity({
                    dispatch,
                    activityDetailsPage,
                    match,
                    history,
                  }: ActivityProps) {
  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'activityDetailsPage/onMountPage',
      payload: {
        activityID: (match.params as { id: string }).id || '',
      },
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'activityDetailsPage/onUnmountPage',
    });
  });
  // console.log(activityDetailsPage);
  if (activityDetailsPage.pageState === 'loading') {
    return <FLoadingTip height={window.innerHeight - 170} />;
  }

  if (activityDetailsPage.pageState === 'noDate') {
    return (
      <div
        style={{
          height: window.innerHeight - 170,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FResultTip
          h1={'活动不存在或者已暂停'}
          btnText={'返回首页'}
          onClickBtn={() => {
            history.push(FUtil.LinkTo.home());
          }}
        />
      </div>
    );
  }

  return (<>
    <Helmet>
      <title>{`${activityDetailsPage.pageTitle} - Freelog`}</title>
    </Helmet>
    {
      Activities[activityDetailsPage.showActivity] || (<div
        style={{
          height: window.innerHeight - 170,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FResultTip
          h1={'活动不存在或者已暂停'}
          btnText={'返回首页'}
          onClickBtn={() => {
            history.push(FUtil.LinkTo.home());
          }}
        />
      </div>)
    }
  </>);

}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(withRouter(Activity));
