import * as React from 'react';
import styles from './index.less';
import img_CircularBlue from '@/assets/home/circular-blue.png';
import img_CircularGreen from '@/assets/home/circular-green.png';
import img_LatticeBlue from '@/assets/home/lattice-blue.png';
import img_LatticeGreen from '@/assets/home/lattice-green.png';
import img_Case1 from '@/assets/home/case1.jpg';
import img_Case2 from '@/assets/home/case2.jpg';
import img_Case3 from '@/assets/home/case3.jpg';
import img_Case4 from '@/assets/home/case4.jpg';
import img_Case5 from '@/assets/home/case5.jpg';
import img_Case6 from '@/assets/home/case6.jpg';
import img_Case7 from '@/assets/home/case7.jpg';
import img_Case8 from '@/assets/home/case8.jpg';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';

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
      <h1 className={styles.banner2H1}>{FI18n.i18nNext.t('home_scene')}</h1>
      <div style={{ height: 20 }} />
      <h2 className={styles.banner2H2}>{FI18n.i18nNext.t('home_scene_descr')}</h2>
      {/*<h2 className={styles.banner2H2}>为资源的发行、再创作和推广提供多样化解决方案，助力资源作者和运营者快速变现。</h2>*/}
      <div style={{ height: 20 }} />
      <h3 className={styles.banner2H3}>{FI18n.i18nNext.t('home_scene_descr_02')}</h3>
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
          <FComponentsLib.FTitleText
            style={{ textAlign: 'center' }}
            text={FI18n.i18nNext.t('home_scene_01')}
            type='h1'
          />
          <div style={{ height: 15 }} />
          <FComponentsLib.FTitleText
            style={{ textAlign: 'center' }}
            text={FI18n.i18nNext.t('home_scene_01_descr')}
            type='h4'
          />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FComponentsLib.FRectBtn
              size='small'
              style={{ padding: '0 15px' }}
              onClick={() => {
                self._czc?.push(['_trackEvent', '首页', '小说阅读', '', 1]);
                window.open(FI18n.i18nNext.t('home_scene_01_link'));
              }}
            >{FI18n.i18nNext.t('btn_viewlivenode_reading')}</FComponentsLib.FRectBtn>
            <div style={{ width: 10 }} />
            <FComponentsLib.FRectBtn
              size='small'
              style={{ padding: '0 15px' }}
              onClick={() => {
                self._czc?.push(['_trackEvent', '首页', '漫画阅读', '', 1]);
                window.open(FI18n.i18nNext.t('home_scene_01_link_02'));
              }}
            >{FI18n.i18nNext.t('btn_viewlivenode_comics')}</FComponentsLib.FRectBtn>
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
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_02')}
            type='h1'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_02_descr')}
            type='h4'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            {/*<FComponentsLib.FRectBtn size='small' style={{ padding: '0 15px' }}>场景体验</FComponentsLib.FRectBtn>*/}
            <FComponentsLib.FRectBtn
              size='small'
              style={{ padding: '0 15px' }}
              onClick={() => {
                self._czc?.push(['_trackEvent', '首页', '现在体验', '', 1]);
                window.open(FI18n.i18nNext.t('home_scene_02_link'));
              }}
            >{FI18n.i18nNext.t('btn_viewlivenode_02')}</FComponentsLib.FRectBtn>
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
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_03')}
            type='h1'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_03_descr')}
            type='h4'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FComponentsLib.FRectBtn
              size='small'
              style={{ padding: '0 15px' }}
              onClick={() => {
                self._czc?.push(['_trackEvent', '首页', '现在体验', '', 1]);
                window.open(FI18n.i18nNext.t('home_scene_03_link'));
              }}
            >{FI18n.i18nNext.t('btn_viewlivenode_03')}</FComponentsLib.FRectBtn>
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
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_04')}
            type='h1'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <FComponentsLib.FTitleText
            text={FI18n.i18nNext.t('home_scene_04_descr')}
            type='h4'
            style={{ textAlign: 'center' }}
          />
          <div style={{ height: 15 }} />
          <div className={styles.banner2Content2Left_CardFooter}>
            <FComponentsLib.FRectBtn
              size='small'
              style={{ padding: '0 15px' }}
              onClick={() => {
                self._czc?.push(['_trackEvent', '首页', '马上注册', '', 1]);
                window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon());
              }}
            >{FI18n.i18nNext.t('btn_signupnow')}</FComponentsLib.FRectBtn>
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
                src={configInfo[activatedIndex].img2}
                style={{ opacity: i === activatedIndex ? 1 : 0 }}
                alt={''}
              />
              <img
                className={[styles.imgBottom, 'animate__animated', i === activatedIndex ? 'animate__flipInX' : ''].join(' ')}
                src={configInfo[activatedIndex].img1}
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
