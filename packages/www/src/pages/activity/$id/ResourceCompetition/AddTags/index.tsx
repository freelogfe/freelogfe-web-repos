import * as React from 'react';
import styles from './index.less';
import img_tag_1 from '@/assets/activity/add-tag-1.gif';
import img_tag_2 from '@/assets/activity/add-tag-2.gif';
import img_tag_3 from '@/assets/activity/add-tag-3.gif';
import img_steps from '@/assets/activity/steps@x2.png';

interface AddTagsProps {

}

function AddTags({}: AddTagsProps) {
  return (<div className={styles.styles}>
    <div style={{ height: 70 }} />
    <div># 如何添加活动标签？#</div>
    <div style={{ height: 50 }} />

    <div style={{ height: 60 }} />

    <div style={{ height: 100 }} />
  </div>);
}

export default AddTags;
