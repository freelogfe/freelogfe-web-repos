import * as React from 'react';
import styles from './index.less';

interface FieldProps {
  dot?: boolean;
  title: string;
  children?: React.ReactNode;
  className?: string;
}

function Field({className, dot = false, title, children}: FieldProps) {
  return (<div className={styles.Field + ' ' + (className || '')}>
      <div className={styles.FieldTitle}>
        {dot && <i className={styles.dot}/>}
        <span>{title}</span>
      </div>
      <div style={{height: 5}}/>
      {children}
    </div>
  );
}

export default Field;
