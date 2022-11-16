import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Col, Row, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FSelect from '@/components/FSelect';

interface FEditCustomOptionDrawerProps {
  disabledKeys: string[];
  defaultData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  };

  onOk?(data: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }): void;

  onClose?(): void;
}

interface FEditCustomOptionDrawerStates {
  visible: boolean;
  keyInput: string;
  keyInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
  custom: 'input' | 'select';
  defaultValue: string;
  defaultValueError: string;
  customOption: string;
  customOptionError: string;
}

const initStates: FEditCustomOptionDrawerStates = {
  visible: true,
  keyInput: '',
  keyInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
  custom: 'input',
  defaultValue: '',
  defaultValueError: '',
  customOption: '',
  customOptionError: '',
};

function FEditCustomOptionDrawer({ disabledKeys, defaultData, onClose, onOk }: FEditCustomOptionDrawerProps) {

  const [visible, set_visible] = React.useState<FEditCustomOptionDrawerStates['visible']>(initStates['visible']);
  const [keyInput, set_keyInput] = React.useState<FEditCustomOptionDrawerStates['keyInput']>(initStates['keyInput']);
  const [keyInputError, set_keyInputError] = React.useState<FEditCustomOptionDrawerStates['keyInputError']>(initStates['keyInputError']);
  const [descriptionInput, set_descriptionInput] = React.useState<FEditCustomOptionDrawerStates['descriptionInput']>(initStates['descriptionInput']);
  const [descriptionInputError, set_descriptionInputError] = React.useState<FEditCustomOptionDrawerStates['descriptionInputError']>(initStates['descriptionInputError']);
  const [custom, set_custom] = React.useState<FEditCustomOptionDrawerStates['custom']>(initStates['custom']);
  const [defaultValue, set_defaultValue] = React.useState<FEditCustomOptionDrawerStates['defaultValue']>(initStates['defaultValue']);
  const [defaultValueError, set_defaultValueError] = React.useState<FEditCustomOptionDrawerStates['defaultValueError']>(initStates['defaultValueError']);
  const [customOption, set_customOption] = React.useState<FEditCustomOptionDrawerStates['customOption']>(initStates['customOption']);
  const [customOptionError, set_customOptionError] = React.useState<FEditCustomOptionDrawerStates['customOptionError']>(initStates['customOptionError']);

  function initData() {
    set_keyInput(defaultData.key);
    set_descriptionInput(defaultData.description);
    set_custom(defaultData.custom);
    set_defaultValue(defaultData.defaultValue);
    set_customOption(defaultData.customOption);
  }

  return (<FDrawer
      title={'编辑自定义属性'}
      onClose={() => {
        set_visible(false);
      }}
      open={visible}
      width={720}
      afterOpenChange={(visible) => {
        if (visible) {
          initData();
        } else {
          onClose && onClose();
        }
      }}
      topRight={<Space size={30}>
        <FComponentsLib.FTextBtn
          type='default'
          onClick={() => {
            set_visible(false);
          }}
        >取消</FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          type='primary'
          disabled={keyInput === '' || keyInputError !== ''
          || descriptionInputError !== ''
          || (custom === 'input' && (defaultValue === '' || defaultValueError !== ''))
          || (custom === 'select' && (customOption === '' || customOptionError !== ''))}
          onClick={() => {
            // onConfirm && onConfirm({
            //   key: keyInput,
            //   value: valueInput,
            //   description: descriptionInput,
            //   valueType: valueTypeSelect,
            // });
            onOk && onOk({
              key: keyInput,
              description: descriptionInput,
              custom: custom,
              defaultValue: defaultValue,
              customOption: customOption,
            });
          }}
        >保存</FComponentsLib.FRectBtn>
      </Space>}
    >
      <div className={styles.option}>
        <Row gutter={10}>
          <Col span={12}>
            <Space size={5}>
              <i className={styles.dot} />
              <FComponentsLib.FTitleText type='h4' text={'key'} />
            </Space>
            <div style={{ height: 5 }} />
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              placeholder={'输入key'}
              value={keyInput}
              // disabled={disabledKeyInput}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value === '') {
                  errorText = '请输入';
                } else if (value.length > 15) {
                  errorText = '不超过15个字符';
                } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                  errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                } else if (disabledKeys.includes(value) && value !== defaultData.key) {
                  errorText = '键不能重复';
                }
                set_keyInput(value);
                set_keyInputError(errorText);
              }}
            />

            {
              keyInputError && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{keyInputError}</div>
              </>)
            }
          </Col>
          <Col span={12}>
            <Space size={5}>
              <FComponentsLib.FTitleText type='h4' text={'属性说明'} />
            </Space>
            <div style={{ height: 5 }} />
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              placeholder={'输入属性说明'}
              value={descriptionInput}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value.length > 50) {
                  errorText = '不超过50个字符';
                }
                set_descriptionInput(value);
                set_descriptionInputError(errorText);
              }}
            />
            {
              descriptionInputError && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{descriptionInputError}</div>
              </>)
            }
          </Col>
        </Row>
        <div style={{ height: 10 }} />
        <Row gutter={10}>
          <Col span={6}>
              <Space size={5}>
                <i className={styles.dot} />
                <FComponentsLib.FTitleText type='h4' text={'属性值输入方式'} />
              </Space>
              <div style={{ height: 5 }} />
              <FSelect
                className={styles.input}
                // disabled={disabledValueTypeSelect}
                dataSource={[
                  {
                    value: 'input',
                    title: '文本框',
                  },
                  {
                    value: 'select',
                    title: '下拉框',
                  },
                ]}
                value={custom}
                onChange={(value) => {
                  set_custom(value);
                }}
              />
            </Col>

          {
            custom === 'input' && (<Col span={18}>
              <Space size={5}>
                <FComponentsLib.FTitleText type='h4' text={'自定义选项'} />
              </Space>
              <div style={{ height: 5 }} />
              <FInput
                className={styles.input}
                wrapClassName={styles.input}
                placeholder={'输入自定义选项'}
                value={defaultValue}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let errorText: string = '';
                  // if (value === '') {
                  //   errorText = '请输入';
                  // } else
                  if (value.length > 140) {
                    errorText = '不超过140个字符';
                  }
                  set_defaultValue(value);
                  set_defaultValueError(errorText);
                }}
              />
              {
                descriptionInputError && (<>
                  <div style={{ height: 5 }} />
                  <div className={styles.errorTip}>{defaultValueError}</div>
                </>)
              }
            </Col>)
          }
          {
            custom === 'select' && (<Col span={18}>
                <Space size={5}>
                  <i className={styles.dot} />
                  <FComponentsLib.FTitleText type='h4' text={'自定义选项(首个选项为默认值)'} />
                </Space>
                <div style={{ height: 5 }} />
                <FInput
                  className={styles.input}
                  wrapClassName={styles.input}
                  // placeholder={'输入自定义选项'}
                  placeholder={FI18n.i18nNext.t('msg_customdropdownlist')}
                  value={customOption}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let errorText: string = '';
                    if (value === '') {
                      errorText = '请输入';
                    } else if (value.length > 50) {
                      errorText = '不超过50个字符';
                    } else if (value.split(',').length > 30) {
                      errorText = '不超过30个选项';
                    }

                    if (!errorText) {
                      const allOptions = value.split(',');
                      const setS = new Set(allOptions);
                      if (setS.size !== allOptions.length) {
                        errorText = '选项不能重复';
                      }
                    }
                    set_customOption(value);
                    set_customOptionError(errorText);
                  }}
                />
                {
                  customOptionError && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>{customOptionError}</div>
                  </>)
                }
              </Col>)
          }

        </Row>
      </div>
    </FDrawer>
  );
}

export default FEditCustomOptionDrawer;
