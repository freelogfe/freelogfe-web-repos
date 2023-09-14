import * as React from 'react';
// import styles from './index.less';

interface FContractProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FContract({className, ...props}: FContractProps) {
    return (<i className={['freelog', 'fl-icon-heyue1', className].join(' ')} {...props} />);
}

export default FContract;
