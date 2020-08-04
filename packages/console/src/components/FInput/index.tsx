import * as React from 'react';
import {Input} from 'antd';
import {InputProps} from "antd/lib/input";
import styles from './index.less';
import {SearchOutlined} from '@ant-design/icons';
import {ChangeEvent} from "react";
import {useDebounceFn} from 'ahooks';

interface FInputProps extends InputProps {
  theme?: 'dark' | 'light';
  value?: string;
  debounce?: number;

  onDebounceChange?(value: string): void;
}

export default function ({
                           theme = 'light',
                           className = '',
                           debounce = 0,
                           value,
                           onChange,
                           onDebounceChange,
                           ...props
                         }: FInputProps) {

  const [inputText, setInputText] = React.useState<string>(value || '');
  const {run} = useDebounceFn(
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

  function debounceChange(e: ChangeEvent<HTMLInputElement>) {

  }

  if (theme === 'dark') {
    return (<Input
      value={debounce ? inputText : value}
      onChange={onInputChange}
      // prefix={<SearchOutlined style={{color: '#8E8E93'}}/>}
      prefix={<i className={'freelog fl-icon-content' + ' ' + styles.darkPrefix}/>}
      className={[styles.Input, theme === 'dark' ? styles.dark : '', className].join(' ')}
      {...props}
    />)
  }
  return (<Input
    value={debounce ? inputText : value}
    onChange={onInputChange}
    className={[styles.Input, className].join(' ')}
    {...props}
  />);
}
