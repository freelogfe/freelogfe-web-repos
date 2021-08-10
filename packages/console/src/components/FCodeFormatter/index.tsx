import * as React from 'react';
import styles from './index.less';

interface FCodeFormatterProps {
  code: string;
}

function FCodeFormatter({code}: FCodeFormatterProps) {
  return (<pre className={styles.code}>{code}</pre>);
}

export default FCodeFormatter;
