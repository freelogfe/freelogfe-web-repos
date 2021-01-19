import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleReplaceProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleReplace({className, ...props}: FMappingRuleReplaceProps) {
  return (<i className={['freelog', 'fl-icon-tihuani', className].join(' ')} {...props} />);
}

export default FMappingRuleReplace;
