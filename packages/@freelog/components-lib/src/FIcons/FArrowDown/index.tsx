import * as React from 'react';
// import styles from './index.less';

interface FArrowDownProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FArrowDown({className, ...props}: FArrowDownProps) {
    return (<i className={['freelog', 'fl-icon-fangxiang', className].join(' ')} {...props} />);
}

export default FArrowDown;
