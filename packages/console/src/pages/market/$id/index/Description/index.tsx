import * as React from "react";
import {FTitleText} from '@/components/FText';
import styles from './index.less';
import {FTextButton} from '@/components/FButton';
import {FDown} from "@/components/FIcons";

function Description() {
  return (<div>
    <FTitleText text={'版本描述'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div className={styles.content}>

    </div>
    <div className={styles.mask}/>
    <div className={styles.footer}>
      <FTextButton theme="primary">展开查看全部 <FDown/></FTextButton>
    </div>
  </div>)
}

export default Description;
