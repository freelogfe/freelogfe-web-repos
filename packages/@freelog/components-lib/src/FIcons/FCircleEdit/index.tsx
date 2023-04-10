import * as React from 'react';

// import styles from './index.less';

interface FCircleEditProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FCircleEdit({className, ...props}: FCircleEditProps) {
    return (<i className={['freelog', 'fl-icon-shanchu_yuanxing', className].join(' ')} {...props} />);
}

export default FCircleEdit;
