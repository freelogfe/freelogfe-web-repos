import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleCoverProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleCover({className, ...props}: FMappingRuleCoverProps) {
  return (<i className={['freelog', 'fl-icon-fengmian', className].join(' ')} {...props} />);
}

export default FMappingRuleCover;
