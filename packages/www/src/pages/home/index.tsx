import * as React from 'react';
import styles from './index.less';
// import FPentagram from '@/components/FIcons/FPentagram';
import img_Banner3_1 from '@/assets/home/banner3-1.png';
import img_Banner3_2 from '@/assets/home/banner3-2.png';
import img_Banner3_3 from '@/assets/home/banner3-3.png';
import Banner2 from '@/pages/home/Banner2';
import FComponentsLib from '@freelog/components-lib';
import Ads from '@/pages/home/Ads';
import { Popover } from 'antd';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface HomePageProps {

}

function HomePage({}: HomePageProps) {

  const [topLink, set_topLink] = React.useState<string>(FI18n.i18nNext.t('beta_event_guideline_contest_link'));


  AHooks.useMount(async () => {
    self._czc?.push(['_trackPageview', self.location.pathname]);
    // const { data } = await FServiceAPI.Activity.adsList({
    //   place: 1,
    // });
    // // console.log(data, 'data09ioweskjfsldkfjsldkfjdslkjl');
    // if (!data || !data.dataList || data.dataList.length === 0) {
    //   return;
    // }
    // set_topLink(data.dataList[0].link);
  });

  return (<div>
    <div className={styles.banner0}>
      <span className={styles.banner0White}>内测期间参</span>
      <a
        className={styles.banner0Red}
        target={'_blank'}
        // href={FI18n.i18nNext.t('beta_event_guideline_contest_link')}
        href={topLink}
      >资源创作大赛</a>
      <span className={styles.banner0White}>，最低可领15元现金奖励，更有机会赢取2000元大奖！</span>
      <FComponentsLib.FIcons.FPentagram style={{ color: '#F3E574' }} />
    </div>
    <div className={styles.banner1}>
      <div className={styles.banner1Content}>
        <div style={{ height: 110 }} />
        <h1 className={styles.banner1H1}>{FI18n.i18nNext.t('home_slogan')}</h1>
        <div style={{ height: 40 }} />
        <h2 className={styles.banner1H2}>{FI18n.i18nNext.t('home_slogan_subtitle')}</h2>
        <div style={{ height: 20 }} />
        <h3 className={styles.banner1H3}>{FI18n.i18nNext.t('home_slogan_descr')}</h3>
        <div style={{ height: 40 }} />
        <FComponentsLib.FRectBtn
          onClick={() => {
            self._czc?.push(['_trackEvent', '首页', '免费使用', '', 1]);
            window.location.href = FUtil.Tool.getUserIDByCookies() === -1
              ? FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon()
              : FUtil.Format.completeUrlByDomain('console');
            // window.location.href = FI18n.i18nNext.t('home_slogan_link');
          }}
          style={{ height: 60, fontSize: 22, padding: '0 50px', fontWeight: 400 }}
        >{FI18n.i18nNext.t('btn_getitforfree')}</FComponentsLib.FRectBtn>
      </div>
    </div>

    <Banner2 />

    <div className={styles.banner3}>
      <div style={{ height: 150 }} />
      <h1 className={styles.banner3H1}>{FI18n.i18nNext.t('home_features')}</h1>
      <div style={{ height: 20 }} />
      <h3 className={styles.banner3H2}>{FI18n.i18nNext.t('home_features_descr')}</h3>
      <div style={{ height: 150 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_1} alt={''} className={styles.banner3_Content_LeftImg} />
        <div />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>{FI18n.i18nNext.t('home_features_01')}</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>{FI18n.i18nNext.t('home_features_01_descr')}</div>
          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            style={{ height: 42, fontSize: 16 }}
            onClick={() => {
              self._czc?.push(['_trackEvent', '首页', '进一步了解', '', 1]);
              self.open(FI18n.i18nNext.t('btn_features_01_link'));
            }}
          >{FI18n.i18nNext.t('btn_learnmore')}</FComponentsLib.FRectBtn>
        </div>
      </div>

      <div style={{ height: 100 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_2} alt={''} className={styles.banner3_Content_RightImg} />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>{FI18n.i18nNext.t('home_features_02')}</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>{FI18n.i18nNext.t('home_features_02_descr')}</div>
          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            style={{ height: 42, fontSize: 16 }}
            onClick={() => {
              self._czc?.push(['_trackEvent', '首页', '进一步了解', '', 1]);
              self.open(FI18n.i18nNext.t('btn_features_02_link'));
            }}
          >{FI18n.i18nNext.t('btn_learnmore')}</FComponentsLib.FRectBtn>
        </div>
        <div />
      </div>

      <div style={{ height: 100 }} />

      <div className={styles.banner3_Content}>
        <img src={img_Banner3_3} alt={''} className={styles.banner3_Content_LeftImg} />
        <div />
        <div className={styles.banner3_Content_Display}>
          <div className={styles.banner3_Content_DisplayH1}>{FI18n.i18nNext.t('home_features_03')}</div>
          <div style={{ height: 30 }} />
          <div className={styles.banner3_Content_DisplayH2}>{FI18n.i18nNext.t('home_features_03_descr')}</div>
          <div style={{ height: 30 }} />
          <FComponentsLib.FRectBtn
            onClick={() => {
              self._czc?.push(['_trackEvent', '首页', '进一步了解', '', 1]);
              self.open(FI18n.i18nNext.t('btn_features_03_link'));
            }}
            style={{ height: 42, fontSize: 16 }}
          >{FI18n.i18nNext.t('btn_learnmore')}</FComponentsLib.FRectBtn>
        </div>
      </div>

      <div style={{ height: 150 }} />

    </div>
    <div className={styles.banner4}>
      <h1 className={styles.banner4H1}>{FI18n.i18nNext.t('home_cta')}</h1>
      <div style={{ height: 40 }} />
      <h3 className={styles.banner4H2}>{FI18n.i18nNext.t('home_cta_descr')}</h3>
      <div style={{ height: 40 }} />
      <FComponentsLib.FRectBtn
        style={{
          height: 60,
          fontSize: 22,
          padding: '0 50px',
          fontWeight: 400,
        }}
        onClick={() => {
          self._czc?.push(['_trackEvent', '首页', '免费使用', '', 1]);
          window.location.href = FUtil.Tool.getUserIDByCookies() === -1
            ? FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.logon()
            : FUtil.Format.completeUrlByDomain('console');
        }}
      >{FI18n.i18nNext.t('btn_getitforfree')}</FComponentsLib.FRectBtn>
    </div>

    <FComponentsLib.FPageFooter PopoverPatch={Popover} />

    <Ads />

    {/*<a className={styles.rewardSuspension}>*/}
    {/*  <img src={img_RewardSuspension} alt={''} />*/}
    {/*</a>*/}
  </div>);
}

export default HomePage;
