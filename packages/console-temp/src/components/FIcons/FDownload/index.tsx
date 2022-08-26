import * as React from 'react';
import styles from './index.less';
import {EditOutlined} from '@ant-design/icons';
import {CSSProperties} from "react";

interface FDownloadProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FDownload({...props}: FDownloadProps) {
  return (<i className="freelog fl-icon-xiazai1" {...props} />);
}

export default FDownload;
