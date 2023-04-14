import * as React from 'react';
import styles from './index.less';
import { Cascader, Dropdown } from 'antd';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

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

interface FResourceTypeInputProps {
  value: Array<string | number>;
  useKey?: 'code' | 'name';

  onChange?(value: FResourceTypeInputProps['value'], selectedOptions: Option[]): void;
}

function FResourceTypeInput({ value, useKey = 'code', onChange }: FResourceTypeInputProps) {

  const [options, set_options] = React.useState<Option[]>([]);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    const options: Option[] = handledData(data_resourceTypes, useKey);
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  return (<div className={styles.square}>
    <span>选择类型</span>
    <FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />
  </div>);

  // return (<Cascader
  //   allowClear={true}
  //   value={value}
  //   options={options}
  //   onChange={(value: Array<string | number> | undefined, selectedOptions) => {
  //     // console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
  //     if (!value) {
  //       onChange && onChange([], []);
  //       return;
  //     }
  //     onChange && onChange(value, selectedOptions as Option[]);
  //   }}
  //   placeholder='Please select'
  // />);
}

export default FResourceTypeInput;


function handledData(data: ServerData[], useKey: 'code' | 'name'): Option[] {
  return data.map((d) => {
    return {
      value: d[useKey],
      label: d.name,
      children: handledData(d.children, useKey),
    };
  });
}

export async function codeToCodes(code: string): Promise<Option[]> {
  const { data: data_resourceTypes }: {
    data: ServerData[];
  } = await FServiceAPI.Resource.resourceTypes();
  const arr: Option[] = [];
  ha(code, data_resourceTypes, arr);
  return arr;
}

function ha(code: string, data: ServerData[], payload: Option[]) {
  const da: ServerData | undefined = data.find((d) => {
    return code.startsWith(d.code);
  });
  if (!da) {
    return;
  }
  payload.push({
    value: da.code,
    label: da.name,
  });
  ha(code, da.children, payload);
}
