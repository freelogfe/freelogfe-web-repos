import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FLoudspeaker from '@/components/FIcons/FLoudspeaker';
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
  }[];
}

const initStates: NoticeStates = {
  notices: [],
};

function Notice({}: NoticeProps) {

  const [notices, set_notices] = React.useState<NoticeStates['notices']>(initStates['notices']);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.adsList({
      skip: 0,
      limit: 1,
      place: 1,
    });
    // console.log(data, '#2309i3oj3####');
    set_notices(data.dataList.map((d: any) => {
      // console.log(d, 'd0932iojsdifjsdalkf');
      return {
        id: d._id,
        title: d.title,
        href: d.linkActivityId
          ? (FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activity({ activityID: d.linkActivityId }))
          : d.link,
      };
    }));
  });

  AHooks.useUnmount(() => {

  });

  if (notices.length === 0) {
    return null;
  }

  return (<div className={styles.notice}>
    {
      notices.map((n) => {
        return (<div key={n.id} className={styles.noticeContent}>
          <Space size={10}>
            <FLoudspeaker style={{ color: '#2784FF' }} />
            <span>{n.title}</span>
          </Space>
          <Space size={15}>
            <span>2020/12/23</span>
            <FComponentsLib.FTextBtn
              type='primary'
              onClick={() => {
                window.open(n.href);
              }}
            >查看详情</FComponentsLib.FTextBtn>
          </Space>
        </div>);
      })
    }

  </div>);
}

export default Notice;
