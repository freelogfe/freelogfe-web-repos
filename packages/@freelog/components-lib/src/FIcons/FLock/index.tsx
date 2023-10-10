import * as React from 'react';
// import styles from './index.less';

interface FLockProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FLock({className, ...props}: FLockProps) {
    return (<i className={['freelog', 'fl-icon-suoding', className].join(' ')} {...props} />);
}

export default FLock;
