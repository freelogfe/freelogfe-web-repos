import * as React from 'react';
import styles from './index.less';
import {Input, InputRef} from 'antd';
import {ChangeEventHandler, KeyboardEventHandler} from 'react';

export interface FSingleLineInputProps {
    value: string;
    placeholder?: string;
    className?: string;
    hasError?: boolean;
    size?: 'small' | 'middle';
    style?: React.CSSProperties;
    // FI18n.i18nNext.t('form_input_singlelinetxt_error_length')
    lengthLimit?: number;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
    onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
    disabled?: boolean;
}

function FSingleLineInput({
                              disabled = false,
                              value,
                              placeholder = '',
                              className = '',
                              hasError = false,
                              size = 'middle',
                              style = {},
                              lengthLimit = 100,
                              onChange,
                              onPressEnter,
                              onKeyUp,

                          }: FSingleLineInputProps, ref: React.Ref<InputRef> | undefined) {
    return (<Input
        disabled={disabled}
        value={value}
        ref={ref}
        placeholder={placeholder}
        className={[className, disabled ? styles.disabledInput : styles.Input, hasError ? styles.InputError : ''].join(' ')}
        style={{
            height: size === 'middle' ? 38 : 32,
            ...style,
        }}
        onPressEnter={onPressEnter}
        onKeyUp={onKeyUp}
        onChange={onChange}
        suffix={lengthLimit > 0
            ? (<span
                className={[styles.FInputWordCount, lengthLimit - value.length < 0 ? styles.beyond : ''].join(' ')}
            >{lengthLimit - value.length}</span>)
            : undefined}
    />);
}

export default React.forwardRef(FSingleLineInput);
