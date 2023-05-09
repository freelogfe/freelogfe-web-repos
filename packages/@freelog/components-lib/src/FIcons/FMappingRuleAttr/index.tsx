import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleAttrProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleAttr({className, ...props}: FMappingRuleAttrProps) {
  return (<i className={['freelog', 'fl-icon-zidingyishuxing', className].join(' ')} {...props} />);
}

export default FMappingRuleAttr;
