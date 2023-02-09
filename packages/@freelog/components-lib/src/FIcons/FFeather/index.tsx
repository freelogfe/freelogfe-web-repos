import * as React from 'react';

// import styles from './index.less';

interface FFeatherProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FFeather({className, ...props}: FFeatherProps) {
    return (<i
        className={['freelog', 'fl-icon-feather', className].join(' ')}
        {...props}
    />);
}

export default FFeather;
