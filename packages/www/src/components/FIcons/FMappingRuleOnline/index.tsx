import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleOnlineProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleOnline({className, ...props}: FMappingRuleOnlineProps) {
  return (<i className={['freelog', 'fl-icon-shangxian', className].join(' ')} {...props} />);
}

export default FMappingRuleOnline;
