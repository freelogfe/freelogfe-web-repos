import * as React from 'react';
import styles from './index.less';
import {AutoComplete} from 'antd';
import {AutoCompleteProps} from 'antd/lib/auto-complete';
import {useDebounceFn} from 'ahooks';

interface FAutoCompleteProps extends AutoCompleteProps {
  errorText?: string;
  autoRef?: any;
  debounce?: number;

  onDebounceChange?(value: string): void;

  onChange?(value: string): void;
}

function FAutoComplete({value, autoRef, errorText, debounce, onDebounceChange, onChange, ...props}: FAutoCompleteProps) {

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

  function onInputChange(value: string) {
    debounce && run();
    debounce ? setInputText(value) : (onChange && onChange(value));
  }

  return (<div className={styles.wrap}>
    <AutoComplete
      value={debounce ? inputText : value}
      ref={(ee: any) => autoRef && autoRef(ee)}
      onChange={(value: string) => onInputChange(value)}
      {...props}
      // className={!!errorText ? styles.AutoCompleteError : ''}
    />
    {
      errorText && (<div className={styles.errorText}>{errorText}</div>)
    }
  </div>);
}

export default FAutoComplete;
