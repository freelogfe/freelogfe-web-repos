import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
// import AOrLink from '@/components/FHeaderNavigation/AOrLink';

interface AdsProps {

}

interface AdsStates {
  info: {
    cover: string;
    href: string;
  } | null;
}

const initData: AdsStates = {
  info: null,
};

function Ads({}: AdsProps) {

  const [info, set_info] = React.useState<AdsStates['info']>(initData['info']);

  AHooks.useMount(async () => {
    const { data: {dataList} } = await FServiceAPI.Activity.adsList({
      limit: 1,
      place: 2,
    });

    // console.log(dataList, 'data093iorjfsdlkfj');

    if (dataList && dataList.length > 0) {
      set_info({
        cover: dataList[0].cover,
        href: dataList[0].linkActivityId
          ? (FUtil.LinkTo.activity({ activityID: dataList[0].linkActivityId }))
          : dataList[0].link,
      });
    }
    // console.log(data, '#2309i3oj3####');

  });

  AHooks.useUnmount(() => {

  });

  if (!info) {
    return null;
  }

  return (<a
    href={info.href}
    onClick={() => {
      self._czc.push(['_trackEvent', '首页', '参与内测（浮窗）', '', 1]);
    }}
    target='_blank'
    className={styles.rewardSuspension}
  >
    <img src={info.cover} alt={''} />
  </a>);
}

export default Ads;
