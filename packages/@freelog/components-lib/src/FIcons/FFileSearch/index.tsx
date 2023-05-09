import * as React from 'react';
// import styles from './index.less';

interface FFileTextProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FFileSearch({className, ...props}: FFileTextProps) {
  return (<i className={['freelog', 'fl-icon-chakanziyuan', className].join(' ')} {...props}/>);
}

export default FFileSearch;
