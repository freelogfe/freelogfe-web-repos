import * as React from 'react';
// import styles from './index.less';

interface FMappingRuleReplaceProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FMappingRuleReplace({className, ...props}: FMappingRuleReplaceProps) {
  return (<i className={['freelog', 'fl-icon-tihuan', className].join(' ')} {...props} />);
}

export default FMappingRuleReplace;
