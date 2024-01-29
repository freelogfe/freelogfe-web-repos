import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';

interface NoticeProps {

}

interface NoticeStates {
  notices: {
    id: string;
    title: string;
    href: string;
    date: string;
  }[];
}

const initStates: NoticeStates = {
  notices: [],
};

function Notice({}: NoticeProps) {

  const [notices, set_notices] = React.useState<NoticeStates['notices']>(initStates['notices']);

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        dataList: {
          _id: string;
          title: string;
          linkActivityId: string;
          link: string;
        }[]

      }
    } = await FServiceAPI.Activity.adsList({
      skip: 0,
      limit: 1,
      place: 1,
    });
    // console.log(data, '#2309i3oj3####');
    set_notices(data.dataList.map((d) => {
      // console.log(d, 'd0932iojsdifjsdalkf');
      return {
        id: d._id,
        title: d.title,
        href: d.linkActivityId
          ? (FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activity({ activityID: d.linkActivityId }))
          : d.link,
        date: '0000-00-00',
      };
    }));

    if (data.dataList.length === 0) {
      return;
    }
    await FServiceAPI.Activity.eventTrackingAdsVisit({ _id: data.dataList[0]._id });
  });

  AHooks.useUnmount(() => {

  });

  if (notices.length === 0) {
    return null;
  }

  return (<div
    className={styles.banner0}
    onClick={async () => {
      await FServiceAPI.Activity.eventTrackingAdsClick({ _id: notices[0].id });
      self.open(notices[0].href);
    }}
  >
    {/*<span className={styles.banner0White}>内测期间参</span>*/}
    {/*<a*/}
    {/*  className={styles.banner0Red}*/}
    {/*  target={'_blank'}*/}
    {/*  // href={FI18n.i18nNext.t('beta_event_guideline_contest_link')}*/}
    {/*  href={topLink}*/}
    {/*>资源创作大赛</a>*/}
    <span className={styles.banner0White}>{notices[0].title}</span>
    <FComponentsLib.FIcons.FPentagram style={{ color: '#F3E574' }} />
  </div>);

  // return (<div className={styles.notice}>
  //   {
  //     notices.map((n) => {
  //       return (<div key={n.id} className={styles.noticeContent}>
  //         <Space size={10}>
  //           <FComponentsLib.FIcons.FLoudspeaker style={{ color: '#2784FF' }} />
  //           <span>{n.title}</span>
  //         </Space>
  //         <Space size={15}>
  //           {/*<span>{n.date}</span>*/}
  //           <FComponentsLib.FTextBtn
  //             type='primary'
  //             onClick={async () => {
  //               await FServiceAPI.ActivitySchedule.eventTrackingAdsClick({ _id: n.id });
  //               self.open(n.href);
  //             }}
  //           >查看详情</FComponentsLib.FTextBtn>
  //         </Space>
  //       </div>);
  //     })
  //   }
  //
  // </div>);
}

export default Notice;
