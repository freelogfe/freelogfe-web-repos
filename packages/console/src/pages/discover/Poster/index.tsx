import * as React from 'react';
import styles from './index.less';
import img_market1 from '@/assets/market1@x2.png';
import img_market2 from '@/assets/market2@x2.png';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface PosterProps {

}

interface PosterStates {
  poster: {
    cover: string;
    href: string;
  }[];
}

function Poster({}: PosterProps) {

  const [poster, setPoster] = React.useState<PosterStates['poster']>([]);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.adsList({
      place: 4,
    });
    // console.log(data, '#2309i3oj3####');
    setPoster(data.dataList.map((d: any) => {
      return {
        cover: d.cover,
        href: d.linkActivityId
          ? (FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activity({ activityID: d.linkActivityId }))
          : d.link,
      };
    }));
  });

  return (<div className={styles.poster}>
    {/*{*/}
    {/*  poster.map((p) => {*/}
    {/*    return */}
    {/*  })*/}
    {/*}*/}
    {
      poster.length > 0 && (<a href={poster[0].href} target='_blank'>
        {/*<img src={img_market1} alt={''} />*/}
        <img src={poster[0].cover} alt={''} />
      </a>)
    }

    <div style={{ width: 20 }} />
    {
      poster.length > 1 && (<a href={poster[1].href} target='_blank'>
        <img src={poster[1].cover} alt={''} />
      </a>)
    }

  </div>);
}

export default Poster;
