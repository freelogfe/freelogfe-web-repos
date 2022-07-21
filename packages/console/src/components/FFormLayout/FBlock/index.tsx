import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface FBlockProps {
  children?: React.ReactNode | React.ReactNodeArray;
  title: string;
  dot?: boolean;
  asterisk?: boolean;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
}

function FBlock({ children, title, dot = false, asterisk = false, subtitle, extra }: FBlockProps) {
  return (<div className={styles.styles}>
    <div className={styles.title}>
      <div>
        <div className={styles.prefix} />
        <div style={{ width: 5 }} />
        <FComponentsLib.FTitleText type='h3' text={title} />
        {
          dot && (<>
            <div style={{ width: 5 }} />
            <i className={styles.dot} />
          </>)
        }
        {
          asterisk && (<>
            <div style={{ width: 5 }} />
            <i style={{ color: '#EE4040' }}>*</i>
          </>)
        }
        {
          subtitle && (<>
            <div style={{ width: 10 }} />
            {subtitle}
          </>)
        }
      </div>

      <div>
        {extra}
      </div>

    </div>
    <div style={{ height: 20 }} />
    <div className={styles.content}>
      {children}
    </div>
  </div>);
}

export default FBlock;
