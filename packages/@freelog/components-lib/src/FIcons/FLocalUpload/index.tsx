import * as React from 'react';
import styles from './index.less';

interface FLocalUploadProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FLocalUpload({className, style, ...props}: FLocalUploadProps) {
  return (<i
    className={[styles.styles, 'freelog', 'fl-icon-bendishangchuan', className].join(' ')}
    style={style}
    {...props}
  />);

}

export default FLocalUpload;
