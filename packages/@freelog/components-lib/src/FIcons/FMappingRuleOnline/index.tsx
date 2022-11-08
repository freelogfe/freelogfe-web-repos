import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleOnlineProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleOnline({className, ...props}: FMappingRuleOnlineProps) {
  return (<i className={['freelog', 'fl-icon-shangxian', className].join(' ')} {...props} />);
}

export default FMappingRuleOnline;
