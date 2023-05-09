import * as React from 'react';
import styles from './index.less';

interface FUpProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FUp({className, ...props}: FUpProps) {
    return (<i className={['freelog', 'fl-icon-zhankaigengduo', styles.icon, className].join(' ')} {...props} />);

}

export default FUp;
