import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleAddProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleAdd({className, ...props}: FMappingRuleAddProps) {
  return (<i className={['freelog', 'fl-icon-xinzengdezhanpin', className].join(' ')} {...props} />);
}

export default FMappingRuleAdd;
