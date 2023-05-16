import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import Property from './Property';
import FComponentsLib from '@freelog/components-lib';

export interface Data {
  key: string;
  keyError: string;
  name: string;
  nameError: string;
  description: string;
  descriptionError: string;
  type: 'input' | 'select';
  input: string;
  inputError: string;
  select: {
    value: string;
    error: string;
  }[];
}

export interface FCustomOptionsProps {
  dataSource: Data[];
  disabledKeys: string[];
  disabledNames: string[];
  hideTypeSelect?: boolean;

  onChange?(dataSource: FCustomOptionsProps['dataSource']): void;
}

function FCustomOptions({
                          dataSource,
                          disabledKeys,
                          disabledNames,
                          hideTypeSelect = false,
                          onChange,
                        }: FCustomOptionsProps) {

  function onChangeProperty(value: Data, index: number) {
    // console.log(value, 'value38920jdskfj');
    const data: Data[] = dataSource.map((i, j) => {
      if (index !== j) {
        return i;
      }
      return value;
    });

    return onChange && onChange(verifyDuplication(data, disabledKeys, disabledNames));
  }

  return (<>
    {
      dataSource.length > 0 && <Space
        className={styles.styles}
        size={30}
        direction='vertical'
      >
        {
          dataSource.map((i, j) => (<div
            className={styles.item}
            key={j}
          >
            <div>
              <Property
                data={i}
                hideTypeSelect={hideTypeSelect}
                onChange={(value) => onChangeProperty(value, j)}
              />
            </div>
            <div style={{ width: 30, flexShrink: 0 }} />
            <FComponentsLib.FCircleBtn
              type='danger'
              onClick={() => {
                const data: Data[] = dataSource.filter((ds, index) => index !== j);
                onChange && onChange(verifyDuplication(data, disabledKeys, disabledNames));
              }}
            />
          </div>))
        }
      </Space>}
  </>);
}

export default FCustomOptions;

function verifyDuplication(data: Data[], disabledKeys: string[], disabledNames: string[]) {
  const keyMap: Map<string, number> = new Map<string, number>(disabledKeys.map((dk) => {
    return [dk, 1];
  }));

  const nameMap: Map<string, number> = new Map<string, number>(disabledNames.map((dk) => {
    return [dk, 1];
  }));

  for (const item of data) {
    if (item.key === '') {
      continue;
    }
    if (keyMap.has(item.key)) {
      keyMap.set(item.key, keyMap.get(item.key) as number + 1);
    } else {
      keyMap.set(item.key, 1);
    }
  }

  for (const item of data) {
    if (item.name === '') {
      continue;
    }
    if (nameMap.has(item.name)) {
      nameMap.set(item.name, nameMap.get(item.name) as number + 1);
    } else {
      nameMap.set(item.name, 1);
    }
  }

  const keyErrorText: string = '键不能重复';
  const nameErrorText: string = '名称不能重复';

  return data
    .map<Data>((d) => {
      if (d.keyError && d.keyError !== keyErrorText) {
        return d;
      }
      // console.log(d.key, map.get(d.key), '9812347928137');
      return {
        ...d,
        keyError: (keyMap.has(d.key) && keyMap.get(d.key) !== 1) ? keyErrorText : '',
      };
    })
    .map<Data>((d) => {
      if (d.nameError && d.nameError !== nameErrorText) {
        return d;
      }
      // console.log(d.key, map.get(d.key), '9812347928137');
      return {
        ...d,
        nameError: (nameMap.has(d.name) && nameMap.get(d.name) !== 1) ? nameErrorText : '',
      };
    })
    .map<Data>((d) => {
      return {
        ...d,
        select: verifyDuplicationOptions(d.select),
      };
    });
}

function verifyDuplicationOptions(selectInputs: Data['select']): Data['select'] {
  const map: Map<string, number> = new Map<string, number>();
  for (const item of selectInputs) {
    if (item.value === '') {
      continue;
    }
    map.set(item.value, (map.get(item.value) || 0) + 1);
  }
  const errorText: string = '不能重复';

  return selectInputs.map<Data['select'][number]>((d) => {
    if (d.error !== '' && d.error !== errorText) {
      return d;
    }
    return {
      ...d,
      error: (map.get(d.value) || 0) > 1 ? errorText : '',
    };
  });
}

