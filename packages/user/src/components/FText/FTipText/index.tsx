import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";
import shared from "@/components/FText/shared.less";

interface FTipTextProps {
  type?: 'first' | 'second' | 'third';
  text: string | number;
  className?: string;
  style?: CSSProperties;
  singleRow?: boolean;
}

function FTipText({type = 'first', text, className = '', style, singleRow}: FTipTextProps) {
  const singleRowClassName = singleRow ? shared.singleRow : '';
  return (<div
    className={[singleRowClassName, styles[type], styles.text, className].join(' ')}
    style={style}
  >{text}</div>);
}

export default FTipText;
