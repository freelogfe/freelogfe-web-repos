import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Input, InputRef } from 'antd';
import * as AHooks from 'ahooks';
import { FUtil } from '@freelog/tools-lib';

interface FResourceLabelEditor2Props {
  value: string[];

  onChange?(value: string[]): void;
}

function FResourceLabelEditor2({ value, onChange }: FResourceLabelEditor2Props) {
  const refDiv = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<InputRef>(null);
  const [$showInput, set$showInput, get$showInput] = FUtil.Hook.useGetState<boolean>(false);
  const [$input, set$input, get$input] = FUtil.Hook.useGetState<string>('');

  AHooks.useClickAway(() => {
    set$showInput(false);
  }, refDiv);

  return (<div
    className={styles.editor2}
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
      ($showInput || value.length === 0) && (<Input
        ref={inputRef}
        value={$input}
        className={styles.input}
        placeholder={'输入标签后按回车添加'}
        onChange={(e) => {
          set$input(e.target.value);
        }}
        onPressEnter={() => {
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
          }
        }}
      />)
    }

  </div>);
}

export default FResourceLabelEditor2;
