import * as React from 'react';
import styles from './index.less';
import {FContentText} from "@/components/FText";

interface TypesCaptionProps {

}

function TypesCaption({}: TypesCaptionProps) {
  return (<div className={styles.popoverTitleTip}>
    <div style={{width: 5}}/>
    <FContentText text={'('} type="additional2"/>
    <div style={{width: 5}}/>
    <i className={styles.exhibitDot}/>
    <div style={{width: 5}}/>
    <FContentText text={'展品'} type="additional2"/>
    <div style={{width: 15}}/>
    <i className={styles.resourceDot}/>
    <div style={{width: 5}}/>
    <FContentText text={'资源'} type="additional2"/>
    <div style={{width: 15}}/>
    <i className={styles.objectDot}/>
    <div style={{width: 5}}/>
    <FContentText text={'对象'} type="additional2"/>
    <div style={{width: 5}}/>
    <FContentText text={')'} type="additional2"/>
  </div>);
}

export default TypesCaption;
