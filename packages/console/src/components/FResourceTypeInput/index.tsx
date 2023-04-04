import * as React from 'react';
import styles from './index.less';
import { Cascader } from 'antd';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';

interface FResourceTypeInputProps {
  value: Array<string | number>;

  onChange?(value: FResourceTypeInputProps['value']): void;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

interface ServerData {
  code: string;
  name: string;
  children: ServerData[];
}

function FResourceTypeInput({ value, onChange }: FResourceTypeInputProps) {

  const [options, set_options] = React.useState<Option[]>([]);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    const options: Option[] = handledData(data_resourceTypes);
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  return (<Cascader
    allowClear={true}
    value={value}
    options={options}
    onChange={(value: Array<string | number> | undefined, selectedOptions) => {
      // console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
      onChange && onChange(value || []);
    }}
    placeholder='Please select'
  />);
}

export default FResourceTypeInput;


function handledData(data: ServerData[]): Option[] {
  return data.map((d) => {
    return {
      value: d.code,
      label: d.name,
      children: handledData(d.children),
    };
  });
}
