import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { Input, InputRef } from 'antd';
import * as AHooks from 'ahooks';
import { FUtil } from '@freelog/tools-lib';

interface FResourceLabelEditor2Props {
  value: string[];
}

function FResourceLabelEditor2({ value }: FResourceLabelEditor2Props) {
  const refDiv = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<InputRef>(null);
  const [$showInput, set$showInput, get$showInput] = FUtil.Hook.useGetState<boolean>(false);
  const [$input, set$input] = FUtil.Hook.useGetState<string>('');

  AHooks.useClickAway(() => {
    set$showInput(false);
  }, refDiv);

  return (<div
    className={styles.editor2}
    onClick={() => {
      if (get$showInput()) {
        return;
      }
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
          <span>标签1</span>
          <FComponentsLib.FIcons.FClose
            style={{ fontSize: 12 }}
            onClick={() => {
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
      />)
    }

  </div>);
}

export default FResourceLabelEditor2;
