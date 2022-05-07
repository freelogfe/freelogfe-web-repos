import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ActivityPageModelState, ConnectState } from '@/models/connect';
import * as AHooks from 'ahooks';
import { OnMountPageAction, OnUnmountPageAction } from '@/models/activityPage';
import FLoadingTip from '@/components/FLoadingTip';
import FResultTip from '@/components/FResultTip';
import FNoDataTip from '@/components/FNoDataTip';

interface ActivityProps {
  dispatch: Dispatch;
  activityPage: ActivityPageModelState;
}

function Activity({ dispatch, activityPage }: ActivityProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'activityPage/onMountPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountPageAction>({
      type: 'activityPage/onUnmountPage',
    });
  });

  return (<div className={styles.activity}>
      <div className={styles.title}>
        <div style={{ height: 35 }} />
        <FTitleText text={'活动中心'} type='h1' />
        <div style={{ height: 35 }} />
      </div>
      {
        activityPage.listState === 'loading' && (<FLoadingTip height={window.innerHeight - 170} />)
      }

      {
        activityPage.listState === 'noData' && (<FNoDataTip
          height={window.innerHeight - 170}
          tipText={'暂无活动'}
        />)
      }

      {
        activityPage.listState === 'loaded' && (<>
          <div className={styles.content}>
            {
              activityPage.list && activityPage.list.map((m) => {
                return (<a key={m.activityID} className={styles.contentCard}>
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
                </a>);
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

export default connect(({ activityPage }: ConnectState) => ({
  activityPage,
}))(Activity);
