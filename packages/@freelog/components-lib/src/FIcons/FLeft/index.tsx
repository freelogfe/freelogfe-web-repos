import * as React from 'react';
import styles from './index.less';

interface FLeftProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FLeft({className, ...props}: FLeftProps) {
    return (<i className={['freelog', 'fl-icon-zhankaigengduo', styles.icon, className].join(' ')} {...props} />);
}

export default FLeft;
