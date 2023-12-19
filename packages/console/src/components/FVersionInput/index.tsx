import * as React from 'react';
import styles from './index.less';
import * as semver from 'semver';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';

interface VersionInputProps {
  value: string;
  resourceLatestVersion: string;

  onChange?(value: string): void;

  onChangeError?(hasError: boolean): void;
}

interface VersionInputStates {
  $isEdit: boolean;
  $input: string;
  $inputError: string;
}

const initStates: VersionInputStates = {
  $isEdit: false,
  $input: '',
  $inputError: '',
};

function VersionInput({ value, resourceLatestVersion, onChange, onChangeError }: VersionInputProps) {
  const [$isEdit, set$isEdit] = FUtil.Hook.useGetState<VersionInputStates['$isEdit']>(initStates['$isEdit']);
  const [$input, set$input, get$input] = FUtil.Hook.useGetState<VersionInputStates['$input']>(initStates['$input']);
  const [$inputError, set$inputError, get$inputError] = FUtil.Hook.useGetState<VersionInputStates['$inputError']>(initStates['$inputError']);

  return (<div className={styles.VersionInput}>

    {
      !$isEdit
        ? (<div className={styles.noEdit}>
          <FComponentsLib.FContentText text={`版本${value}`} type={'highlight'} />
          <FComponentsLib.FTextBtn
            type={'primary'}
            onClick={() => {
              set$input(value);
              set$inputError('');
              set$isEdit(true);
            }}
          >
            <FComponentsLib.FIcons.FEdit style={{ fontSize: 20 }} />
          </FComponentsLib.FTextBtn>
        </div>)
        : (<>
          <div className={styles.versionInput}>
            <FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$input}
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
                set$input(inputValue);
                set$inputError(inputValueError);
                onChangeError && onChangeError(inputValueError !== '');
                // if (inputValue === '' || inputValueError === '') {
                //   onChange && onChange(inputValue);
                // }
              }}
              className={styles.FInputFSingleLine}
              // errorText={inputError}
            />
            <div style={{ width: 20 }} />
            <FComponentsLib.FTextBtn
              type={'default'}
              style={{ fontSize: 12 }}
              onClick={() => {
                set$isEdit(false);
                onChangeError && onChangeError(false);
              }}
            >取消</FComponentsLib.FTextBtn>
            <div style={{ width: 10 }} />
            <FComponentsLib.FTextBtn
              type={'primary'}
              disabled={$inputError !== ''}
              style={{ fontSize: 12 }}
              onClick={() => {
                onChange && onChange(get$input());
                set$isEdit(false);
              }}
            >保存</FComponentsLib.FTextBtn>
          </div>
          <div style={{ height: 5 }} />
          <div className={styles.error}>{$inputError}</div>
        </>)
    }

  </div>);
}

export default VersionInput;
