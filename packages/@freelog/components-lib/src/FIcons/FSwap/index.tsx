import * as React from 'react';

// import styles from './index.less';

interface FSwapProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FSwap({className, ...props}: FSwapProps) {
    return (<i className={['freelog', 'fl-icon-qiehuan', className].join(' ')} {...props}/>);
}

export default FSwap;
