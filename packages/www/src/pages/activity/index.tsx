import * as React from 'react';
import styles from './index.less';
import { FContentText, FTitleText } from '@/components/FText';
import { FUtil } from '@freelog/tools-lib';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ActivityPageModelState, ConnectState } from '@/models/connect';
import * as AHooks from 'ahooks';
import { OnMountPageAction, OnUnmountPageAction } from '@/models/activityPage';;

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
      <a className={styles.content}>

        {
          activityPage.list
        }

        {
          activityPage.list && activityPage.list.map((m) => {
            return (<div key={m.activityID} className={styles.contentCard}>
              <img
                className={styles.contentCard_Cover}
                src={FUtil.Format.completeUrlByDomain('static') + '/static/default_cover.png'}
                alt={''}
              />
              <div style={{ height: 12 }} />
              <Space size={10}>
                <label className={styles.ongoingLabel}>进行中</label>
                {/*<label className={styles.closedLabel}>已结束</label>*/}
                <FContentText
                  text={'内测资源创作大赛内测资源创作大赛内测资源创作大赛内测资源创作大赛内测资源创作大赛'}
                  type='highlight'
                  singleRow
                  style={{ maxWidth: 480 }}
                />
              </Space>
              <div style={{ height: 10 }} />
              <FContentText text={'活动时限：2021/10/11-2021/10/31'} type='additional2' />
            </div>);
          })
        }
        <div style={{ width: 560 }} />
      </a>
      <div style={{ height: 100 }} />
    </div>
  );
}

export default connect(({ activityPage }: ConnectState) => ({
  activityPage,
}))(Activity);
