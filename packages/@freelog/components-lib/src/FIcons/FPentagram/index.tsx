import * as React from 'react';

// import styles from './index.less';

interface FPentagramProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FPentagram({className, ...props}: FPentagramProps) {
    return (<i
        className={['freelog', 'fl-icon-xing', className].join(' ')}
        {...props}
    />);
}

export default FPentagram;
