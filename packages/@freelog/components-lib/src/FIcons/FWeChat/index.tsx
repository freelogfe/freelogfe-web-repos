import * as React from 'react';
// import styles from './index.less';
import {CSSProperties} from "react";

interface FWeChatProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FWeChat({className, ...props}: FWeChatProps) {
  return (<i className={['freelog', 'fl-icon-weixin', className].join(' ')} {...props} />);
}

export default FWeChat;
