import * as React from 'react';
import styles from './index.less';
import { Input, Form } from 'antd';
// import FUtil1 from '@/utils';
import { FClose } from '@/components/FIcons';
import { fI18nNext } from '@freelog/tools-lib';

interface FLabelEditor {
  values?: string[];
  onChange?: (values: string[]) => void;
}

export default function({ values = [], onChange }: FLabelEditor) {

  const inputElementRef = React.useRef<any>(null);
  const [input, onChangeInput] = React.useState<string>('');
  const [errorText, onChangeErrorText] = React.useState<string>('');

  function onPressEnter(e: any) {
    const v = e.target.value;
    if (errorText) {
      return;
    }
    if (input === '') {
      // onChangeInput('');
      // onChangeErrorText('');
      inputElementRef.current.blur();
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
    // if (!value) {
    //   errorText = '不能为空';
    // } else
    if (value.length >= 20) {
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
      values?.length < 20 && (<div className={styles.InputWrap}>
        <Input
          className={[styles.Input, errorText ? styles.InputError : ''].join(' ')}
          placeholder={fI18nNext.t('hint_add_resource_tag')}
          ref={inputElementRef}
          value={input}
          onChange={onChangeInputText}
          onKeyUp={(event) => {
            if (event.key === 'Escape') {
              onChangeInput('');
              onChangeErrorText('');
              inputElementRef.current.blur();
            }
          }}
          onPressEnter={onPressEnter}
        />
        <div>
          {errorText && <label>{errorText}</label>}
        </div>
      </div>)
    }

    {
      values && values.length > 0 && (<>
        {
          values.length < 20 && (<div style={{ height: 20 }} />)
        }

        <div className={styles.labels}>
          {
            values.map((i: string, j: number) => (<label key={i} className={styles.label}>
              <span>{i}</span>
              <a onClick={() => onRemove(j)}><FClose style={{ fontSize: 12 }} /></a>
            </label>))
          }
        </div>
      </>)
    }

  </div>);
}
