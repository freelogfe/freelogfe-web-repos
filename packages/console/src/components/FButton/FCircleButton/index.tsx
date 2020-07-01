import * as React from 'react';
import styles from './index.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

interface FCircleButtonProps extends ButtonProps {
  theme?: 'create1' | 'create2' | 'add' | 'delete';
}

export default function ({theme = 'create1', ...props}: FCircleButtonProps) {
  if (theme === 'create1') {
    return (<Button className={styles.Button} {...props} type="primary" shape="circle" icon={<PlusOutlined/>}/>);
  }
  if (theme === 'create2') {
    return (<Button className={styles.Button} {...props} type="primary" shape="circle" icon={<PlusOutlined/>}/>)
  }
  if (theme === 'add') {
    return (<Button className={styles.Button} {...props} type="primary" shape="circle" icon={<PlusOutlined/>}/>)
  }
  return (<Button className={styles.Button} {...props} type="primary" shape="circle" icon={<PlusOutlined/>}/>);
}
