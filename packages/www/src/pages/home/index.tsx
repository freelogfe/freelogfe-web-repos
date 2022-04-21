import styles from './index.less';
import { FRectBtn } from '@/components/FButton';
import { FTitleText } from '@/components/FText';
import img_CircularBlue from '@/assets/circular-blue.png';
import img_CircularGreen from '@/assets/circular-green.png';
import img_LatticeBlue from '@/assets/lattice-blue.png';
import img_LatticeGreen from '@/assets/lattice-green.png';

import img_Case1 from '@/assets/case1.jpg';
import img_Case2 from '@/assets/case2.jpg';
import img_Case3 from '@/assets/case3.jpg';
import img_Case4 from '@/assets/case4.jpg';
import img_Case5 from '@/assets/case5.jpg';
import img_Case6 from '@/assets/case6.jpg';
import img_Case7 from '@/assets/case7.jpg';
import img_Case8 from '@/assets/case8.jpg';

interface HomePageProps {

}

function HomePage({}: HomePageProps) {
  return (<div>
    <div className={styles.banner0}>
      <span className={styles.banner0White}>3000元现金奖励等你赢取！内测期间参与</span>
      <a className={styles.banner0Red}>资源创作大赛</a>
      <span className={styles.banner0White}>，最低可领15元现金奖励，参与排名更有机会赢取3000元现金奖励！</span>
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

    <div className={styles.banner2}>
      <div className={styles.banner2Content}>
        <div style={{ height: 30 }} />
        <h1 className={styles.banner2H1}>丰富的应用场景</h1>
        <div style={{ height: 20 }} />
        <h2 className={styles.banner2H2}>Freelog，基于「智能合约」的虚拟资源交易平台，支持资源授权的自动化和定制化，</h2>
        <h2 className={styles.banner2H2}>为资源的发行、再创作和推广提供多样化解决方案，助力资源作者和运营者快速变现。</h2>
        <div style={{ height: 20 }} />
        <h3 className={styles.banner2H3}>一键创建资源商店 • 收益独享 • 多渠道变现</h3>
      </div>
      <div style={{ height: 60 }} />
      <div className={styles.banner2Content2}>
        <div className={styles.banner2Content2Left}>
          <div style={{ height: 20 }} />
          <div className={[styles.banner2Content2Left_Card, styles.activated].join(' ')}>
            <FTitleText text={'小说/漫画连载'} type='h1' />
            <div style={{ height: 15 }} />
            <FTitleText text={'自主版权 • 反盗版支持'} type='h4' />
            <div style={{ height: 15 }} />
            <div className={styles.banner2Content2Left_CardFooter}>
              <FRectBtn size='small'>小说场景</FRectBtn>
              <div style={{ width: 10 }} />
              <FRectBtn size='small'>漫画场景</FRectBtn>
            </div>
          </div>
          <div style={{ height: 10 }} />
          <div className={styles.banner2Content2Left_Card}>
            <FTitleText text={'摄影/设计作品集'} type='h1' />
            <div style={{ height: 15 }} />
            <FTitleText text={'版权保护 • 再创作变现'} type='h4' />
            <div style={{ height: 15 }} />
            <div className={styles.banner2Content2Left_CardFooter}>
              <FRectBtn size='small'>小说场景</FRectBtn>
              <div style={{ width: 10 }} />
              <FRectBtn size='small'>漫画场景</FRectBtn>
            </div>
          </div>
          <div style={{ height: 10 }} />
          <div className={styles.banner2Content2Left_Card}>
            <FTitleText text={'游戏中心'} type='h1' />
            <div style={{ height: 15 }} />
            <FTitleText text={'简易操作 • 一站式发行服务'} type='h4' />
            <div style={{ height: 15 }} />
            <div className={styles.banner2Content2Left_CardFooter}>
              <FRectBtn size='small'>小说场景</FRectBtn>
              <div style={{ width: 10 }} />
              <FRectBtn size='small'>漫画场景</FRectBtn>
            </div>
          </div>
          <div style={{ height: 10 }} />
          <div className={styles.banner2Content2Left_Card}>
            <FTitleText text={'更多可能，等你探索'} type='h1' />
            <div style={{ height: 15 }} />
            <FTitleText text={'编写个人博客、搭建素材库等'} type='h4' />
            <div style={{ height: 15 }} />
            <div className={styles.banner2Content2Left_CardFooter}>
              <FRectBtn size='small'>小说场景</FRectBtn>
              <div style={{ width: 10 }} />
              <FRectBtn size='small'>漫画场景</FRectBtn>
            </div>
          </div>

        </div>
        <div className={styles.banner2Content2Right}>
          <img className={styles.circularBlue} src={img_CircularBlue} alt={''} />
          <img className={styles.circularGreen} src={img_CircularGreen} alt={''} />
          <img className={styles.latticeBlue} src={img_LatticeBlue} alt={''} />
          <img className={styles.latticeGreen} src={img_LatticeGreen} alt={''} />

          <img className={styles.imgTop} src={img_Case1} />
          <img className={styles.imgBottom} src={img_Case2} />
        </div>
      </div>
    </div>
    <div className={styles.banner3}>

    </div>
    <div className={styles.banner4}>

    </div>

  </div>);
}

export default HomePage;
