import * as React from 'react';
import styles from './index.less';
// import { ChangeAction, VerifyVersionInputAction } from '@/models/resourceVersionCreatorPage';
import FInput from '@/components/FInput';
import * as semver from 'semver';
// import { useGetState } from '@/utils/hooks';
import * as AHooks from 'ahooks';

interface VersionInputProps {
  value: string;
  resourceLatestVersion: string;

  onChange?(value: string): void;
}

interface VersionInputStates {
  input: string;
  inputError: string;
}

const initStates: VersionInputStates = {
  input: '',
  inputError: '',
};

function VersionInput({ value, resourceLatestVersion, onChange }: VersionInputProps) {
  const [input, set_input, get_input] = AHooks.useGetState<VersionInputStates['input']>(initStates['input']);
  const [inputError, set_inputError, get_inputError] = AHooks.useGetState<VersionInputStates['inputError']>(initStates['inputError']);

  React.useEffect(() => {
    // console.log(get_input(), value, 'value89888********88');
    if (get_input() === value) {
      return;
    }

    set_input(value);
    if (value !== '') {
      set_inputError('');
    }
  }, [value]);


  return (<FInput
    value={input}
    onChange={(e) => {
      const inputValue: string = e.target.value;
      // console.log(inputValue, resourceLatestVersion || '0.0.0', 'inputValue, resourceLatestVersioniusdfdll(((((((');
      let inputValueError: string = '';
      if (inputValue === '') {
        inputValueError = '请输入版本号';
      } else if (!semver.valid(inputValue)) {
        inputValueError = '版本号不合法';
      } else if (!semver.gt(inputValue, resourceLatestVersion || '0.0.0')) {
        inputValueError = !resourceLatestVersion ? '必须大于 0.0.0' : `必须大于最新版本 ${resourceLatestVersion}`;
      }
      set_input(inputValue);
      set_inputError(inputValueError);
      if (inputValue === '' || inputValueError === '') {
        onChange && onChange(inputValue);
      }
    }}
    className={styles.versionInput}
    errorText={inputError}
  />);
}

export default VersionInput;
