import * as React from 'react';
import styles from './index.less';
import {ButtonProps} from 'antd/lib/button/button';
import {Button} from 'antd';

interface FNormalButtonProps extends ButtonProps {
  theme?: 'normal' | 'sub' | 'weaken' | 'delete1' | 'delete2';
}

// TODO:
export default function ({theme = 'normal', ...props}: FNormalButtonProps) {
  if (theme === 'normal') {
    return (<Button
      type="primary"
      {...props}
    />);
  }

  if (theme === 'sub') {
    return (<Button
      {...props}
    />);
  }

  if (theme === 'weaken') {
    return (<Button
      {...props}
    />);
  }

  if (theme === 'delete1') {
    return (<Button
      {...props}
    />);
  }

  return (<Button
    type="primary"
    {...props}
  />);

}
