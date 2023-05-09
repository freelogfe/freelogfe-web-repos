import * as React from 'react';
import styles from './index.less';

interface FInfoProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FInfo({className, style, ...props}: FInfoProps) {
  return (<i
    className={[styles.styles, 'freelog', 'fl-icon-tishixinxi', className].join(' ')}
    style={style}
    {...props}
  />);

}

export default FInfo;
