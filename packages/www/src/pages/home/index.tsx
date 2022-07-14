import * as React from 'react';
import styles from './index.less';
import { FRectBtn } from '@/components/FButton';
import FPentagram from '@/components/FIcons/FPentagram';

import img_Banner3_1 from '@/assets/home/banner3-1.png';
import img_Banner3_2 from '@/assets/home/banner3-2.png';
import img_Banner3_3 from '@/assets/home/banner3-3.png';

import img_RewardSuspension from '@/assets/home/reward-suspension.png';
import Banner2 from '@/pages/home/Banner2';
// import FPageFooter from '@/components/FPageFooter';
import FComponentsLib from '@freelog/components-lib';
import Ads from '@/pages/home/Ads';
import { Popover } from 'antd';

interface HomePageProps {

}

function HomePage({}: HomePageProps) {
  return (<div>
    <div className={styles.banner0}>
      <span className={styles.banner0White}>3000元现金奖励等你赢取！内测期间参与</span>
      <a className={styles.banner0Red}>资源创作大赛</a>
      <span className={styles.banner0White}>，最低可领15元现金奖励，参与排名更有机会赢取3000元现金奖励！</span>
      <FPentagram style={{ color: '#F3E574' }} />
    </div>
    <div className={styles.banner1}>
      <div className={styles.banner1Content}>
        <div style={{ height: 110 }} />
        <h1 className={styles.banner1H1}>创作盛放之地</h1>
        <div style={{ height: 40 }} />
        <h2 className={styles.banner1H2}>免费专业的资源发行和运营平台</h2>
        <div style={{ height: 20 }} />
        <h3 className={styles.banner1H3}>支持漫画、小说、图片、游戏、视频、音乐、插件、主题等各类型资源</h3>
        <div style={{ height: 40 }} />
        <FRectBtn style={{ height: 60, fontSize: 22, padding: '0 50px', fontWeight: 400 }}>免费使用</FRectBtn>
      </div>
    </div>

    <Banner2 />

    <div className={styles.banner3}>
      <div style={{ height: 150 }} />
      <h1 className={styles.banner3H1}>助力虚拟资源发行和运营</h1>
      <div style={{ height: 20 }} />
      <h3 className={styles.banner3H2}>实现资源授权与交易自动化、定制化，开创资源再创作的变现新模式，节点商整合运营资源助力变现</h3>
      <div style={{ height: 150 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_1} alt={''} className={styles.banner3_Content_LeftImg} />
        <div />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>「 智能合约 」，高效变现</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>根据不同人群创建不同授权策略，实现交易定制化、自动化，满足你的多样变现需求。</div>
          <div style={{ height: 30 }} />
          <FRectBtn style={{ height: 42, fontSize: 16 }}>进一步了解</FRectBtn>
        </div>
      </div>

      <div style={{ height: 100 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_2} alt={''} className={styles.banner3_Content_RightImg} />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>「 再创作 」，助力多渠道变现</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>资源可被他人签约为素材进行再创作，拓宽资源变现渠道。</div>
          <div style={{ height: 30 }} />
          <FRectBtn style={{ height: 42, fontSize: 16 }}>进一步了解</FRectBtn>
        </div>
        <div />
      </div>

      <div style={{ height: 100 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_3} alt={''} className={styles.banner3_Content_LeftImg} />
        <div />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>节点商运营，轻松获益</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>新增节点商角色，专注资源运营，提高变现效率， 你可以专注生产优质资源，轻松获益。</div>
          <div style={{ height: 30 }} />
          <FRectBtn style={{ height: 42, fontSize: 16 }}>进一步了解</FRectBtn>
        </div>
      </div>

      <div style={{ height: 150 }} />

    </div>
    <div className={styles.banner4}>
      <h1 className={styles.banner4H1}>Freelog，专业免费的资源发行和运营平台</h1>
      <div style={{ height: 40 }} />
      <h3 className={styles.banner4H2}>支持图片、小说、游戏、漫画、视频、音乐、主题、插件等各类型资源快速变现</h3>
      <div style={{ height: 40 }} />
      <FRectBtn style={{ height: 60, fontSize: 22, padding: '0 50px', fontWeight: 400 }}>免费使用</FRectBtn>
    </div>

    <FComponentsLib.FPageFooter PopoverPatch={Popover} />

    <Ads />

    {/*<a className={styles.rewardSuspension}>*/}
    {/*  <img src={img_RewardSuspension} alt={''} />*/}
    {/*</a>*/}
  </div>);
}

export default HomePage;
