import * as React from 'react';

// import styles from './index.less';

interface FDeleteProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(e: any): void;
}

function FDelete({className = '', ...props}: FDeleteProps) {
    return (<i className={['freelog', 'fl-icon-shanchu', className].join(' ')} {...props} />);
}

export default FDelete;
