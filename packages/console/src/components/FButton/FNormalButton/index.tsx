import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../shared.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';

interface FNormalButtonProps extends ButtonProps {
  theme?: 'normal' | 'sub' | 'weaken' | 'delete1' | 'delete2';
}

export default function ({theme = 'normal', ...props}: FNormalButtonProps) {
  // if (theme === 'normal') {
  //   return (<Button
  //     type="primary"
  //     {...props}
  //   />);
  // }

  return (<Button
    className={sharedStyles[theme]}
    type="primary"
    {...props}
  />);

}
