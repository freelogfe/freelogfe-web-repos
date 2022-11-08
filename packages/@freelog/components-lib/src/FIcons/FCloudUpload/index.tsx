import * as React from 'react';
// import styles from './index.less';

interface FCloudUploadProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FCloudUpload({className, ...props}: FCloudUploadProps) {
  return (<i className={['freelog', 'fl-icon-shangchuanfengmian', className].join(' ')} {...props} />);
}

export default FCloudUpload;
