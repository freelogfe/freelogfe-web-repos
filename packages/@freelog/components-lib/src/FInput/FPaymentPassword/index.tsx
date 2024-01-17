import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';

export interface FPaymentPasswordInputProps {
    value: string;
    autoFocus?: boolean;

    onChange?(value: string): void;

    onBlur?(): void;
}

const FPaymentPasswordInput = React.forwardRef(({
                                   value,
                                   autoFocus = false,
                                   onChange,
                                   onBlur
                               }: FPaymentPasswordInputProps, ref: any) => {

    const inputEl = React.useRef<any>(null);
    const [isFocus, setIsFocus] = React.useState<boolean>(false);

    return (<div className={styles.styles}>
        <input
            autoComplete={'off'}
            autoFocus={autoFocus}
            type='password'
            minLength={6}
            maxLength={6}
            ref={ref || inputEl}
            value={value}
            onChange={(e) => {
                onChange && onChange(e.target.value.replace(/[^\d]/g, ''));
            }}
            onFocus={() => {
                setIsFocus(true);
            }}
            onBlur={() => {
                setIsFocus(false);
                onBlur && onBlur();
            }}
        />
        <Space size={10} onClick={() => {
            // console.log('#####9832hrlkjfsd');
            (ref || inputEl).current.focus();
        }}>
            {
                Array(6).fill(null).map((_, inx) => {
                    return (<div
                        className={[styles.InputBox, isFocus && (value.length === inx || inx === 5 && value.length >= 6) ? styles.InputBoxActivated : ''].join(' ')}>
                        {
                            isFocus && value.length === inx && (<span>|</span>)
                        }
                        {
                            value.length > inx && (<span>●</span>)
                        }

                    </div>);
                })
            }
        </Space>
    </div>);
})

export default FPaymentPasswordInput;
