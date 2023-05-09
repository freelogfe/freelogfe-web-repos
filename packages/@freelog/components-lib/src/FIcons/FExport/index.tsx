import * as React from 'react';
// import styles from './index.less';

interface FExportProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FExport({className, ...props}: FExportProps) {
  return (<i className={['freelog', 'fl-icon-daochu', className].join(' ')} {...props} />);
}

export default FExport;
