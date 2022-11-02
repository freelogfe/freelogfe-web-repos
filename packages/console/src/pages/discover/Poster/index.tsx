import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface PosterProps {

}

interface PosterStates {
  poster: {
    id: string;
    cover: string;
    href: string;
  }[];
}

function Poster({}: PosterProps) {

  const [poster, setPoster] = React.useState<PosterStates['poster']>([]);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.adsList({
      place: 4,
      limit: 2,
    });
    // console.log(data, '#2309i3oj3####');
    setPoster(data.dataList.map((d: any) => {
      return {
        id: d._id,
        cover: d.cover,
        href: d.linkActivityId
          ? (FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activity({ activityID: d.linkActivityId }))
          : d.link,
      };
    }));
  });

  return (<div className={styles.poster}>
    {
      poster.map((p) => {
        return (<Advertisement key={p.id} ad={p} />);
      })
    }
  </div>);
}

export default Poster;


interface AdvertisementProps {
  ad: {
    id: string;
    href: string;
    cover: string;
  };
}

function Advertisement({ ad }: AdvertisementProps) {

  AHooks.useMount(async () => {
    await FServiceAPI.Activity.eventTrackingAdsVisit({ _id: ad.id });
  });

  return (<a
    key={ad.id}
    href={ad.href}
    target='_blank'
    onClick={async () => {
      await FServiceAPI.Activity.eventTrackingAdsClick({ _id: ad.id });
    }}
  >
    <img src={ad.cover} alt={''} />
  </a>);
}
