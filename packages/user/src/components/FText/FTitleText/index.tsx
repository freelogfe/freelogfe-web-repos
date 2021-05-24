import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';
import {CSSProperties} from "react";

interface FTitleProps {
  text?: string;
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'popup' | 'table';
  singleRow?: boolean;
  children?: React.ReactNode | React.ReactNodeArray;
  className?: string;
  style?: CSSProperties;
}

function FTitleText({children, style, className, text, type = 'h1', singleRow = false}: FTitleProps) {
  const singleRowClassName = singleRow ? shared.singleRow : '';
  const finalClassName = [singleRowClassName, styles[type], styles.text, className].join(' ');
  switch (type) {
    case 'h1':
      return <h1 className={finalClassName} style={style}>{children || text}</h1>;
    case 'h2':
      return <h2 className={finalClassName} style={style}>{children || text}</h2>;
    case 'h3':
      return <h3 className={finalClassName} style={style}>{children || text}</h3>;
    case 'h4':
      return <h4 className={finalClassName} style={style}>{children || text}</h4>;
    case 'popup':
      return <h5 className={finalClassName} style={style}>{children || text}</h5>;
    default:
      return <h6 className={finalClassName} style={style}>{children || text}</h6>
  }
}

export default FTitleText;
