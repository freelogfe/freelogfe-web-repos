import * as React from 'react';
import {Alert, message} from 'antd';
import styles from './index.less';

function fMessage(content: React.ReactNode, type: 'success' | 'warning' | 'error' = 'success') {
  message.info({
    content: (<Alert className={styles[type] + ' ' + styles.alert} message={content} type={type}/>),
    className: styles.message,
    // duration: ,
    icon: <div/>,
  });
}

export default fMessage;
