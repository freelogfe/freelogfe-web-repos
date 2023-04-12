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
  hideTypeSelect?: boolean;

  onChange?(dataSource: FCustomOptionsProps['dataSource']): void;
}

function FCustomOptions({ dataSource, disabledKeys, hideTypeSelect = false, onChange }: FCustomOptionsProps) {

  function onChangeProperty(value: Data, index: number) {
    // console.log(value, 'value38920jdskfj');
    const data: Data[] = dataSource.map((i, j) => {
      if (index !== j) {
        return i;
      }
      return value;
    });

    return onChange && onChange(verifyDuplication(data, disabledKeys));
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
                onChange && onChange(verifyDuplication(data, disabledKeys));
              }}
            />
          </div>))
        }
      </Space>}
  </>);
}

export default FCustomOptions;

function verifyDuplication(data: Data[], disabledKeys: string[]) {
  const map: Map<string, number> = new Map<string, number>(disabledKeys.map((dk) => {
    return [dk, 1];
  }));
  for (const item of data) {
    if (item.key === '') {
      continue;
    }
    if (map.has(item.key)) {
      map.set(item.key, map.get(item.key) as number + 1);
    } else {
      map.set(item.key, 1);
    }
  }
  const errorText: string = '键不能重复';

  return data.map<Data>((d) => {
    if (d.keyError && d.keyError !== errorText) {
      return d;
    }
    // console.log(d.key, map.get(d.key), '9812347928137');
    return {
      ...d,
      keyError: (map.has(d.key) && map.get(d.key) !== 1) ? errorText : '',
    };
  });
}
