import * as React from 'react';
import styles from './index.less';
import {DeleteOutlined} from '@ant-design/icons';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FCloudUploadProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FCloudUpload({className, ...props}: FCloudUploadProps) {
  return (<i className={['freelog', 'fl-icon-shangchuanfengmian', className].join(' ')} {...props} />);
}

//

export default FCloudUpload;
