import * as React from 'react';
import styles from './index.less';
import { Radio, RadioProps } from 'antd';
import { RadioButtonProps } from 'antd/lib/radio/radioButton';

interface FRadioProps extends RadioProps {
  className?: string;
  // children?: React.ReactNode;
}

function FRadio({ className, ...props }: FRadioProps) {
  return (<Radio
    className={[className, styles.styles].join(' ')}
    {...props}
  />);
}

export default FRadio;
