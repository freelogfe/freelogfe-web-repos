import * as React from 'react';
// import styles from './index.less';

interface FImportProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FImport({className, ...props}: FImportProps) {
  return (<i className={['freelog', 'fl-icon-daoru', className].join(' ')} {...props} />);
}

export default FImport;
