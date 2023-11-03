import * as React from 'react';
import styles from './index.less';
import { OnChange_Authorize_AuthorizeInput_Action } from '@/models/contractPage';
import { AutoComplete } from 'antd';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';


interface AuthAutoCompleteProps {
  value: string;
  identityType: 1 | 2;
  prefixType: 1 | 2;

  onChange?(value: string): void;
}

function AuthAutoComplete({ value, onChange, identityType, prefixType }: AuthAutoCompleteProps) {

  const [$options, set$options, get$options] = FUtil.Hook.useGetState<{ label: string, value: string }[]>([]);

  AHooks.useDebounceEffect(() => {
    // keywordSuggest
    handleData();
  }, [value], {
    wait: 300,
  });

  async function handleData() {
    const { ret, errCode, data }: {
      ret: number;
      errCode: number;
      data: {
        suggest: string; count: number;
      }[];
    } = await FServiceAPI.Contract.keywordSuggest({
      identityType: identityType,
      prefixType: prefixType,
      prefix: value,
    });

    if (ret !== 0 || errCode !== 0) {
      set$options([]);
      return;
    }

    set$options(data.map((d) => {
      return { value: d.suggest, label: d.suggest };
    }));
  }

  return (<AutoComplete
    style={{ width: 340, height: 38 }}
    value={value}
    options={$options}
    onChange={(value) => {
      onChange && onChange(value);
      // dispatch<OnChange_Authorize_AuthorizeInput_Action>({
      //   type: 'contractPage/onChange_Authorize_AuthorizeInput',
      //   payload: {
      //     value: value,
      //   },
      // });
    }}
  />);
}

export default AuthAutoComplete;
