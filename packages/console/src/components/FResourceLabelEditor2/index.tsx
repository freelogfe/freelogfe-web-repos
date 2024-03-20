import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Input, InputRef, Space } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface FResourceLabelEditor2Props {
  value: string[];
  style?: React.CSSProperties;
  showRemaining?: boolean;

  onChange?(value: string[]): void;

  onClickApply?(): void;
}

function FResourceLabelEditor2({
                                 value,
                                 onChange,
                                 onClickApply,
                                 style,
                                 showRemaining = false,
                               }: FResourceLabelEditor2Props) {
  const refDiv = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<InputRef>(null);
  const [$showInput, set$showInput, get$showInput] = FUtil.Hook.useGetState<boolean>(false);
  const [$input, set$input, get$input] = FUtil.Hook.useGetState<string>('');
  const [$inputError, set$inputError, get$inputError] = FUtil.Hook.useGetState<string>('');

  AHooks.useClickAway(() => {
    set$showInput(false);
    set$input('');
    set$inputError('');
  }, refDiv);

  return (<div>
    <div
      className={styles.editor2}
      style={style}
      onClick={() => {
        set$showInput(true);
        setTimeout(() => {
          inputRef.current?.focus();
        });
      }}
      ref={refDiv}
    >
      {
        value.map((v) => {
          return (<label key={v} className={styles.selectedLabel}>
            <span>{v}</span>
            <FComponentsLib.FIcons.FClose
              style={{ fontSize: 12 }}
              onClick={() => {
                onChange && onChange(value.filter((v1) => {
                  return v1 !== v;
                }));
              }}
            />
          </label>);
        })
      }

      {
        ($showInput || value.length === 0) && value.length < 20 && (<Input
          ref={inputRef}
          value={$input}
          className={styles.input}
          placeholder={FI18n.i18nNext.t('brr_resourcelisting_item_tag_msg')}
          onChange={(e) => {
            set$input(e.target.value);

            let errorText: string = '';

            if (e.target.value.length > 20) {
              errorText = '不超过20个字符';
            } else if (value.includes(e.target.value)) {
              errorText = '不能有重复';
            }

            set$inputError(errorText);
            // $setState({
            //   inputError: $prop.value.includes($state.input) ? '不能有重复' : $state.inputError,
            // });
          }}
          onPressEnter={() => {
            if (get$input() === '' || get$inputError() !== '') {
              return;
            }
            onChange && onChange([...value, get$input()]);
            set$input('');
          }}
          onBlur={() => {
            set$input('');
          }}
          onKeyUp={(event) => {
            if (event.key === 'Escape') {
              // set_input('');
              // set_errorText('');
              // $setState({
              //   input: '',
              //   inputError: '',
              // });
              inputRef.current?.blur();
              set$showInput(false);
              set$input('');
              set$inputError('');
            }
          }}
        />)
      }

      {
        showRemaining && (<>
          <div style={{ width: 100, height: 24 }} />
          <FComponentsLib.FContentText
            style={{ position: 'absolute', right: 10, bottom: 6, lineHeight: '24px' }}
            text={`还可添加${20 - value.length}个标签`}
            type={'additional2'}
          />
        </>)
      }

    </div>
    {
      ($inputError !== '' || !!onClickApply) && (<>
        <div style={{ height: 5 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            color: '#EE4040',
            fontSize: 12,
            visibility: $inputError !== '' ? 'visible' : 'hidden',
          }}>{$inputError}</div>

          {
            onClickApply && (<FComponentsLib.FTextBtn
              style={{ fontSize: 12 }}
              type={'primary'}
              onClick={() => {
                onClickApply && onClickApply();
              }}
            >{FI18n.i18nNext.t('brr_resourcelisting_item_btn_bulkaddtag')}</FComponentsLib.FTextBtn>)
          }
        </div>
      </>)
    }

  </div>);
}

export default FResourceLabelEditor2;
