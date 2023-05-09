import * as React from 'react';
import styles from './index.less';

interface FRightProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FRight({className, ...props}: FRightProps) {
    return (<i className={['freelog', 'fl-icon-zhankaigengduo', styles.icon, className].join(' ')} {...props} />);
}

export default FRight;
