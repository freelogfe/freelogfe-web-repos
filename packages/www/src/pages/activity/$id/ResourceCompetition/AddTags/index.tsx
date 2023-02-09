import * as React from 'react';
import styles from './index.less';
import img_tag_1 from '@/assets/activity/add-tag-1.gif';
import img_tag_2 from '@/assets/activity/add-tag-2.gif';
import img_tag_3 from '@/assets/activity/add-tag-3.gif';
import img_steps from '@/assets/activity/steps@x2.png';
import FFooter from '@/components/Footer';

interface AddTagsProps {

}

function AddTags({}: AddTagsProps) {
  return (<div className={styles.styles}>
    <div style={{ height: 70 }} />
    <div className={styles.title}># 如何添加活动标签？#</div>
    <div style={{ height: 50 }} />
    <img className={styles.steps} src={img_steps} alt={''} />
    <div style={{ height: 60 }} />
    <div className={styles.cards}>
      <div className={styles.card} style={{ backgroundColor: '#E5F6EF' }}>
        <div className={styles.cardTitle} style={{ color: '#42C28C' }}>
          <div>点击</div>
          <div>资源管理」-「我的资源」</div>
          <div>进入我的资源页</div>
        </div>
        <img
          src={img_tag_1}
          alt={''}
          className={styles.cardImg}
          style={{ boxShadow: '0 0 10px 0 rgba(66, 194, 140, 0.25)' }}
        />
      </div>

      <div className={styles.card} style={{ backgroundColor: '#EDF6FF' }}>
        <div className={styles.cardTitle} style={{ color: '#2784FF' }}>
          <div>点击</div>
          <div>资源卡片上「编辑」按钮</div>
          <div>进入编辑资</div>
        </div>
        <img
          src={img_tag_2}
          alt={''}
          className={styles.cardImg}
          style={{ boxShadow: '0 0 10px 0 rgba(39, 132, 255, 0.25)' }}
        />
      </div>

      <div className={styles.card} style={{ backgroundColor: '#FBF5EA' }}>
        <div className={styles.cardTitle} style={{ color: '#E9A923' }}>
          <div>在资源标签框中添加</div>
          <div>相应的活动标签即可</div>
          <div style={{ height: 16 }} />
          <a className={styles.cardTitleSub}>#内测集结，漫画家召集令#</a>
          <div style={{ height: 12 }} />
          <a className={styles.cardTitleSub}>#内测集结，小说家召集令#</a>
        </div>
        <img
          src={img_tag_3}
          alt={''}
          className={styles.cardImg}
          style={{ boxShadow: '0 0 10px 0 rgba(233,169,35,0.25)' }}
        />
      </div>
    </div>
    <div style={{ height: 100 }} />
  </div>);
}

export default AddTags;
