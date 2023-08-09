import * as React from 'react';
// import styles from './index.less';

interface FCheckMarkProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FCheckMark({className, ...props}: FCheckMarkProps) {
    return (<i className={['freelog', 'fl-icon-xuanzhong', className].join(' ')} {...props} />);
}

export default FCheckMark;
