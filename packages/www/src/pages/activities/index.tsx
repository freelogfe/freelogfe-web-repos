import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ActivitiesPageModelState, ConnectState } from '@/models/connect';
import * as AHooks from 'ahooks';
import { OnMountPageAction, OnUnmountPageAction } from '@/models/activitiesPage';
import FLoadingTip from '@/components/FLoadingTip';
// import FResultTip from '@/components/FResultTip';
import FNoDataTip from '@/components/FNoDataTip';
import AOrLink from '@/components/FHeaderNavigation/AOrLink';

interface ActivityProps {
  dispatch: Dispatch;
  activitiesPage: ActivitiesPageModelState;
}

function Activity({ dispatch, activitiesPage }: ActivityProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'activitiesPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'activitiesPage/onUnmountPage',
    });
  });

  return (<div className={styles.activity}>
      <div className={styles.title}>
        <div style={{ height: 35 }} />
        <FTitleText text={'活动中心'} type='h1' />
        <div style={{ height: 35 }} />
      </div>
      {
        activitiesPage.listState === 'loading' && (<FLoadingTip height={window.innerHeight - 170} />)
      }

      {
        activitiesPage.listState === 'noData' && (<FNoDataTip
          height={window.innerHeight - 170}
          tipText={'暂无活动'}
        />)
      }

      {
        activitiesPage.listState === 'loaded' && (<>
          <div className={styles.content}>
            {
              activitiesPage.list && activitiesPage.list.map((m) => {
                return (<AOrLink
                  key={m.activityID}
                  className={styles.contentCard}
                  href={FUtil.LinkTo.activity({ activityID: m.activityID })}
                  target='_blank'
                >
                  <img
                    className={styles.contentCard_Cover}
                    src={m.activityCover || (FUtil.Format.completeUrlByDomain('static') + '/static/default_cover.png')}
                    alt={''}
                  />
                  <div style={{ height: 12 }} />
                  <Space size={10}>
                    {
                      m.status === 'starting' && (<label className={styles.startingLabel}>即将开始</label>)
                    }
                    {
                      m.status === 'ongoing' && (<label className={styles.ongoingLabel}>进行中</label>)
                    }
                    {
                      m.status === 'end' && (<label className={styles.closedLabel}>已结束</label>)
                    }

                    <FContentText
                      text={m.activityTitle}
                      type='highlight'
                      singleRow
                      style={{ maxWidth: 450 }}
                    />
                  </Space>
                  <div style={{ height: 10 }} />
                  <FContentText
                    text={'活动时限：' + (m.persis ? '持续进行' : `${m.startTime}-${m.limitTime}`)}
                    type='additional2'
                  />
                </AOrLink>);
              })
            }
            <div style={{ width: 560 }} />
          </div>
          <div style={{ height: 100 }} />
        </>)
      }
    </div>
  );
}

export default connect(({ activitiesPage }: ConnectState) => ({
  activitiesPage,
}))(Activity);
