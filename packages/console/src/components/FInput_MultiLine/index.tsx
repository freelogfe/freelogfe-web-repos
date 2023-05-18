import * as React from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { TextAreaRef } from 'antd/lib/input/TextArea';

interface FInput_MultiLine_Props {
  value: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  style?: React.CSSProperties;
  // FI18n.i18nNext.t('form_input_multiplelinetxt_error_length')
  lengthLimit?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onPressEnter?: KeyboardEventHandler<HTMLTextAreaElement>;
}

function FInput_MultiLine({
                            value,
                            placeholder = '',
                            className = '',
                            hasError = false,
                            style = {},
                            lengthLimit = 600,
                            onChange,
                            onPressEnter,
                          }: FInput_MultiLine_Props, ref: React.Ref<TextAreaRef> | undefined) {
  return (<div className={styles.introduction}>
    <Input.TextArea
      ref={ref}
      value={value}
      placeholder={placeholder}
      className={styles.TextArea}
      style={style}
      onChange={onChange}
      onPressEnter={onPressEnter}
      autoSize={true}
    />
    <span
      className={[styles.FInputWordCount, value.length > lengthLimit ? styles.beyond : ''].join(' ')}>{lengthLimit - value.length}</span>
  </div>);
}

export default React.forwardRef(FInput_MultiLine);
