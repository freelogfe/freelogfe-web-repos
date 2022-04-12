import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FUpcastProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FUpcast({className, ...props}: FUpcastProps) {
  return (<i className={['freelog', 'fl-icon-shangpao', className].join(' ')} {...props}/>);
}

export default FUpcast;
