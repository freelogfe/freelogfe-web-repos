import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';
import ResourceCompetition from '@/pages/activity/$id/ResourceCompetition';
import PlayNewer from './PlayNewer';
import InviteFriend from './InviteFriend';
import Questionnaire from './Questionnaire';
import * as AHooks from 'ahooks';
import {
  OnMountPageAction,
  OnUnmountPageAction,
} from '@/models/activityDetailsPage';
import { IRouteComponentProps, withRouter } from 'umi';
import FResultTip from '@/components/FResultTip';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { Helmet } from 'react-helmet';
import ExperienceOfficer from './ExperienceOfficer';
import SpringFestival from './SpringFestival';
import EditorPick  from './EditorPick';

interface ActivityProps extends IRouteComponentProps {
  dispatch: Dispatch;
  activityDetailsPage: ActivityDetailsPageModelState;
}

function Activity({
                    dispatch,
                    activityDetailsPage,
                    match,
                    history,
                  }: ActivityProps) {

  // const [cookie, setCookie] = AHooks.useCookieState('uid', {
  //   defaultValue: undefined,
  // });
  // console.log(cookie, 'cookie dsFSDFSDFSDFSDFSDFSDFSDFSDFSDFSDFS');
  const Activities: any = {
    'ResourceCompetition': (<ResourceCompetition />),
    'play-newer': (<PlayNewer />),
    'invite-friend': (<InviteFriend />),
    'Questionnaire': (<Questionnaire />),
    'ExperienceOfficer': (<ExperienceOfficer />),
    'SpringFestival': (<SpringFestival />),
    'event_editorpick ': (<EditorPick />),
  };

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'activityDetailsPage/onMountPage',
      payload: {
        activityID: (match.params as { id: string }).id || '',
      },
    });
  });

  // AHooks.useDebounceEffect(() => {
  //   console.log(cookie, 'sdf90ijsdl;kfjsdlkfjlksdjlfkjlkj');
  //   // if (!cookie) {
  //   //   self.location.reload();
  //   // }
  // }, [cookie], {
  //   wait: 300,
  // });

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
        {/*msg_event_suspend */}
        <FResultTip
          // h1={'活动不存在或者已暂停'}
          h1={FI18n.i18nNext.t('msg_event_suspend')}
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
