import * as React from 'react';
import styles from './index.less';
import { Button, Checkbox, Popover } from 'antd';
import FAutoComplete from '../FAutoComplete';
import * as AHooks from 'ahooks';
import * as semver from 'semver';
import FComponentsLib from '@freelog/components-lib';

interface FVersionHandlerPopoverProps {
  value: string;
  versionOptions: string[];
  children?: React.ReactNode;
  allowEmpty?: boolean;

  onChange?(version: FVersionHandlerPopoverProps['value']): void;
}

function FVersionHandlerPopover({
                                  value,
                                  versionOptions,
                                  allowEmpty = false,
                                  onChange,
                                  children,
                                }: FVersionHandlerPopoverProps) {

  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<string>(value);
  const [inputError, setInputError] = React.useState<string>('');

  React.useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
  }, [value]);

  const { run } = AHooks.useDebounceFn<(value: string, bool?: boolean) => void>(
    (value, bool) => {
      if (bool) {
        if (input.startsWith('^')) {
          onChangeInput('^' + value);
        } else {
          onChangeInput(value);
        }
      } else {
        onChangeInput(value);
      }
    },
    {
      wait: 10,
    },
  );

  function onChangeInput(value: string) {
    // console.log(semver.validRange(value), 'VVVVVVV######');
    // console.log(semver.maxSatisfying(['0.2.2', '0.2.3', '1.1.1', '1.2.2', '1.3.2', '2.2.2'], '^2.2.2'), '0923u4io');
    let inputError: string = '';
    if (!allowEmpty && !value) {
      inputError = '请输入版本号';
    } else if (!semver.validRange(value)) {
      inputError = '请输入合法semver版本';
    } else if (!semver.maxSatisfying(versionOptions, value)) {
      inputError = '最少要匹配一个版本';
    }
    setInput(value);
    setInputError(inputError);
  }

  function onConfirm() {
    setVisible(false);
    return onChange && onChange(input);
  }

  return (<Popover
    // getTooltipContainer={() => {
    //
    // }}
    placement='bottomLeft'
    trigger='click'
    // onVisibleChange={(visible) => setVisible(visible)}
    onOpenChange={(visible) => setVisible(visible)}
    // visible={visible}
    open={visible}
    content={<div
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.select}>
        <div ref={ref} style={{ position: 'relative' }} />
        <FAutoComplete
          getPopupContainer={() => {
            return ref.current || document.body;
          }}
          size='small'
          className={styles.FAutoComplete}
          value={input}
          options={versionOptions.map<{ value: string, label: string }>((vo) => ({ value: vo, label: vo }))}
          onSelect={(value: string) => run(value, true)}
          onChange={(value) => run(value)}
        />
        {
          inputError && (<>
            <div style={{ height: 2 }} />
            <div className={styles.errorTip}>{inputError}</div>
          </>)
        }

        <div style={{ height: 10 }} />
        <div className={styles.Checkbox}>
          <Checkbox
            checked={input.startsWith('^')}
            onChange={(e) => {
              if (e.target.checked) {
                onChangeInput('^' + input);
              } else {
                onChangeInput(input.substring(1));
              }
            }}
          />
          <div style={{ width: 5 }} />
          <div>允许使用当前版本的最新变动</div>
        </div>
      </div>

      <div style={{ height: 10 }} />
      <div className={styles.footer}>
        <Button
          size='small'
          type='default'
          onClick={() => setVisible(false)}
        >取消</Button>
        <div style={{ width: 10 }} />
        <FComponentsLib.FRectBtn
          size='small'
          disabled={!!inputError}
          onClick={onConfirm}
          type='primary'
        >确定</FComponentsLib.FRectBtn>
      </div>
    </div>}
    title={null}
  >
    <div
      className={styles.children}
      onClick={(e) => {
        e.stopPropagation();
        setVisible(true);
      }}
    >{children}</div>
  </Popover>);
}

export default FVersionHandlerPopover;
