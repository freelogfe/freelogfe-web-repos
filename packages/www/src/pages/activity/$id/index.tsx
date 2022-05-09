import * as React from 'react';
import styles from './index.less';
import FLoadingTip from '@/components/FLoadingTip';
import { Space } from 'antd';
import { FRectBtn, FTextBtn } from '@/components/FButton';
import img_Cartoon1 from '@/assets/activity/cartoon1@2x.png';
import img_Cartoon2 from '@/assets/activity/cartoon2@2x.png';
import img_Cartoon3 from '@/assets/activity/cartoon3@2x.png';
import img_Cartoon4 from '@/assets/activity/cartoon4@2x.png';
import img_Novel1 from '@/assets/activity/novel1@2x.png';
import img_Novel2 from '@/assets/activity/novel2@2x.png';
import img_Novel3 from '@/assets/activity/novel3@2x.png';
import img_Novel4 from '@/assets/activity/novel4@2x.png';
import { FTitleText } from '@/components/FText';

interface ActivityProps {

}

interface ActivityStates {
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
  display_Cartoon: [
    {
      id: 'cartoon1',
      img: img_Cartoon1,
      description: 'ワンパンマン_ONE PUNCH-MAN',
    },
    {
      id: 'cartoon2',
      img: img_Cartoon2,
      description: '刺客伍六七',
    },
    {
      id: 'cartoon3',
      img: img_Cartoon3,
      description: '国王排名 王様ランキング',
    },
    {
      id: 'cartoon4',
      img: img_Cartoon4,
      description: '鬼滅の刃（鬼灭之刃）',
    },
  ],
  display_Cartoon_Css: [...css1],
  display_Novel: [
    { id: 'novel1', img: img_Novel1, description: '五极异域' },
    { id: 'novel2', img: img_Novel2, description: '你躲在时间门外' },
    { id: 'novel3', img: img_Novel3, description: '渡心劫' },
    { id: 'novel4', img: img_Novel4, description: '盗墓笔记' },
  ],
  display_Novel_Css: [...css2],
};

function Activity({}: ActivityProps) {

  const [display_Cartoon, set_Display_Cartoon] = React.useState<ActivityStates['display_Cartoon']>(initStates['display_Cartoon']);
  const [display_Cartoon_Css, set_Display_Cartoon_Css] = React.useState<ActivityStates['display_Cartoon_Css']>(initStates['display_Cartoon_Css']);
  const [display_Novel, set_Display_Novel] = React.useState<ActivityStates['display_Novel']>(initStates['display_Novel']);
  const [display_Novel_Css, set_Display_Novel_Css] = React.useState<ActivityStates['display_Novel_Css']>(initStates['display_Novel_Css']);

  function onClick_Display_Cartoon(i: number) {
    let index: number = i;
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
    const result: any[] = Array(4).fill(null);
    for (let j = 0; j < 4; j++) {
      result[index % 4] = css2[j];
      index++;
    }
    // console.log(result, 'result');
    set_Display_Novel_Css(result);
  }


  return (<div>
    {/*<FLoadingTip height={window.innerHeight - 170} />*/}
    <div className={styles.banner1}>
      <div className={styles.banner1Content}>
        <div style={{ height: 45 }} />
        <div className={styles.banner1Content_Title}>
          <span>熬秃头创作却收益甚微的漫画、小说家们，快来Freelog实现资源发行和授权变现自由吧！</span>
          <br />
          <span>每一个笔触都值得被尊重、每一个文字都值得全额的回报~</span>
        </div>
        <div style={{ height: 40 }} />
        <div className={styles.banner1Content_Times}>
          <div className={styles.banner1Content_Time1}>
            <div className={styles.title}>活动开始</div>
            <div style={{ height: 4 }} />
            <div className={styles.time}>2022·02·10</div>
          </div>
          <div className={styles.banner1Content_Time2}>
            <div className={styles.title}>活动结束</div>
            <div style={{ height: 4 }} />
            <div className={styles.time}>2022·02·10</div>
          </div>
          <div className={styles.banner1Content_Time3}>
            <div className={styles.title}>获奖公示</div>
            <div style={{ height: 4 }} />
            <div className={styles.time}>2022·02·10</div>
          </div>
        </div>
      </div>
    </div>
    <div style={{ height: 266 }} />
    <div className={styles.participations}>
      <div className={styles.participation}>
        <div className={styles.participation_Text}>
          <div className={styles.participation_Text1}>漫画赛道参与方式</div>
          <div style={{ height: 10 }} />
          <div className={styles.participation_Text2}>校园、热血、搞笑、恋爱等类型主题不限，发布现有作品即可参赛~</div>
          <div style={{ height: 50 }} />
          <div className={styles.participation_Text3}>1.创建发布漫画资源，并添加 #内测集结！漫画家召集令# 活动标签；</div>
          <div style={{ height: 20 }} />
          <div className={styles.participation_Text3}>2.将参赛资源签约为展品，展品按照被签约次数参与排名。</div>
          <div style={{ height: 50 }} />
          <Space size={30}>
            <FRectBtn type='primary' style={{ height: 50, padding: '0 50px' }}>立即参赛</FRectBtn>
            <FTextBtn type='primary'>如何参赛？</FTextBtn>
          </Space>
        </div>
        <div className={styles.participation_Display}>
          <div className={styles.participation_Display_Covers}>
            {
              display_Cartoon.map((d, i) => {
                return (<a
                  className={styles.participation_Display_Cover}
                  style={{ ...display_Cartoon_Css[i] }}
                  key={d.id}
                  onClick={() => {
                    onClick_Display_Cartoon(i);
                  }}
                >
                  <img src={d.img} alt={''} />
                  <div style={{ height: 10 }} />
                  <FTitleText text={d.description} type='h3' singleRow />
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
        <div className={styles.participation_Display}>
          <div className={styles.participation_Display_Covers}>
            {
              display_Novel.map((d, i) => {
                return (<a
                  className={styles.participation_Display_Cover}
                  style={{ ...display_Novel_Css[i] }}
                  key={d.id}
                  onClick={() => {
                    onClick_Display_Novel(i);
                  }}
                >
                  <img src={d.img} alt={''} />
                  <div style={{ height: 10 }} />
                  <FTitleText text={d.description} type='h3' singleRow />
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
          <div className={styles.participation_Text3}>1.创建发布小说资源，并添加 #内测集结！小说家召集令# 活动标签；</div>
          <div style={{ height: 20 }} />
          <div className={styles.participation_Text3}>2.将参赛资源签约为展品，展品按照被签约次数参与排名。</div>
          <div style={{ height: 50 }} />
          <Space size={30}>
            <FRectBtn type='primary' style={{ height: 50, padding: '0 50px' }}>立即参赛</FRectBtn>
            <FTextBtn type='primary'>如何参赛？</FTextBtn>
          </Space>
        </div>
      </div>
    </div>
  </div>);
}

export default Activity;
