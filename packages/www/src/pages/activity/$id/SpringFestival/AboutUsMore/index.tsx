import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import img_xiaohongshuAvatar from '@/assets/activity/SpringFestival/xiaohongshuAvatar.png';
import FComponentsLib from '@freelog/components-lib';
import img_weibaoAvatar from '@/assets/activity/SpringFestival/weibaoAvatar.png';
import img_QQChatQR from '@/assets/activity/SpringFestival/QQChatQR.jpg';
import img_weixinQR from '@/assets/activity/SpringFestival/weixinQR.jpg';


interface AboutUsMoreProps {

}

function AboutUsMore({}: AboutUsMoreProps) {
  return (<>

    <div className={styles.more}>
      <Space size={10} direction={'vertical'} align={'center'}>
        <div
          className={styles.moreItem}
          onClick={() => {
            self.open('https://www.xiaohongshu.com/user/profile/64c0d3810000000014039a75');
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: '#FFF',
              border: '1px solid #E3E3E3',
              borderRadius: '50%',
            }}
          ><img src={img_xiaohongshuAvatar} alt={''} style={{ width: '100%', height: '100%' }} /></div>
          <div style={{ height: 20 }} />
          <FComponentsLib.FContentText
            type={'negative'}
            text={'Freelog.Official'}
            style={{ maxWidth: 200 }}
            singleRow
          />
        </div>
        <FComponentsLib.FContentText
          type={'negative'}
          text={'小红书'}
          style={{ maxWidth: 200 }}
          singleRow
        />
      </Space>
      <Space size={10} direction={'vertical'} align={'center'}>
        <div
          className={styles.moreItem}
          onClick={() => {
            self.open('https://weibo.com/freelogofficial');
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: '#FFF',
              border: '1px solid #E3E3E3',
              borderRadius: '50%',
            }}
          ><img src={img_weibaoAvatar} alt={''} style={{ width: '100%', height: '100%' }} /></div>
          <div style={{ height: 20 }} />
          <FComponentsLib.FContentText
            type={'negative'}
            text={'Freelog_Official'}
            style={{ maxWidth: 200 }}
            singleRow
          />
        </div>
        <FComponentsLib.FContentText
          type={'negative'}
          text={'微博'}
          style={{ maxWidth: 200 }}
          singleRow
        />
      </Space>
      <Space size={10} direction={'vertical'} align={'center'}>
        <div className={styles.moreItem}>
          <img
            src={img_QQChatQR}
            style={{ width: 140, height: 140 }}
            alt={''}
          />
        </div>
        <FComponentsLib.FContentText
          type={'negative'}
          text={'官方活动答疑QQ群'}
          style={{ maxWidth: 200 }}
          singleRow
        />
      </Space>
      <Space size={10} direction={'vertical'} align={'center'}>
        <div className={styles.moreItem}>
          <img
            src={img_weixinQR}
            style={{ width: 140, height: 140 }}
            alt={''}
          />
        </div>
        <FComponentsLib.FContentText
          type={'negative'}
          text={'官方活动答疑微信'}
          style={{ maxWidth: 200 }}
          singleRow
        />
      </Space>
    </div>
  </>);
}

export default AboutUsMore;
