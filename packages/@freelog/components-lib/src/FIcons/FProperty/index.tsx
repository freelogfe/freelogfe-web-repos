import * as React from 'react';
// import styles from './index.less';

interface FPropertyProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FProperty({className, ...props}: FPropertyProps) {
    return (<i className={['freelog', 'fl-icon-shuxing', className].join(' ')} {...props} />);
}

export default FProperty;
