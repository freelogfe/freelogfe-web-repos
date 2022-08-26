import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleAddProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleAdd({className, ...props}: FMappingRuleAddProps) {
  return (<i className={['freelog', 'fl-icon-xinzengdezhanpin', className].join(' ')} {...props} />);
}

export default FMappingRuleAdd;
