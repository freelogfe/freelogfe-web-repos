import * as React from 'react';
import styles from './index.less';
import img_taskTitle from '@/assets/activity/SpringFestival/taskTitle@2x.png';
import FComponentsLib from '@freelog/components-lib';
import img_goldCoin from '@/assets/activity/SpringFestival/goldCoin@2x.png';
import Steps21 from '@/pages/activity/$id/SpringFestival/Steps21';
import sharedStyles from '@/pages/activity/$id/SpringFestival/shared.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface FighterRegistrationProps {

}

function FighterRegistration({}: FighterRegistrationProps) {
  return (<div className={styles.registration}>
    {/*<div style={{ height: 45 }} />*/}
    <img src={img_taskTitle} style={{ width: 520, opacity: .95 }} alt={''} />
    <div className={styles.Steps}>
      <div>
        {/*<img src={img_goldCoin} style={{ width: 65 }} />*/}
        <FComponentsLib.FIcons.FCheck style={{ fontSize: 64, opacity: 1 }} />
      </div>
      <div>
        <img src={img_goldCoin} style={{ width: 65, opacity: 1 }} alt={''} />
      </div>
      <div>
        <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
      </div>
      <div>
        <img src={img_goldCoin} style={{ width: 65, opacity: .3 }} alt={''} />
      </div>
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.Steps}>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'成功参与活动'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'瓜分888元'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'再瓜分1888元'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'再瓜分2888元'} />
      </div>
    </div>
    <div style={{ height: 15 }} />
    <div>
      <Steps21 step={12} />
    </div>
    <div style={{ height: 15 }} />
    <div className={styles.Steps}>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1 天'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/7 天'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/14 天'} />
      </div>
      <div>
        <FComponentsLib.FContentText type={'normal'} text={'打卡天数 1/21 天'} />
      </div>
    </div>
    <div style={{ height: 70 }} />
    <FComponentsLib.FTitleText type={'h1'} text={'今日打卡任务'} />
    <div style={{ height: 20 }} />
    <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
    <div className={styles.taskItem}>
      <div>
        <FComponentsLib.FTitleText type={'h3'} text={'发布一个原创资源（1/1）'} />
        <div style={{ height: 10 }} />
        <FComponentsLib.FContentText type={'additional2'} text={'别忘了为资源添加“新春召集令，freelog创作激励计划启动！”活动标签哦！'} />
      </div>
      <a
        className={[sharedStyles.button, sharedStyles.small, sharedStyles.disabled].join(' ')}
        onClick={() => {
          self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.resourceCreatorEntry());
        }}
      >已完成</a>
    </div>
    <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
    <div className={styles.taskItem}>
      <FComponentsLib.FTitleText type={'h3'} text={'签约一个资源到节点（0/1）'} />
      <a
        className={[sharedStyles.button, sharedStyles.small].join(' ')}
        onClick={async () => {
          const { data }: {
            data: {
              totalItem: number;
            }
          } = await FServiceAPI.Node.nodes({});
          // console.log(data, 'DDDDDDDD');
          if (data.totalItem > 0) {
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.market());
          } else {
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeCreator());
          }
        }}
      >去完成</a>
    </div>
    <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
    <div className={styles.taskItem}>
      <FComponentsLib.FTitleText type={'h3'} text={'分享一次节点或展品（0/1）'} />
      <a
        className={[sharedStyles.button, sharedStyles.small].join(' ')}
        onClick={async () => {
          const { data }: {
            data: {
              totalItem: number;
              dataList: {
                nodeId: number;
              }[]
            }
          } = await FServiceAPI.Node.nodes({});
          if (data.totalItem > 0) {
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeManagement({
              nodeID: data.dataList[0].nodeId,
            }));
          } else {
            self.open(FUtil.Format.completeUrlByDomain('console') + FUtil.LinkTo.nodeCreator());
          }
        }}
      >去完成</a>
    </div>
    <div style={{ borderBottom: '1px solid rgba(0,0,0,.1)', width: 760 }} />
    <div style={{ height: 70 }} />
    <FComponentsLib.FTitleText type={'h1'} text={'重要通知'} />
    <div style={{ height: 20 }} />
    <FComponentsLib.FTitleText
      type={'h3'}
      text={'成功参与此次新春活动的用户，将有机会角逐首期编辑精选活动的大奖，优质资源作者或节点运营商将获得丰厚奖励，期待您的优质内容哦！'}
      style={{ width: 760, textAlign: 'center' }}
    />
    <div style={{ height: 20 }} />
    <FComponentsLib.FTextBtn
      type={'primary'}
      onClick={() => {

      }}
    >前往查看</FComponentsLib.FTextBtn>
    <div style={{ height: 60 }} />
  </div>);
}

export default FighterRegistration;
