import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleActiveProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleActive({className, ...props}: FMappingRuleActiveProps) {
  return (<i className={['freelog', 'fl-icon-jihuozhuti', className].join(' ')} {...props} />);
}

export default FMappingRuleActive;
