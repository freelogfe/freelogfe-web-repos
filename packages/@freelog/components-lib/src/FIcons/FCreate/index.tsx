import * as React from 'react';
// import styles from './index.less';

interface FCreateProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FCreate({className, ...props}: FCreateProps) {
    return (<i className={['freelog', 'fl-icon-chuangjian_shixin', className].join(' ')} {...props} />);
}

export default FCreate;
