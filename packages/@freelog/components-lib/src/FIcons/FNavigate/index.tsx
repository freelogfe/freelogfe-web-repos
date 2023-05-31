import * as React from 'react';
// import styles from './index.less';

interface FNavigateProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FNavigate({className, ...props}: FNavigateProps) {
    return (<i
        className={['freelog', 'fl-icon-fangwen', className].join(' ')}
        {...props}
    />);
}

export default FNavigate;
