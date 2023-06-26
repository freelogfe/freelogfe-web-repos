import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
// import FInput from '@/components/FInput';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface FAddFileBasePropsDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
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

function FAddFileBasePropsDrawer({
                                   defaultData,
                                   disabledKeys,
                                   disabledNames,
                                   onOk,
                                   onClose,
                                 }: FAddFileBasePropsDrawerProps) {

  const [visible, set_visible] = React.useState<FAddFileBasePropsDrawerStates['visible']>(initStates['visible']);
  const [dataSource, set_dataSource] = React.useState<FAddFileBasePropsDrawerStates['dataSource']>(initStates['dataSource']);

  function initData() {
    if (defaultData) {
      set_dataSource(defaultData.map<FAddFileBasePropsDrawerStates['dataSource'][number]>((cpd) => {
        return {
          key: cpd.key,
          keyError: disabledKeys.includes(cpd.key) ? FI18n.i18nNext.t('alert_key_exist') : '',
          name: cpd.name,
          nameError: disabledNames.includes(cpd.name) ? '名称不能重复' : '',
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
    set_dataSource(verifyDuplication(dd, disabledKeys, disabledNames));
  }

  // console.log(dataSource, 'dataSourceoikdsfldfjlk');
  return (<FDrawer
    title={FI18n.i18nNext.t('resourceinfo_add_title')}
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
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        disabled={dataSource.length === 0 || dataSource.some((eds) => {
          return eds.key === '' || eds.keyError !== ''
            || eds.name === '' || eds.nameError !== ''
            || eds.value === '' || eds.valueError !== ''
            || eds.descriptionError !== '';
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
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
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
                  <FComponentsLib.FTitleText type='h4'>{FI18n.i18nNext.t('resourceinfo_add_input_name')}</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={ds.name}
                  // errorText={ds.nameError}
                  className={styles.input}
                  // wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let keyError: string = '';
                    if (value === '') {
                      keyError = '输入属性名称';
                    } else if (value.length > 50) {
                      keyError = FI18n.i18nNext.t('alert_naming_convention_attribute_name');
                    }
                    // else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                    //   keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                    // }
                    onChangeData({
                      name: value,
                      nameError: keyError,
                    }, index);
                  }}
                  placeholder={FI18n.i18nNext.t('resourceinfo_add_input_name_hint')}
                />

                {
                  ds.nameError !== '' && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.error}>{ds.nameError}</div>
                  </>)
                }

              </div>

              <div>
                <div className={styles.title}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4'>{FI18n.i18nNext.t('resourceinfo_add_input_key')}</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={ds.key}
                  // errorText={ds.keyError}
                  className={styles.input}
                  // wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let keyError: string = '';
                    if (value === '') {
                      keyError = '请输入key';
                    } else if (value.length > 20) {
                      keyError = '不超过20个字符';
                    } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                      keyError = FI18n.i18nNext.t('alert_naming_convention_key');
                    }
                    onChangeData({
                      key: value,
                      keyError: keyError,
                    }, index);
                  }}
                  placeholder={FI18n.i18nNext.t('resourceinfo_add_input_key_hint')}
                />

                {
                  ds.keyError !== '' && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.error}>{ds.keyError}</div>
                  </>)
                }
              </div>
              <div>
                <div className={styles.title}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4'>{FI18n.i18nNext.t('resourceinfo_add_input_value')}</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={ds.value}
                  // errorText={ds.valueError}
                  className={styles.input}
                  // wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let valueError: string = '';
                    if (value === '') {
                      valueError = '请输入';
                    } else if (value.length > 140) {
                      valueError = FI18n.i18nNext.t('alert_custom_option_field');
                    }
                    onChangeData({
                      value: value,
                      valueError: valueError,
                    }, index);
                  }}
                  placeholder={FI18n.i18nNext.t('resourceinfo_add_input_value_hint')}
                />
                {
                  ds.valueError !== '' && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.error}>{ds.valueError}</div>
                  </>)
                }
              </div>
              <div>
                <div className={styles.title}>
                  <FComponentsLib.FTitleText type='h4'>{FI18n.i18nNext.t('resourceinfo_add_input_desc')}</FComponentsLib.FTitleText>
                </div>
                <div style={{ height: 5 }} />
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  value={ds.description}
                  // errorText={ds.descriptionError}
                  className={styles.input}
                  // wrapClassName={styles.input}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let descriptionError: string = '';
                    if (value.length > 50) {
                      descriptionError = FI18n.i18nNext.t('alert_key_remark_length');
                    }
                    onChangeData({
                      description: value,
                      descriptionError: descriptionError,
                    }, index);
                  }}
                  placeholder={FI18n.i18nNext.t('resourceinfo_add_input_desc_hint')}
                />

                {
                  ds.descriptionError !== '' && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.error}>{ds.descriptionError}</div>
                  </>)
                }
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

function verifyDuplication(data: FAddFileBasePropsDrawerStates['dataSource'], disabledKeys: string[], disabledNames: string[]) {
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
    .map((d) => {
      if (d.keyError && d.keyError !== keyErrorText) {
        return d;
      }
      // console.log(d.key, map.get(d.key), '9812347928137');
      return {
        ...d,
        keyError: (keyMap.has(d.key) && keyMap.get(d.key) !== 1) ? keyErrorText : '',
      };
    })
    .map((d) => {
      if (d.nameError && d.nameError !== nameErrorText) {
        return d;
      }
      // console.log(d.key, map.get(d.key), '9812347928137');
      return {
        ...d,
        nameError: (nameMap.has(d.name) && nameMap.get(d.name) !== 1) ? nameErrorText : '',
      };
    });
}

