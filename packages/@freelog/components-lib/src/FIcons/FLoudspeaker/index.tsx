import * as React from 'react';

// import styles from './index.less';

interface FLoudspeakerProps {
    className?: string;
    style?: React.CSSProperties;

    onClick?(): void;
}

function FLoudspeaker({className, ...props}: FLoudspeakerProps) {
    return (<i className={['freelog', 'fl-icon-tongzhi', className].join(' ')} {...props} />);
}

export default FLoudspeaker;
