import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleActiveProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleActive({className, ...props}: FMappingRuleActiveProps) {
  return (<i className={['freelog', 'fl-icon-jihuozhuti', className].join(' ')} {...props} />);
}

export default FMappingRuleActive;
