import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface TypesCaptionProps {

}

function TypesCaption({}: TypesCaptionProps) {
  return (<div className={styles.popoverTitleTip}>
    <div style={{width: 5}}/>
    <FComponentsLib.FContentText text={'('} type="additional2"/>
    <div style={{width: 5}}/>
    <i className={styles.exhibitDot}/>
    <div style={{width: 5}}/>
    <FComponentsLib.FContentText text={'展品'} type="additional2"/>
    <div style={{width: 15}}/>
    <i className={styles.resourceDot}/>
    <div style={{width: 5}}/>
    <FComponentsLib.FContentText text={'资源'} type="additional2"/>
    <div style={{width: 15}}/>
    <i className={styles.objectDot}/>
    <div style={{width: 5}}/>
    <FComponentsLib.FContentText text={'对象'} type="additional2"/>
    <div style={{width: 5}}/>
    <FComponentsLib.FContentText text={')'} type="additional2"/>
  </div>);
}

export default TypesCaption;
