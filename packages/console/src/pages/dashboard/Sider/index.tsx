import * as React from 'react';
import styles from './index.less';
import FFormLayout from '@/components/FFormLayout';
import { Space } from 'antd';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';

interface SiderProps {

}

interface SiderStates {
  ads: {
    id: string;
    cover: string;
    href: string;
  }[];
}

const initStates: SiderStates = {
  ads: [],
};

function Sider({}: SiderProps) {

  const [ads, set_ads] = React.useState<SiderStates['ads']>(initStates['ads']);

  AHooks.useMount(async () => {
    const { data } = await FServiceAPI.Activity.adsList({
      skip: 0,
      limit: 3,
      place: 3,
    });
    // console.log(data, '#2309i3oj3####');
    set_ads(data.dataList.map((d: any) => {
      // console.log(d, 'd0932iojsdifjsdalkf');
      return {
        id: d._id,
        cover: d.cover,
        href: d.linkActivityId
          ? (FUtil.Format.completeUrlByDomain('www') + FUtil.LinkTo.activity({ activityID: d.linkActivityId }))
          : d.link,
      };
    }));
  });

  AHooks.useUnmount(() => {

  });

  return (<div>
    <div style={{ height: 50 }} />
    <Space size={10} direction={'vertical'} className={styles.statisticsRight}>

      {
        ads.map((ad) => {
          // return (<a key={ad.id} href={ad.href} target='_blank' className={styles.imgCard}>
          //   <img src={ad.cover} alt={''} />
          // </a>);
          return (<Advertisement key={ad.id} ad={ad} />);
        })
      }


      {/*<a href={'#'} className={styles.imgCard}>*/}
      {/*  <img src={img_Questionnaire} alt={''} />*/}
      {/*</a>*/}

      <div className={styles.panelCard}>
        <FFormLayout>
          <FFormLayout.FBlock
            title={'常见问题'}
            extra={<FComponentsLib.FTextBtn
              type='default'
              onClick={() => {
                window.open('https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537');
              }}
            >更多 &gt;</FComponentsLib.FTextBtn>}
          >
            <div className={styles.linkList}>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537&title=1.+%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E5%8F%91%E8%A1%8C%E5%8D%95%E4%B8%AA%E8%B5%84%E6%BA%90'}
                  target={'_blank'}
                >如何创建资源？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537&title=1.%E5%A6%82%E4%BD%95%E5%88%9B%E5%BB%BA%E8%8A%82%E7%82%B9'}
                  target={'_blank'}
                >如何创建节点？</a>
              </div>
              {/*<div className={styles.linkListItem}>*/}
              {/*  <i />*/}
              {/*  <span />*/}
              {/*  <a*/}
              {/*    href={'https://www.freelog.com/home'}*/}
              {/*    target={'_blank'}*/}
              {/*  >Freelog有哪些使用场景？</a>*/}
              {/*</div>*/}
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/home_freelog-query_id=62d0cf48456ff0002e3294fb&title=%E4%B8%80%E3%80%81%E5%B9%B3%E5%8F%B0%E8%A7%92%E8%89%B2'}
                  target={'_blank'}
                >资源作者和节点商有什么区别？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/home_freelog-query_id=62d0d04f456ff0002e329537&title=3.%E5%8F%AA%E5%88%9B%E5%BB%BA%E4%BA%86%E6%8E%88%E6%9D%83%E6%9D%A1%E7%9B%AE%EF%BC%8C%E5%A6%82%E4%BD%95%E7%BB%A7%E7%BB%AD%E6%8F%90%E4%BA%A4%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6%E3%80%81%E6%B7%BB%E5%8A%A0%E6%8E%88%E6%9D%83%E7%AD%96%E7%95%A5'}
                  target={'_blank'}
                >如何添加授权策略？</a>
              </div>
            </div>
          </FFormLayout.FBlock>
        </FFormLayout>
      </div>

      {/*<div className={styles.panelCard}>*/}
      {/*  <FFormLayout>*/}
      {/*    <FFormLayout.FBlock*/}
      {/*      title={'热门讨论'}*/}
      {/*      extra={<FComponentsLib.FTextBtn*/}
      {/*        type='default'*/}
      {/*        onClick={() => {*/}

      {/*        }}*/}
      {/*      >更多 &gt;</FComponentsLib.FTextBtn>}*/}
      {/*    >*/}
      {/*      <div className={styles.linkList}>*/}
      {/*        <div className={styles.linkListItem}>*/}
      {/*          <i />*/}
      {/*          <span />*/}
      {/*          <a*/}
      {/*            href={'https://forum.freelog.com/topic/3/freelog%E5%86%85%E6%B5%8B%E7%AD%BE%E5%88%B0%E6%A5%BC-%E5%AE%8C%E6%88%90%E7%AD%BE%E5%88%B0%E5%8D%B3%E6%9C%89%E6%9C%BA%E4%BC%9A%E9%A2%866%E5%85%83%E7%8E%B0%E9%87%91%E5%A5%96%E5%8A%B1'}*/}
      {/*            target='_blank'*/}
      {/*          >Freelog内测签到盖楼，完成签到和其他基础任务领6元现金奖励！</a>*/}
      {/*        </div>*/}
      {/*        /!*<div className={styles.linkListItem}>*!/*/}
      {/*        /!*  <i />*!/*/}
      {/*        /!*  <span />*!/*/}
      {/*        /!*  <a href={'#'} target='_blank'>Freelog内测等你来“找茬”，参与有机会赢取400元京东购物卡！</a>*!/*/}
      {/*        /!*</div>*!/*/}
      {/*      </div>*/}
      {/*    </FFormLayout.FBlock>*/}
      {/*  </FFormLayout>*/}
      {/*</div>*/}

    </Space>
  </div>);
}

export default Sider;

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
    className={styles.imgCard}
    onClick={async () => {
      await FServiceAPI.Activity.eventTrackingAdsClick({ _id: ad.id });
    }}
  >
    <img src={ad.cover} alt={''} />
  </a>);
}
