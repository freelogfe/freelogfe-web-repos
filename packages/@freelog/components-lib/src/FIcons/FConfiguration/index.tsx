import * as React from 'react';
// import styles from './index.less';

interface FConfigurationProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FConfiguration({className, ...props}: FConfigurationProps) {
    return (<i className={['freelog', 'fl-icon-kexuanpeizhi', className].join(' ')} {...props} />);
}

export default FConfiguration;
