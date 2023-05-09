import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleCoverProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleCover({className, ...props}: FMappingRuleCoverProps) {
  return (<i className={['freelog', 'fl-icon-fengmian', className].join(' ')} {...props} />);
}

export default FMappingRuleCover;
