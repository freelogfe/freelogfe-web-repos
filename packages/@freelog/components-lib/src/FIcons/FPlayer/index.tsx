import * as React from 'react';

// import styles from './index.less';

interface FPlayerProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FPlayer({className, ...props}: FPlayerProps) {
    return (<i className={['freelog', 'fl-icon-bofang', className].join(' ')} {...props}/>);
}

export default FPlayer;
