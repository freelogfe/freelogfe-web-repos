import * as React from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { PasswordProps } from 'antd/lib/input';

interface FPasswordInputProps extends PasswordProps {

}

function FPasswordInput({ className, ...props }: FPasswordInputProps) {
  return (<Input.Password
    {...props}
    className={[className, styles.styles].join(' ')}
  />);
}

export default FPasswordInput;
