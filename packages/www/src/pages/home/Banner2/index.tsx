import * as React from 'react';
import styles from './index.less';
import { FTitleText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
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

import 'animate.css';

interface Banner2Props {

}

interface Banner2States {
  activatedIndex: 0 | 1 | 2 | 3;
}

const initStates: Banner2States = {
  activatedIndex: 0,
};

const configInfo: {
  top: number;
  img1: string;
  img2: string;
}[] = [
  {
    top: 20,
    img1: img_Case1,
    img2: img_Case2,
  },
  {
    top: 190,
    img1: img_Case3,
    img2: img_Case4,
  },
  {
    top: 360,
    img1: img_Case5,
    img2: img_Case6,
  },
  {
    top: 530,
    img1: img_Case7,
    img2: img_Case8,
  },
];

function Banner2({}: Banner2Props) {

  const [activatedIndex, set_ActivatedIndex] = React.useState<Banner2States['activatedIndex']>(initStates['activatedIndex']);

  return (<div className={styles.banner2}>
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
        <div className={styles.banner2Content2Left_Card_Mask} style={{ top: configInfo[activatedIndex].top }} />
        <div
          className={[styles.banner2Content2Left_Card, activatedIndex === 0 ? styles.activated : ''].join(' ')}
          style={{ top: 20 }}
          onMouseEnter={() => {
            set_ActivatedIndex(0);
          }}
          onMouseLeave={() => {

          }}
        >
          <FTitleText text={'小说/漫画连载'} type='h1' />
          <div style={{ height: 15 }} />
          <FTitleText text={'自主版权 • 反盗版支持'} type='h4' />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FRectBtn size='small' style={{ padding: '0 15px' }}>小说场景</FRectBtn>
            <div style={{ width: 10 }} />
            <FRectBtn size='small' style={{ padding: '0 15px' }}>漫画场景</FRectBtn>
          </div>
        </div>
        {/*<div style={{ height: 10 }} />*/}
        <div
          className={[styles.banner2Content2Left_Card, activatedIndex === 1 ? styles.activated : ''].join(' ')}
          style={{ top: 190 }}
          onMouseEnter={() => {
            set_ActivatedIndex(1);
          }}
          onMouseLeave={() => {

          }}
        >
          <FTitleText text={'摄影/设计作品集'} type='h1' />
          <div style={{ height: 15 }} />
          <FTitleText text={'版权保护 • 再创作变现'} type='h4' />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FRectBtn size='small' style={{ padding: '0 15px' }}>场景体验</FRectBtn>
          </div>
        </div>
        {/*<div style={{ height: 10 }} />*/}
        <div
          className={[styles.banner2Content2Left_Card, activatedIndex === 2 ? styles.activated : ''].join(' ')}
          style={{ top: 360 }}
          onMouseEnter={() => {
            set_ActivatedIndex(2);
          }}
          onMouseLeave={() => {

          }}
        >
          <FTitleText text={'游戏中心'} type='h1' />
          <div style={{ height: 15 }} />
          <FTitleText text={'简易操作 • 一站式发行服务'} type='h4' />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FRectBtn size='small' style={{ padding: '0 15px' }}>场景体验</FRectBtn>
          </div>
        </div>
        {/*<div style={{ height: 10 }} />*/}
        <div
          className={[styles.banner2Content2Left_Card, activatedIndex === 3 ? styles.activated : ''].join(' ')}
          style={{ top: 530 }}
          onMouseEnter={() => {
            set_ActivatedIndex(3);
          }}
          onMouseLeave={() => {

          }}
        >
          <FTitleText text={'更多可能，等你探索'} type='h1' />
          <div style={{ height: 15 }} />
          <FTitleText text={'编写个人博客、搭建素材库等'} type='h4' />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FRectBtn size='small' style={{ padding: '0 15px' }}>马上注册</FRectBtn>
          </div>
        </div>

      </div>
      <div className={styles.banner2Content2Right}>
        <img className={styles.circularBlue} src={img_CircularBlue} alt={''} />
        <img className={styles.circularGreen} src={img_CircularGreen} alt={''} />
        <img className={styles.latticeBlue} src={img_LatticeBlue} alt={''} />
        <img className={styles.latticeGreen} src={img_LatticeGreen} alt={''} />

        {
          [0, 1, 2, 3].map((i) => {
            return (<React.Fragment key={i}>
              <img
                className={[styles.imgTop, 'animate__animated', i === activatedIndex ? 'animate__flipInX' : ''].join(' ')}
                // className={[styles.imgTop, 'animate__animated', i === activatedIndex ? 'animate__zoomInDown' : ''].join(' ')}
                src={configInfo[activatedIndex].img1}
                style={{ opacity: i === activatedIndex ? 1 : 0 }}
                alt={''}
              />
              <img
                className={[styles.imgBottom, 'animate__animated', i === activatedIndex ? 'animate__flipInX' : ''].join(' ')}
                // className={[styles.imgBottom, 'animate__animated', i === activatedIndex ? 'animate__zoomInUp' : ''].join(' ')}
                src={configInfo[activatedIndex].img2}
                alt={''}
                style={{ opacity: i === activatedIndex ? 1 : 0 }}
              />
            </React.Fragment>);
          })
        }

      </div>
    </div>
  </div>);
}

export default Banner2;
