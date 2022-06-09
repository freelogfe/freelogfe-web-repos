import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FFullScreenProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FFullScreen({...props}: FFullScreenProps) {
  return (<i className="freelog fl-icon-quanping" {...props} />);
}

export default FFullScreen;
