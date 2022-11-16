import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FInput from '../FInput';
import FDrawer from '../FDrawer';
import { FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FBasePropsEditorDrawerProps {
  visible: boolean;
  dataSource: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];
  disabledKeys: string[];

  onChange?(value: FBasePropsEditorDrawerProps['dataSource']): void;

  onConfirm?(): void;

  onCancel?(): void;
}

function FBasePropsEditorDrawer({
                                  visible,
                                  dataSource,
                                  disabledKeys,
                                  onChange,
                                  onConfirm,
                                  onCancel,
                                }: FBasePropsEditorDrawerProps) {

  function onChangeData(value: Partial<FBasePropsEditorDrawerProps['dataSource'][number]>, index: number) {
    const dd = dataSource.map((ds, i) => {
      if (i !== index) {
        return ds;
      }
      return {
        ...ds,
        ...value,
      };
    });
    onChange && onChange(verifyDuplication(dd));
  }

  function verifyDuplication(data: FBasePropsEditorDrawerProps['dataSource']) {
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

    return data.map((d) => {
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

  return (<FDrawer
    title={'补充属性'}
    onClose={() => {
      onCancel && onCancel();
    }}
    open={visible}
    width={720}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          onCancel && onCancel();
        }}
      >取消</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        disabled={!!dataSource.find((eds) => {
          return !eds.key || !!eds.keyError
            || !eds.value || !!eds.valueError
            || !!eds.descriptionError;
        })}
        onClick={() => {
          onConfirm && onConfirm();
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
  >
    <Space
      size={30}
      direction='vertical'
      style={{ width: '100%' }}
    >
      {
        dataSource.map((ds, index) => {
          return (<Space key={index} size={10}>
            <div className={styles.input}>
              <div className={styles.title}>
                <i className={styles.dot} />
                <FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>
              </div>
              <div style={{ height: 5 }} />
              <FInput
                value={ds.key}
                errorText={ds.keyError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let keyError: string = '';
                  if (value === '') {
                    keyError = '请输入';
                  } else if (value.length > 15) {
                    keyError = '不超过15个字符';
                  } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                    keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                  }
                  onChangeData({
                    key: value,
                    keyError: keyError,
                  }, index);
                }}
                placeholder={'输入key'}
              />
            </div>
            <div className={styles.input}>
              <div className={styles.title}>
                <i className={styles.dot} />
                <FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>
              </div>
              <div style={{ height: 5 }} />
              <FInput
                value={ds.value}
                errorText={ds.valueError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let valueError: string = '';
                  if (value === '') {
                    valueError = '请输入';
                  } else if (value.length > 30) {
                    valueError = '不超过30个字符';
                  }
                  onChangeData({
                    value: value,
                    valueError: valueError,
                  }, index);
                }}
                placeholder={'输入value'}
              />
            </div>
            <div className={styles.input}>
              <div className={styles.title}>
                <FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>
              </div>
              <div style={{ height: 5 }} />
              <FInput
                value={ds.description}
                errorText={ds.descriptionError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let descriptionError: string = '';
                  if (value.length > 50) {
                    descriptionError = '不超过50个字符';
                  }
                  onChangeData({
                    description: value,
                    descriptionError: descriptionError,
                  }, index);
                }}
                placeholder={'输入属性说明'}
              />
            </div>
            <div>
              <div style={{ height: 22 }} />
              <div className={styles.delete}>
                <FComponentsLib.FCircleBtn
                  type='danger'
                  onClick={() => {
                    onChange && onChange(dataSource.filter((eds, edsIndex) => {
                      return edsIndex !== index;
                    }));
                  }}
                />
              </div>
            </div>
          </Space>);
        })
      }
    </Space>

    {
      dataSource.length > 0 && (<div style={{ height: 30 }} />)
    }

    <Space size={10}>
      <FComponentsLib.FCircleBtn
        size='small'
        onClick={() => {
          onChange && onChange([
            ...dataSource,
            {
              key: '',
              keyError: '',
              value: '',
              valueError: '',
              description: '',
              descriptionError: '',
            },
          ]);
        }}
      />
      <FComponentsLib.FContentText
        text={'新增一项属性'}
      />
    </Space>
  </FDrawer>);
}

export default FBasePropsEditorDrawer;
