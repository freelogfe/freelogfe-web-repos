import * as React from 'react';
import styles from './index.less';
import {FTitleText} from "@/components/FText";

interface FBlockProps {
  children?: React.ReactNode | React.ReactNodeArray;
  title: string;
  dot?: boolean;
  subtitle?: React.ReactNode;
}

function FBlock({children, title, dot = false, subtitle}: FBlockProps) {
  return (<div className={styles.styles}>
    <div className={styles.title}>
      <div className={styles.prefix}/>
      <div style={{width: 5}}/>
      <FTitleText type={'h4'} text={title}/>
      {
        dot && (<>
          <div style={{width: 5}}/>
          <i className={styles.dot}/>
        </>)
      }
      {
        subtitle && (<>
          <div style={{width: 10}}/>
          {subtitle}
        </>)
      }

    </div>
    <div style={{height: 20}}/>
    <div className={styles.content}>
      {children}
    </div>
  </div>);
}

export default FBlock;
