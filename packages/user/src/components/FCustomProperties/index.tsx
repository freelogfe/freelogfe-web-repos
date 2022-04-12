import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';
import Property from './Property';

export interface Data {
  key: string;
  keyError: string;
  description: string;
  descriptionError: string;
  custom: 'input' | 'select';
  defaultValue: string;
  defaultValueError: string;
  customOption: string;
  customOptionError: string;
}

export interface FCustomPropertiesProps {
  dataSource: Data[];
  disabledKeys: string[];

  onChange?(dataSource: FCustomPropertiesProps['dataSource']): void;
}

function FCustomProperties({dataSource, disabledKeys, onChange}: FCustomPropertiesProps) {

  function onChangeProperty(value: Data, index: number) {
    // console.log(value, 'value38920jdskfj');
    const data: Data[] = dataSource.map((i, j) => {
      if (index !== j) {
        return i;
      }
      return value;
    });

    return onChange && onChange(verifyDuplication(data));
  }

  function verifyDuplication(data: Data[]) {
    const map: Map<string, number> = new Map<string, number>(disabledKeys.map((dk) => {
      return [dk, 1];
    }));
    for (const item of data) {
      if (item.key === '') {
        continue;
      }
      if (map.has(item.key)) {
        map.set(item.key, map.get(item.key) as number + 1)
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

  return (<>
    {
      dataSource.length > 0 && <Space
        className={styles.styles}
        size={15}
        direction="vertical"
      >
        {
          [
            ...dataSource.map((i, j) => (<div key={j}>
              <Property
                data={i}
                onChange={(value) => onChangeProperty(value, j)}
              />
              <div className={styles.delete}>
                <span onClick={() => {
                  const data: Data[] = dataSource.filter((ds, index) => index !== j);
                  onChange && onChange(verifyDuplication(data));
                }}>删除</span>
              </div>
            </div>))
          ].reverse()
        }
      </Space>}
  </>);
}

export default FCustomProperties;
