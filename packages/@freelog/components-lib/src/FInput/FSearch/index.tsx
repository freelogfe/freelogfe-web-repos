import * as React from 'react';
import styles from './index.less';
import {Input, InputRef} from 'antd';
import {
    // ChangeEventHandler,
    KeyboardEventHandler
} from 'react';

// import {FSearchInput} from "../index";

export interface FSearchInputProps {
    value: string;
    placeholder?: string;
    className?: string;
    hasError?: boolean;
    size?: 'small' | 'middle';
    style?: React.CSSProperties;
    // FI18n.i18nNext.t('form_input_search_error_length')
    lengthLimit?: number;

    // onChange?: ChangeEventHandler<HTMLInputElement>;
    onChange?(value: string): void;

    onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
}

function FSearchInput({
                          value,
                          placeholder = '',
                          className = '',
                          // hasError = false,
                          size = 'middle',
                          style = {},
                          lengthLimit = 100,
                          onChange,
                          onPressEnter,
                      }: FSearchInputProps, ref: React.Ref<InputRef> | undefined) {
    return (<Input
        ref={ref}
        value={value}
        placeholder={placeholder}
        className={[className, styles.Input, styles.dark].join(' ')}
        style={{
            height: size === 'middle' ? 38 : 32,
            ...style,
        }}
        prefix={<i className={['freelog', 'fl-icon-content', styles.darkPrefix].join(' ')}/>}
        onChange={(e) => {
            const str: string = e.target.value.substring(0, lengthLimit);
            if (str !== value) {
                onChange && onChange(str);
            }
        }}
        onPressEnter={onPressEnter}
        allowClear={true}
    />);
}

export default React.forwardRef(FSearchInput);
