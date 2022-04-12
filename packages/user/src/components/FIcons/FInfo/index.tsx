import * as React from 'react';
import styles from './index.less';
import sharedStyles from '../iconShared.less';
import {CSSProperties, ReactElement, ReactEventHandler, ReactPropTypes} from "react";

interface FInfoProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FInfo({className, style, ...props}: FInfoProps) {
  return (<i
    className={[styles.styles, sharedStyles, 'freelog', 'fl-icon-tishixinxi', className].join(' ')}
    style={style}
    {...props}
  />);

}

export default FInfo;
