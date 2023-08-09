import * as React from 'react';
import styles from './index.less';

interface FArrowRightProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FArrowRight({className, ...props}: FArrowRightProps) {
    return (<i className={['freelog', 'fl-icon-fangxiang', styles.icon, className].join(' ')} {...props} />);
}

export default FArrowRight;
