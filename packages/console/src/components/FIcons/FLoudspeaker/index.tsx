import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FLoudspeakerProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FLoudspeaker({className, ...props}: FLoudspeakerProps) {
  return (<i className={['freelog', 'fl-icon-tongzhi', className].join(' ')} {...props} />);
}

export default FLoudspeaker;
