import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import {FTitleText, FContentText} from '@/components/FText';
import {Progress} from 'antd';

export default function () {
  return (<div className={styles.styles}>
    <div className={styles.card}>
      <img src={img} className={styles.img}/>
      <div style={{width: 20}}/>
      <div className="">
        <FTitleText type="h4" text={'图片文件001'}/>
        <div style={{height: 18}}/>
        <div className={styles.info}>
          {/*<FContentText type="additional1" text={'10 M'}/>*/}
          <div style={{display: "flex", flexShrink: 0}}>10 M</div>
          <div style={{display: "flex", flexShrink: 0, width: 30}}/>
          {false && <FContentText className={styles.infoSize} type="additional1" text={'存储空间/xxxbucktt'}/>}
          {true && <FContentText className={styles.infoSize} type="additional1" text={'本地上传'}/>}
          {false && (<>
            <span style={{paddingRight: 10}}>45%</span>
            <Progress
              className={styles.Progress}
              width={100}
              showInfo={false}
              percent={30}
              size="small"
              trailColor="#EBEBEB"
            />
          </>)}
        </div>
      </div>
    </div>
    <div style={{width: 10}}/>
    <a className={styles.delete}>取消上传</a>
  </div>)
}
