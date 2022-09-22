import * as React from 'react';

// import styles from './index.less';

interface FDownloadProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FDownload({className, ...props}: FDownloadProps) {
    return (<i className={['freelog', 'fl-icon-xiazai1', className].join(' ')} {...props} />);
}

export default FDownload;
