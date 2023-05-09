import * as React from 'react';

// import styles from './index.less';

interface FFullScreenProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FFullScreen({className, ...props}: FFullScreenProps) {
    return (<i className={['freelog', 'fl-icon-quanping', className].join(' ')} {...props} />);
}

export default FFullScreen;
