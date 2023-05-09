import * as React from 'react';
// import styles from './index.less';
import {CSSProperties} from "react";

interface FFileTextProps {
    className?: string;
    style?: CSSProperties;

    onClick?(): void;
}

function FFileText({className, ...props}: FFileTextProps) {
    return (<i className={['freelog', 'fl-icon-moban', className].join(' ')} {...props}/>);
}

export default FFileText;
