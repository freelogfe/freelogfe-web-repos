import * as React from 'react';
import styles from './index.less';
import { Link } from 'umi';
// import {LinkProps} from 'react-router-dom';

interface FLinkProps {
  className?: string;
  to: string;
  replace?: boolean;
  children: React.ReactNode;
  target?: React.HTMLAttributeAnchorTarget | undefined;
}

function FLink({ className = '', ...props }: FLinkProps) {
  return (<Link
    className={[className, styles.Link].join(' ')}
    {...props}
  />);
}

export default FLink;
