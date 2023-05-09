import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleTitleProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleTitle({className, ...props}: FMappingRuleTitleProps) {
  return (<i className={['freelog', 'fl-icon-biaoti', className].join(' ')} {...props} />);
}

export default FMappingRuleTitle;
