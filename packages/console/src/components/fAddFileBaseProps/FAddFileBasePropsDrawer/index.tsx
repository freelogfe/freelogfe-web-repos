import * as React from 'react';
import styles from './index.less';
import { ResourceVersionCreatorPageModelState } from '@/models/resourceVersionCreatorPage';
import FBasePropsEditorDrawer from '@/components/FBasePropsEditorDrawer';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FUtil } from '@freelog/tools-lib';

interface FAddFileBasePropsDrawerProps {
  disabledKeys: string[];
  defaultData?: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  onOk?(data: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[]): void;

  onClose?(): void;
}

interface FAddFileBasePropsDrawerStates {
  visible: boolean;
  dataSource: {
    key: string;
    keyError: string;
    name: string;
    nameError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];
}

const initStates: FAddFileBasePropsDrawerStates = {
  visible: true,
  dataSource: [{
    key: '',
    keyError: '',
    name: '',
    nameError: '',
    value: '',
    valueError: '',
    description: '',
    descriptionError: '',
  }],
};

function FAddFileBasePropsDrawer({ defaultData, disabledKeys, onOk, onClose }: FAddFileBasePropsDrawerProps) {

  const [visible, set_visible] = React.useState<FAddFileBasePropsDrawerStates['visible']>(initStates['visible']);
  const [dataSource, set_dataSource] = React.useState<FAddFileBasePropsDrawerStates['dataSource']>(initStates['dataSource']);

  function initData() {
    if (defaultData) {
      set_dataSource(defaultData.map<FAddFileBasePropsDrawerStates['dataSource'][number]>((cpd) => {
        return {
          key: cpd.key,
          keyError: disabledKeys.includes(cpd.key) ? '键不能重复' : '',
          name: cpd.name,
          nameError: '',
          value: cpd.value,
          valueError: '',
          description: cpd.description,
          descriptionError: '',
        };
      }));
    }
  }

  function onChangeData(value: Partial<FAddFileBasePropsDrawerStates['dataSource'][number]>, index: number) {
    const dd = dataSource.map((ds, i) => {
      if (i !== index) {
        return ds;
      }
      return {
        ...ds,
        ...value,
      };
    });
    set_dataSource(verifyDuplication(dd, disabledKeys));
  }

  // console.log(dataSource, 'dataSourceoikdsfldfjlk');
  return (<FDrawer
    title={'补充属性'}
    onClose={() => {
      set_visible(false);
    }}
    // visible={visible}
    open={visible}
    // afterVisibleChange={(vis) => {
    afterOpenChange={(vis) => {
      if (!vis) {
        onClose && onClose();
      } else {
        initData();
      }
    }}
    width={720}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          set_visible(false);
        }}
      >取消</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        disabled={dataSource.length === 0 || !!dataSource.find((eds) => {
          return !eds.key || !!eds.keyError
            || !eds.value || !!eds.valueError
            || !!eds.descriptionError;
        })}
        onClick={() => {
          onOk && onOk(dataSource.map((ds) => {
            return {
              key: ds.key,
              name: ds.name,
              value: ds.value,
              description: ds.description,
            };
          }));
          set_visible(false);
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
            <div className={styles.grid}>

              <div>
                <div className={styles.title}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4'>属性名称</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  value={ds.name}
                  errorText={ds.nameError}
                  className={styles.input}
                  wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let keyError: string = '';
                    if (value === '') {
                      keyError = '请输入名称';
                    } else if (value.length > 50) {
                      keyError = '不超过50个字符';
                    }
                    // else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                    //   keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                    // }
                    onChangeData({
                      name: value,
                      nameError: keyError,
                    }, index);
                  }}
                  placeholder={'输入属性说明'}
                />
              </div>

              <div>
                <div className={styles.title}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  value={ds.key}
                  errorText={ds.keyError}
                  className={styles.input}
                  wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let keyError: string = '';
                    if (value === '') {
                      keyError = '请输入key';
                    } else if (value.length > 20) {
                      keyError = '不超过20个字符';
                    } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                      keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                    }
                    onChangeData({
                      key: value,
                      keyError: keyError,
                    }, index);
                  }}
                  placeholder={'请输入key'}
                />
              </div>
              <div>
                <div className={styles.title}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  value={ds.value}
                  errorText={ds.valueError}
                  className={styles.input}
                  wrapClassName={styles.input}
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
              <div>
                <div className={styles.title}>
                  <FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FInput
                  value={ds.description}
                  errorText={ds.descriptionError}
                  className={styles.input}
                  wrapClassName={styles.input}
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

            </div>
            <div>
              <div style={{ height: 22 }} />
              <div className={styles.delete}>
                <FComponentsLib.FCircleBtn
                  type='danger'
                  onClick={() => {
                    set_dataSource(dataSource.filter((eds, edsIndex) => {
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
  </FDrawer>);
}

export default FAddFileBasePropsDrawer;

function verifyDuplication(data: FAddFileBasePropsDrawerStates['dataSource'], disabledKeys: string[]) {
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
