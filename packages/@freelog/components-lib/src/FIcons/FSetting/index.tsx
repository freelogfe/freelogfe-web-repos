import * as React from 'react';

// import styles from './index.less';

interface FSettingProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FSetting({className, ...props}: FSettingProps) {
    return (<i className={['freelog', 'fl-icon-qiehuan', className].join(' ')} {...props}/>);
}

export default FSetting;
