import * as React from 'react';
import styles from './index.less';
import {CloseOutlined} from '@ant-design/icons';
import {Input, Form} from 'antd';
import {i18nMessage} from "@/utils/i18n";

interface FLabelEditor {
  values?: readonly string[];
  onChange?: (values: string[]) => void;
}

let inputElement: any = null;

export default function ({values = [], onChange}: FLabelEditor) {

  const [input, onChangeInput] = React.useState<string>('');
  const [errorText, onChangeErrorText] = React.useState<string>('');

  // function onKeyDown(e: any) {
  //   if (e.keyCode === 27) {
  //     inputElement.blur();
  //     onChangeErrorText('');
  //     return onChangeInput('');
  //   }
  // }

  function onPressEnter(e: any) {
    const v = e.target.value;
    if (errorText) {
      return;
    }
    if (!input) {
      onChangeErrorText('不能为空');
      return;
    }
    onChangeInput('');
    return onChange && onChange([...values, e.target.value]);
  }

  function onChangeInputText(e: any) {
    const value = e.target.value;
    onChangeInput(value);

    let errorText: string = '';
    if (!value) {
      errorText = '不能为空';
    } else if (value.length >= 20) {
      errorText = '不超过20个字符';
    } else if (values.includes(value)) {
      errorText = '不能有重复';
    }
    onChangeErrorText(errorText);
  }

  function onRemove(index: number) {
    onChangeErrorText('');
    return onChange && onChange(values?.filter((i, j) => j !== index));
  }

  return (<div className={styles.styles}>
    {
      values.map((i: string, j: number) => (<label key={i} className={styles.label}>
        <span>{i}</span>
        <a onClick={() => onRemove(j)}><CloseOutlined/></a>
      </label>))
    }
    {
      values?.length < 20 && (<div className={styles.InputWrap}>
        <Input
          className={styles.Input + ' ' + (errorText && styles.InputError)}
          placeholder={i18nMessage('hint_add_resource_tag')}
          ref={(i) => inputElement = i}
          value={input}
          onChange={onChangeInputText}
          // onKeyDown={onKeyDown}
          onPressEnter={onPressEnter}
        />
        {errorText && <label>{errorText}</label>}
      </div>)
    }

  </div>);
}
