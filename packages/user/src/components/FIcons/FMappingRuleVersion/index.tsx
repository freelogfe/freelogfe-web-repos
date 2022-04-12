import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleVersionProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleVersion({className, ...props}: FMappingRuleVersionProps) {
  return (<i className={['freelog', 'fl-icon-banben', className].join(' ')} {...props} />);
}

export default FMappingRuleVersion;
