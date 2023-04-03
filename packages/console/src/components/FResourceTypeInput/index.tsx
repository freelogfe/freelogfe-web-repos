import * as React from 'react';
import styles from './index.less';
import { Cascader } from 'antd';
import { DefaultOptionType } from 'rc-cascader/lib/Cascader';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '../../../../@freelog/tools-lib';

type Data = {
  value: string;
  valueError: string;
  // options: string[];
}[];

interface FResourceTypeInputProps {
  dataSource: Data;

  onChange?(value: Data): void;
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

function FResourceTypeInput({ dataSource, onChange }: FResourceTypeInputProps) {

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
    options={options}
    onChange={(value, selectedOptions) => {
      console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
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
