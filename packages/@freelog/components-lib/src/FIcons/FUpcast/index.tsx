import * as React from 'react';

// import styles from './index.less';

interface FUpcastProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FUpcast({className, ...props}: FUpcastProps) {
    return (<i className={['freelog', 'fl-icon-shangpao', className].join(' ')} {...props}/>);
}

export default FUpcast;
