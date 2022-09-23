import * as React from 'react';
// import styles from './index.less';

interface FRedoProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FRedo({className, ...props}: FRedoProps) {
    return (<i
        className={['freelog', 'fl-icon-zhongzhi', className].join(' ')}
        {...props}
    />);
}

export default FRedo;
