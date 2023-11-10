import * as React from 'react';
import { Input, InputRef } from 'antd';
import { InputProps } from 'antd/lib/input';
import styles from './index.less';
import { ChangeEvent } from 'react';
import * as AHooks from 'ahooks';
// import { RefSelectProps } from 'antd/lib/select';

interface FInputProps extends InputProps {
  onPressEnter?(value: any): void;

  theme?: 'dark' | 'light';
  value?: string;
  debounce?: number;
  errorText?: React.ReactNode;
  wrapClassName?: string;
  lengthLimit?: number;
  size?: 'small' | 'middle';

  onDebounceChange?(value: string): void;
}

function FInput({
                  theme = 'light',
                  className = '',
                  debounce = 0,
                  value,
                  onChange,
                  onDebounceChange,
                  onPressEnter,
                  errorText,
                  wrapClassName,
                  lengthLimit = 0,
                  size = 'middle',
                  style = {},
                  ...props
                }: FInputProps, ref: React.Ref<InputRef> | undefined) {

  const [inputText, setInputText] = React.useState<string>(value || '');
  const { run } = AHooks.useDebounceFn(
    () => {
      onDebounceChange && onDebounceChange(inputText);
    },
    {
      wait: debounce,
    },
  );

  React.useEffect(() => {
    debounce && setInputText(value || '');
  }, [debounce, value]);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    debounce && run();
    debounce ? setInputText(e.target.value) : (onChange && onChange(e));
  }

  const inputProps = {
    value: debounce ? inputText : value,
    onChange: onInputChange,
    ...props,
  };

  const commentClass: string [] = [styles.Input, className, errorText ? styles.InputError : ''];

  // console.log(errorText, 'errorText!@#$!@#$@#$');
  return (<div className={styles.wrap + ' ' + (wrapClassName || '')}>
    {
      theme === 'dark'
        ? (
          <Input
            ref={ref}
            // prefix={<SearchOutlined style={{color: '#8E8E93'}}/>}
            prefix={<i className={['freelog', 'fl-icon-content', styles.darkPrefix].join(' ')} />}
            className={[...commentClass, styles.dark].join(' ')}
            onPressEnter={(e) => {
              onPressEnter && onPressEnter(e);
            }}
            allowClear={true}
            style={{
              height: size === 'middle' ? 38 : 32,
              ...style,
            }}
            {...inputProps}
          />
        )
        : (<Input
          ref={ref}
          className={[...commentClass, styles.light].join(' ')}
          style={{
            height: size === 'middle' ? 38 : 32,
            ...style,
          }}
          onPressEnter={(e) => {
            onPressEnter && onPressEnter(e);
          }}
          suffix={lengthLimit > 0
            ? (<span
              className={[styles.FInputWordCount, lengthLimit - (debounce ? inputText.length : (value?.length || 0)) < 0 ? styles.beyond : ''].join(' ')}
            >{lengthLimit - (debounce ? inputText.length : (value?.length || 0))}</span>)
            : undefined}
          {...inputProps}
        />)
    }

    {
      errorText && (<div className={styles.errorText}>{errorText}</div>)
    }

  </div>);
}

export default React.forwardRef(FInput);
