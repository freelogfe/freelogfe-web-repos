import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleOfflineProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleOffline({className, ...props}: FMappingRuleOfflineProps) {
  return (<i className={['freelog', 'fl-icon-xiaxian', className].join(' ')} {...props} />);
}

export default FMappingRuleOffline;
