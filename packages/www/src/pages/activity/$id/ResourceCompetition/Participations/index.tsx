import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import img_Cartoon1 from '@/assets/activity/cartoon1.png';
import img_Cartoon2 from '@/assets/activity/cartoon2.png';
import img_Cartoon3 from '@/assets/activity/cartoon3.png';
import img_Cartoon4 from '@/assets/activity/cartoon4.png';
import img_Novel1 from '@/assets/activity/novel1.jpg';
import img_Novel2 from '@/assets/activity/novel2.jpg';
import img_Novel3 from '@/assets/activity/novel3.jpg';
import img_Novel4 from '@/assets/activity/novel4.jpg';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ActivityDetailsPageModelState, ConnectState } from '@/models/connect';

interface ParticipationsProps {
  activityDetailsPage: ActivityDetailsPageModelState;

  onClickRuleBtn?(): void;
}

interface ActivityStates {
  delay: undefined | number;
  display_Cartoon: {
    id: string;
    img: string;
    description: string;
  }[];
  display_Cartoon_Css: {
    left: number;
    transform: string;
    zIndex: number;
  }[];
  display_Cartoon_Index: number;
  display_Novel: {
    id: string;
    img: string;
    description: string;
  }[];
  display_Novel_Css: {
    right: number;
    transform: string;
    zIndex: number;
  }[];
  display_Novel_Index: number;
}

const css1: ActivityStates['display_Cartoon_Css'] = [
  {
    left: 0,
    transform: 'scale(1)',
    zIndex: 503,
  },
  {
    left: 70,
    transform: 'scale(.94)',
    zIndex: 502,
  },
  {
    left: 140,
    transform: 'scale(.88)',
    zIndex: 501,
  },
  {
    left: 210,
    transform: 'scale(.82)',
    zIndex: 500,
  },
];

const css2: ActivityStates['display_Novel_Css'] = [
  {
    right: 0,
    transform: 'scale(1)',
    zIndex: 503,
  },
  {
    right: 70,
    transform: 'scale(.94)',
    zIndex: 502,
  },
  {
    right: 140,
    transform: 'scale(.88)',
    zIndex: 501,
  },
  {
    right: 210,
    transform: 'scale(.82)',
    zIndex: 500,
  },
];

const initStates: ActivityStates = {
  delay: 5000,
  display_Cartoon: [
    {
      id: 'cartoon1',
      img: img_Cartoon1,
      description: '宅家一天',
    },
    {
      id: 'cartoon2',
      img: img_Cartoon2,
      description: '病毒退散',
    },
    {
      id: 'cartoon3',
      img: img_Cartoon3,
      description: '活着真好',
    },
    {
      id: 'cartoon4',
      img: img_Cartoon4,
      description: '新的世界',
    },
  ],
  display_Cartoon_Css: [...css1],
  display_Cartoon_Index: 0,
  display_Novel: [
    { id: 'novel1', img: img_Novel1, description: '红楼梦' },
    { id: 'novel2', img: img_Novel2, description: '三国演义' },
    { id: 'novel3', img: img_Novel3, description: '水浒传' },
    { id: 'novel4', img: img_Novel4, description: '西游记' },
  ],
  display_Novel_Css: [...css2],
  display_Novel_Index: 0,
};

function Participations({ activityDetailsPage, onClickRuleBtn }: ParticipationsProps) {

  const [delay, set_Delay] = React.useState<ActivityStates['delay']>(initStates['delay']);

  const [display_Cartoon, set_Display_Cartoon] = React.useState<ActivityStates['display_Cartoon']>(initStates['display_Cartoon']);
  const [display_Cartoon_Css, set_Display_Cartoon_Css] = React.useState<ActivityStates['display_Cartoon_Css']>(initStates['display_Cartoon_Css']);
  const [display_Cartoon_Index, set_Display_Cartoon_Index] = React.useState<ActivityStates['display_Cartoon_Index']>(initStates['display_Cartoon_Index']);

  const [display_Novel, set_Display_Novel] = React.useState<ActivityStates['display_Novel']>(initStates['display_Novel']);
  const [display_Novel_Css, set_Display_Novel_Css] = React.useState<ActivityStates['display_Novel_Css']>(initStates['display_Novel_Css']);
  const [display_Novel_Index, set_Display_Novel_Index] = React.useState<ActivityStates['display_Novel_Index']>(initStates['display_Novel_Index']);

  AHooks.useInterval(() => {
    onClick_Display_Cartoon((display_Cartoon_Index + 1) % 4);
  }, delay);

  AHooks.useInterval(() => {
    onClick_Display_Novel((display_Novel_Index + 1) % 4);
  }, delay);

  function onClick_Display_Cartoon(i: number) {
    let index: number = i;
    set_Display_Cartoon_Index(index);
    const result: any[] = Array(4).fill(null);
    for (let j = 0; j < 4; j++) {
      result[index % 4] = css1[j];
      index++;
    }
    // console.log(result, 'result');
    set_Display_Cartoon_Css(result);
  }

  function onClick_Display_Novel(i: number) {
    let index: number = i;
    set_Display_Novel_Index(index);
    const result: any[] = Array(4).fill(null);
    for (let j = 0; j < 4; j++) {
      result[index % 4] = css2[j];
      index++;
    }
    // console.log(result, 'result');
    set_Display_Novel_Css(result);
  }

  return (<div className={styles.participations}>
    <div className={styles.participation}>
      <div className={styles.participation_Text}>
        <div className={styles.participation_Text1}>漫画赛道参与方式</div>
        <div style={{ height: 10 }} />
        <div className={styles.participation_Text2}>校园、热血、搞笑、恋爱等类型主题不限，发布现有作品即可参赛~</div>
        <div style={{ height: 50 }} />
        <div className={styles.participation_Text3}>1.创建发布漫画资源，并添加 <FComponentsLib.FCopyToClipboard
          text={'内测集结！漫画家召集令'}
          title={'点击复制标签'}
        ><span
          style={{ cursor: 'pointer', color: '#E9A923' }}>#内测集结！漫画家召集令#</span></FComponentsLib.FCopyToClipboard> 活动标签；
        </div>
        <div style={{ height: 20 }} />
        {/*<div className={styles.participation_Text3}>2.将参赛资源签约为展品，展品按照被签约次数参与排名。</div>*/}
        <div className={styles.participation_Text3}>2.参赛资源由Freelog平台评审排名。</div>
        <div style={{ height: 50 }} />
        <Space size={30}>
          <FComponentsLib.FRectBtn
            type='primary'
            style={{ height: 50, padding: '0 50px' }}
            disabled={activityDetailsPage.timeValidity !== 'Validity'}
            onClick={() => {
              self._czc?.push(['_trackEvent', '资源创作大赛页', '立即参赛', '', 1]);
              self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreator());
            }}
          >{activityDetailsPage.timeValidity === 'NotStart'
            ? '即将开始'
            : activityDetailsPage.timeValidity === 'Finished'
              ? ' 已经结束'
              : '立即参赛'}</FComponentsLib.FRectBtn>
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              self._czc?.push(['_trackEvent', '资源创作大赛页', '如何参赛', '', 1]);
              onClickRuleBtn && onClickRuleBtn();
            }}
          >如何参赛？</FComponentsLib.FTextBtn>
        </Space>
      </div>
      <div
        onMouseEnter={() => {
          set_Delay(undefined);
        }}
        onMouseLeave={() => {
          set_Delay(2000);
        }}
        className={styles.participation_Display}
      >
        <div className={styles.participation_Display_Covers}>
          {
            display_Cartoon.map((d, i) => {
              return (<a
                className={styles.participation_Display_Cover}
                style={{ ...display_Cartoon_Css[i] }}
                key={d.id}
                // onClick={() => {
                //   // onClick_Display_Cartoon(i);
                // }}
                href={FI18n.i18nNext.t('flnode_comics_addr')}
                target={'_blank'}
              >
                <img src={d.img} alt={''} />
                <div style={{ height: 10 }} />
                <FComponentsLib.FTitleText text={d.description} type='h3' singleRow />
              </a>);
            })
          }
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.participation_Display_Description}>漫画展品示例</div>
      </div>
    </div>
    <div style={{ height: 100 }} />
    <div className={styles.participation}>
      <div
        onMouseEnter={() => {
          set_Delay(undefined);
        }}
        onMouseLeave={() => {
          set_Delay(2000);
        }}
        className={styles.participation_Display}
      >
        <div className={styles.participation_Display_Covers}>
          {
            display_Novel.map((d, i) => {
              return (<a
                className={styles.participation_Display_Cover}
                style={{ ...display_Novel_Css[i] }}
                key={d.id}
                // onClick={() => {
                //   // onClick_Display_Novel(i);
                // }}
                href={FI18n.i18nNext.t('flnode_reading_addr')}
                target={'_blank'}
              >
                <img src={d.img} alt={''} />
                <div style={{ height: 10 }} />
                <FComponentsLib.FTitleText text={d.description} type='h3' singleRow />
              </a>);
            })
          }
        </div>
        <div style={{ height: 30 }} />
        <div className={styles.participation_Display_Description}>小说展品示例</div>
      </div>
      <div className={styles.participation_Text}>
        <div className={styles.participation_Text1}>小说赛道参与方式</div>
        <div style={{ height: 10 }} />
        <div className={styles.participation_Text2}>同人、言情、玄幻、耽美等类型主题不限，发布现有作品即可参赛~</div>
        <div style={{ height: 50 }} />
        <div className={styles.participation_Text3}>1.创建发布小说资源，并添加 <FComponentsLib.FCopyToClipboard
          text={'内测集结！小说家召集令'}
          title={'点击复制标签'}
        ><span
          style={{ cursor: 'pointer', color: '#E9A923' }}>#内测集结！小说家召集令#</span></FComponentsLib.FCopyToClipboard> 活动标签；
        </div>
        <div style={{ height: 20 }} />
        {/*<div className={styles.participation_Text3}>2.将参赛资源签约为展品，展品按照被签约次数参与排名。</div>*/}
        <div className={styles.participation_Text3}>2.参赛资源由Freelog平台评审排名。</div>
        <div style={{ height: 50 }} />
        <Space size={30}>
          <FComponentsLib.FRectBtn
            type='primary'
            style={{ height: 50, padding: '0 50px' }}
            disabled={activityDetailsPage.timeValidity !== 'Validity'}
            onClick={() => {
              self._czc?.push(['_trackEvent', '资源创作大赛页', '立即参赛', '', 1]);
              window.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreator());
            }}
          >{activityDetailsPage.timeValidity === 'NotStart'
            ? '即将开始'
            : activityDetailsPage.timeValidity === 'Finished'
              ? ' 已经结束'
              : '立即参赛'}</FComponentsLib.FRectBtn>
          <FComponentsLib.FTextBtn
            type='primary'
            onClick={() => {
              self._czc?.push(['_trackEvent', '资源创作大赛页', '如何参赛', '', 1]);
              onClickRuleBtn && onClickRuleBtn();
            }}
          >如何参赛？</FComponentsLib.FTextBtn>
        </Space>
      </div>
    </div>
  </div>);
}

export default connect(({ activityDetailsPage }: ConnectState) => ({
  activityDetailsPage,
}))(Participations);
