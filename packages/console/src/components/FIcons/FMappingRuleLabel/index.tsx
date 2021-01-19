import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleLabelProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleLabel({className, ...props}: FMappingRuleLabelProps) {
  return (<i className={['freelog', 'fl-icon-biaoqian', className].join(' ')} {...props} />);
}

export default FMappingRuleLabel;
