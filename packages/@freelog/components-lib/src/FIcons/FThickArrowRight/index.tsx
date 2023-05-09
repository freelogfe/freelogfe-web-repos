import * as React from 'react';
// import styles from './index.less';

interface FThickArrowRightProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FThickArrowRight({className, ...props}: FThickArrowRightProps) {
  return (<i className={['freelog', 'fl-icon-jiantou', className].join(' ')} {...props} />);
}

export default FThickArrowRight;
