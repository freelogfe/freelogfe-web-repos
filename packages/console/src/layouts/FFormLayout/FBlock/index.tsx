import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";

interface FBlockProps {
  children?: React.ReactNode | React.ReactNodeArray;
  title: string;
  dot?: boolean;
}

function FBlock({children, title, dot = false}: FBlockProps) {
  return (<div className={styles.styles}>
    <div className={styles.title}>
      <div className={styles.prefix}/>
      <div style={{width: 7}}/>
      <FTitleText type={'h4'} text={title}/>
      <div style={{width: 5}}/>
      {
        dot && (<i className={styles.dot}/>)
      }

    </div>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      {children}
    </div>
  </div>);
}

export default FBlock;
