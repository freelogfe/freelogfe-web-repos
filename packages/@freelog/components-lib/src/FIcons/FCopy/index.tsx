import * as React from 'react';

interface FCopyProps {
  className?: string;
  style?: React.CSSProperties;

  onClick?(): void;
}

function FCopy({className, ...props}: FCopyProps) {
  return (<i className={['freelog', 'fl-icon-fuzhimingcheng', className].join(' ')} {...props} />);
}

export default FCopy;
