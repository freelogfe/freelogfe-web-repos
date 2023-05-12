import * as React from 'react';
import styles from './index.less';
import { Input, InputRef } from 'antd';
import { ChangeEventHandler, KeyboardEventHandler } from 'react';

interface FInput_Search_Props {
  value: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  size?: 'small' | 'middle';
  style?: React.CSSProperties;
  // FI18n.i18nNext.t('form_input_search_error_length')
  lengthLimit?: number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>;
}

function FInput_Search({
                         value,
                         placeholder = '',
                         className = '',
                         hasError = false,
                         size = 'middle',
                         style = {},
                         lengthLimit = 100,
                         onChange,
                         onPressEnter,
                       }: FInput_Search_Props, ref: React.Ref<InputRef> | undefined) {
  return (<Input
    ref={ref}
    value={value}
    placeholder={placeholder}
    className={[...className, styles.Input, styles.dark].join(' ')}
    style={{
      height: size === 'middle' ? 38 : 32,
      ...style,
    }}
    prefix={<i className={['freelog', 'fl-icon-content', styles.darkPrefix].join(' ')} />}
    onChange={onChange}
    onPressEnter={onPressEnter}
    allowClear={true}
  />);
}

export default React.forwardRef(FInput_Search);
