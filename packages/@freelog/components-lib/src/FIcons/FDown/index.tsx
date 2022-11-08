import * as React from 'react';
import styles from './index.less';

interface FDownProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FDown({className, ...props}: FDownProps) {
    return (<i className={['freelog', 'fl-icon-zhankaigengduo', styles.icon, className].join(' ')} {...props} />);
}

export default FDown;
