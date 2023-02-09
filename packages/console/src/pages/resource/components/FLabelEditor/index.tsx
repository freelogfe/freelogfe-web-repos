import * as React from 'react';
import styles from './index.less';
import { Input, InputRef } from 'antd';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FTooltip from '@/components/FTooltip';

interface FLabelEditor {
  values?: string[];
  showRecommendation?: boolean;
  onChange?: (values: string[]) => void;
}

export default function({ values = [], showRecommendation = false, onChange }: FLabelEditor) {

  const inputElementRef = React.useRef<HTMLInputElement>(null);
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
      inputElementRef.current?.blur();
      return;
    }
    if (!input) {
      onChangeErrorText('不能为空');
      return;
    }
    onChangeInput('');
    return onChange && onChange([...values, e.target.value.replace(new RegExp(/#/, 'g'), '')]);
  }

  function onChangeInputText(value1: string) {
    const value = value1.replaceAll('#', '');
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
        <div className={styles.InputRow}>
          <Input
            className={[styles.Input, errorText ? styles.InputError : ''].join(' ')}
            placeholder={FI18n.i18nNext.t('hint_add_resource_tag')}
            ref={inputElementRef as any}
            value={input}
            onChange={(e) => {
              onChangeInputText(e.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                onChangeInput('');
                onChangeErrorText('');
                inputElementRef.current?.blur();
              }
            }}
            onPressEnter={onPressEnter}
          />
          {
            showRecommendation && (<>
              <div style={{ width: 20 }} />
              <FComponentsLib.FContentText type={'additional2'} text={'推荐标签 :'} />
              <div style={{ width: 15 }} />
              <FTooltip title={'参与即赢2000元现金奖励'} placement={'top'}>
                <a
                  className={styles.recommendation}
                  onClick={() => {
                    onChangeInputText('#内测集结，漫画家召集令#');
                    inputElementRef.current?.focus();
                  }}
                >#内测集结，漫画家召集令#</a>
              </FTooltip>
              <div style={{ width: 15 }} />
              <FTooltip title={'参与即赢2000元现金奖励'} placement={'top'}>
                <a
                  className={styles.recommendation}
                  onClick={() => {
                    onChangeInputText('#内测集结！小说家召集令#');
                    inputElementRef.current?.focus();
                  }}
                >#内测集结！小说家召集令#</a>
              </FTooltip>
            </>)
          }

        </div>
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
              <a onClick={() => onRemove(j)}><FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} /></a>
            </label>))
          }
        </div>
      </>)
    }

  </div>);
}
