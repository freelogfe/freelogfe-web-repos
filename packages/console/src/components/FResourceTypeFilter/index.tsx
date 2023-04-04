import * as React from 'react';
import styles from './index.less';
import { Cascader } from 'antd';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';

interface FResourceTypeFilterProps {
  value: Array<string | number>;
  omitTheme?: boolean;

  onChange?(value: FResourceTypeFilterProps['value']): void;
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

function FResourceTypeFilter({ value, omitTheme = false, onChange }: FResourceTypeFilterProps) {

  const [options, set_options] = React.useState<Option[]>([]);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    let data: ServerData[] = data_resourceTypes;
    if (omitTheme) {
      data = data.filter((d) => {
        return d.name !== '主题';
      });
    }
    // console.log(data, 'dataiosdjflksdjfljl  dddddd');
    const options: Option[] = handledData(data);
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  return (<Cascader
    // allowClear={true}
    value={value}
    options={options}
    onChange={(value: Array<string | number>, selectedOptions) => {
      // console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
      onChange && onChange(value);
    }}
    placeholder='Please select'
  />);
}

export default FResourceTypeFilter;


function handledData(data: ServerData[]): Option[] {
  if (data.length === 0) {
    return [];
  }
  return [
    {
      value: '#all',
      label: '全部',
      children: [],
    },
    ...data.map((d) => {
      return {
        // value: d.code,
        value: d.name,
        label: d.name,
        children: handledData(d.children),
      };
    }),
  ];
}
