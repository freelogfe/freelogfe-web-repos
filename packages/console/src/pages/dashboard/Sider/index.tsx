import * as React from 'react';
import styles from './index.less';
// import img_Invite from '@/assets/invite.png';
// import img_Questionnaire from '@/assets/questionnaire.png';
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
      limit: 2,
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
          return (<a key={ad.id} href={ad.href} target='_blank' className={styles.imgCard}>
            <img src={ad.cover} alt={''} />
          </a>);
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
                window.open('https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62d0d04f456ff0002e329537');
              }}
            >更多 &gt;</FComponentsLib.FTextBtn>}
          >
            <div className={styles.linkList}>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  target={'_blank'}
                >如何创建资源？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  target={'_blank'}
                >如何创建节点？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  target={'_blank'}
                >Freelog有哪些使用场景？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  target={'_blank'}
                >资源作者和节点商有什么区别？</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a
                  href={'https://freelog3.freelog.com/$freelog-61f252ef6fe5c1002e2c7b4b=/home_id=62ce6f8a456ff0002e32915f'}
                  target={'_blank'}
                >如何添加授权策略？</a>
              </div>
            </div>
          </FFormLayout.FBlock>
        </FFormLayout>
      </div>

      <div className={styles.panelCard}>
        <FFormLayout>
          <FFormLayout.FBlock
            title={'热门讨论'}
            extra={<FComponentsLib.FTextBtn type='default'>更多 &gt;</FComponentsLib.FTextBtn>}
          >
            <div className={styles.linkList}>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a href={'#'} target='_blank'>Freelog内测签到盖楼，完成签到和其他基础任务领6元现金奖励！</a>
              </div>
              <div className={styles.linkListItem}>
                <i />
                <span />
                <a href={'#'} target='_blank'>Freelog内测等你来“找茬”，参与有机会赢取400元京东购物卡！</a>
              </div>
            </div>
          </FFormLayout.FBlock>
        </FFormLayout>
      </div>

    </Space>
  </div>);
}

export default Sider;
