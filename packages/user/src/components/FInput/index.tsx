import * as React from 'react';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import styles from './index.less';
import { ChangeEvent } from 'react';
import * as AHooks from 'ahooks';

interface FInputProps extends InputProps {
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
                  errorText,
                  wrapClassName,
                  lengthLimit = 0,
                  size = 'middle',
                  ...props
                }: FInputProps) {

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

  // console.log(value, 'valuevaluevaluevaluevalue!@#$!@#$@#$');
  return (<div className={styles.wrap + ' ' + (wrapClassName || '')}>
    {
      theme === 'dark'
        ? (
          <Input
            // prefix={<SearchOutlined style={{color: '#8E8E93'}}/>}
            prefix={<i className={['freelog', 'fl-icon-content', styles.darkPrefix].join(' ')} />}
            className={[...commentClass, styles.dark].join(' ')}
            allowClear={true}
            style={{ height: size === 'middle' ? 38 : 32 }}
            {...inputProps}
          />
        )
        : (<Input
          className={[...commentClass, styles.light].join(' ')}
          style={{ height: size === 'middle' ? 38 : 32 }}
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

export default FInput;
