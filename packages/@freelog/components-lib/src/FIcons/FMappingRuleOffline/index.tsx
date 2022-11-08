import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleOfflineProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleOffline({className, ...props}: FMappingRuleOfflineProps) {
  return (<i className={['freelog', 'fl-icon-xiaxian', className].join(' ')} {...props} />);
}

export default FMappingRuleOffline;
