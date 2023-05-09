import * as React from 'react';

// import styles from './index.less';

interface FCircleDeleteProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FCircleDelete({className, ...props}: FCircleDeleteProps) {
    return (<i className={['freelog', 'fl-icon-bianji_yuanxing', className].join(' ')} {...props} />);
}

export default FCircleDelete;
