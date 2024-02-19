import * as React from 'react';
import styles from './index.less';

interface FExclamationProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FExclamation({className, ...props}: FExclamationProps) {
    return (<i className={['freelog', 'fl-icon-warningxiaochicun', styles.icon, className].join(' ')} {...props}/>);
}

export default FExclamation;
