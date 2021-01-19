import * as React from 'react';
import styles from './index.less';
import {CSSProperties} from "react";

interface FMappingRuleAttrProps {
  className?: string;
  style?: CSSProperties;

  onClick?(): void;
}

function FMappingRuleAttr({className, ...props}: FMappingRuleAttrProps) {
  return (<i className={['freelog', 'fl-icon-zidingyishuxing', className].join(' ')} {...props} />);
}

export default FMappingRuleAttr;
