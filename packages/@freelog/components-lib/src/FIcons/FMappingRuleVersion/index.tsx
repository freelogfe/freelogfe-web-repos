import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleVersionProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleVersion({className, ...props}: FMappingRuleVersionProps) {
  return (<i className={['freelog', 'fl-icon-banben', className].join(' ')} {...props} />);
}

export default FMappingRuleVersion;
