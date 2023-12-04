import * as React from 'react';
import styles from './index.less';
import shared from '../shared.less';

export interface FContentTextProps {
    text?: string;
    type?: 'normal' | 'highlight' | 'negative' | 'additional1' | 'additional2';
    singleRow?: boolean;
    children?: React.ReactNode | React.ReactNodeArray;
    className?: string;
    style?: React.CSSProperties;
}

const FContentText = React.forwardRef(({
                                           className,
                                           style,
                                           children,
                                           text,
                                           type = 'normal',
                                           singleRow = false
                                       }: FContentTextProps, ref: React.LegacyRef<any>) => {
    const singleRowClassName = singleRow ? shared.singleRow : '';
    return (
        <div
            ref={ref}
            style={style}
            className={[singleRowClassName, styles[type], styles.text, className].join(' ')}>{children || text}</div>
    );
});

export default FContentText;
