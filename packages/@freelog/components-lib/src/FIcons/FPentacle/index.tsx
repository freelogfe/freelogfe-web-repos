import * as React from 'react';

// import styles from './index.less';

interface FPentacleProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FPentacle({className, ...props}: FPentacleProps) {
    return (<i
        className={['freelog', 'fl-icon-shoucangxiaoshuoyishoucang', className].join(' ')}
        {...props}
    />);
}

export default FPentacle;
