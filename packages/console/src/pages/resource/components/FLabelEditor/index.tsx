import * as React from 'react';
import styles from './index.less';
import {CloseOutlined} from '@ant-design/icons';
import {Input, Form} from 'antd';

interface FLabelEditor {
  value?: string[];
  onChange?: (value: string[]) => void;
}

let inputElement: any = null;

export default function ({value = [], onChange}: FLabelEditor) {

  const [input, onChangeInput] = React.useState<string>('');
  const [errorText, onChangeErrorText] = React.useState<string>('');

  function onKeyDown(e: any) {
    if (e.keyCode === 27) {
      inputElement.blur();
      onChangeErrorText('');
      return onChangeInput('');
    }
  }

  function onPressEnter(e: any) {
    const v = e.target.value;
    if (!v) {
      return;
    }
    if (value?.includes(v)) {
      onChangeErrorText('有重复');
      return;
    }
    onChangeInput('');
    return onChange && onChange([...value, e.target.value]);
  }

  function onChangeInputText(e: any) {
    onChangeErrorText('');
    onChangeInput(e.target.value);
  }

  return (<div className={styles.styles}>
    {
      value.map((i: string) => (<label key={i} className={styles.label}>
        <span>{i}</span>
        <a><CloseOutlined/></a>
      </label>))
    }
    <div className={styles.InputWrap}>
      <Input
        className={styles.Input + ' ' + (errorText && styles.InputError)}
        placeholder={'回车添加标签，esc取消'}
        ref={(i) => inputElement = i}
        value={input}
        onChange={onChangeInputText}
        onKeyDown={onKeyDown}
        onPressEnter={onPressEnter}
      />
      {errorText && <label>{errorText}</label>}
    </div>
  </div>);
}
