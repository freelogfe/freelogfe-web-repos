import * as React from 'react';
import styles from './index.less';
import FLink from '@/components/FLink';
import * as AHooks from 'ahooks';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, UserModelState } from '@/models/connect';
import { FetchInfoAction } from '@/models/user';
import UserSVG from '@/assets/user.svg';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { IRouteComponentProps, withRouter } from 'umi';
import FComponentsLib from '@freelog/components-lib';

interface LoggedProps extends IRouteComponentProps {
  dispatch: Dispatch;
  user: UserModelState;
}

function FLogged({ dispatch, user, children, location }: LoggedProps) {

  // console.log(location, route, 'matchmatchmatch12341234');
  const [showPage, setShowPage] = React.useState<'wallet' | 'reward' | 'contract' | 'setting'>('wallet');

  AHooks.useMount(() => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    dispatch<FetchInfoAction>({
      type: 'user/fetchInfo',
    });
  });

  React.useEffect(() => {
    setShowPage(location.pathname.replace('/logged/', '') as 'wallet');
  }, [location]);

  return (<>
    <div className={styles.container}>
      <div className={styles.padding} />
      <div className={styles.sider}>
        <div>
          <div style={{ height: 35 }} />
          <div className={styles.userInfo}>
            {/*<img*/}
            {/*  alt=''*/}
            {/*  src={(user.userInfo?.headImage || UserSVG) as string}*/}
            {/*  className={styles.img}*/}
            {/*/>*/}
            <div
              // src={settingPage.avatar}
              // alt="avatar"
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: `url(${user.userInfo?.headImage || UserSVG})`,
                width: 80,
                height: 80,
                borderRadius: '50%',
              }}
            />
            <div style={{ height: 20 }} />
            <FComponentsLib.FTitleText type='h3' text={user.userInfo?.username || ''} />
            {/*<div style={{ height: 10 }} />*/}
            {/*<FComponentsLib.FContentText type='highlight' text={user.userInfo?.mobile || user.userInfo?.email || ''} />*/}
            <div style={{ height: 35 }} />
            <FLink
              to={FUtil.LinkTo.wallet()}
              className={[styles.FLink, showPage === 'wallet' ? styles.FLinkActive : ''].join(' ')}>{FI18n.i18nNext.t('tab_my_wallet')}</FLink>
            <FLink
              to={FUtil.LinkTo.contract()}
              className={[styles.FLink, showPage === 'contract' ? styles.FLinkActive : ''].join(' ')}>{FI18n.i18nNext.t('tab_my_contracts')}</FLink>
            <FLink
              to={FUtil.LinkTo.setting()}
              className={[styles.FLink, showPage === 'setting' ? styles.FLinkActive : ''].join(' ')}>{FI18n.i18nNext.t('tab_settings')}</FLink>
            <FLink
              to={FUtil.LinkTo.reward()}
              className={[styles.FLink, showPage === 'reward' ? styles.FLinkActive : ''].join(' ')}>活动奖励</FLink>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          {children}
          {/*<FFooter style={{position: 'relative !important',shrink: 0}}/>*/}
        </div>
      </div>
    </div>
  </>);
}

export default connect(({ user }: ConnectState) => ({
  user,
}))(withRouter(FLogged));
