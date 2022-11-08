import * as React from 'react';
// import styles from './index.less';

interface FCompositionProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FComposition({className, ...props}: FCompositionProps) {
    return (<i className={['freelog', 'fl-icon-zuhemoshi', className].join(' ')} {...props} />);
}

export default FComposition;
