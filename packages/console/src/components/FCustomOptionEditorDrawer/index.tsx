import * as React from 'react';
import styles from './index.less';
import { Space, Row, Col } from 'antd';
import FDrawer from '../FDrawer';
import FInput from '../FInput';
import FSelect from '../FSelect';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface FCustomOptionEditorDrawerProps {
  visible: boolean;
  dataSource: {
    key: string;
    value: string;
    description: string;
    valueType: 'input' | 'select';
  };
  disabledKeys?: string[];
  disabledKeyInput?: boolean;
  disabledValueTypeSelect?: boolean;
  hideValueTypeSelect?: boolean;

  onCancel?(): void;

  onConfirm?(value: FCustomOptionEditorDrawerProps['dataSource']): void;
}

interface FCustomOptionEditorDrawerStates {
  keyInput: string;
  keyInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
  valueTypeSelect: 'input' | 'select';
  valueInput: string;
  valueInputError: string;
}

const initState: FCustomOptionEditorDrawerStates = {
  keyInput: '',
  keyInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
  valueTypeSelect: 'input',
  valueInput: '',
  valueInputError: '',
};

function FCustomOptionEditorDrawer({
                                     // isLocking = false,
                                     visible,
                                     dataSource,
                                     disabledKeys = [],
                                     disabledKeyInput = false,
                                     disabledValueTypeSelect = false,
                                     hideValueTypeSelect = false,
                                     onCancel,
                                     onConfirm,
                                   }: FCustomOptionEditorDrawerProps) {

  const [keyInput, setKeyInput] = React.useState<FCustomOptionEditorDrawerStates['keyInput']>(initState['keyInput']);
  const [keyInputError, setKeyInputError] = React.useState<FCustomOptionEditorDrawerStates['keyInputError']>(initState['keyInputError']);
  const [descriptionInput, setDescriptionInput] = React.useState<FCustomOptionEditorDrawerStates['descriptionInput']>(initState['descriptionInput']);
  const [descriptionInputError, setDescriptionInputError] = React.useState<FCustomOptionEditorDrawerStates['descriptionInputError']>(initState['descriptionInputError']);
  const [valueTypeSelect, setValueTypeSelect] = React.useState<FCustomOptionEditorDrawerStates['valueTypeSelect']>(initState['valueTypeSelect']);
  const [valueInput, setValueInput] = React.useState<FCustomOptionEditorDrawerStates['valueInput']>(initState['valueInput']);
  const [valueInputError, setValueInputError] = React.useState<FCustomOptionEditorDrawerStates['valueInputError']>(initState['valueInputError']);

  function onVisible_Drawer() {
    setKeyInput(dataSource.key);
    setDescriptionInput(dataSource.description);
    setValueTypeSelect(dataSource.valueType);
    setValueInput(dataSource.value);
  }

  function onInvisible_Drawer() {
    setKeyInput(initState['keyInput']);
    setKeyInputError(initState['keyInputError']);
    setDescriptionInput(initState['descriptionInput']);
    setDescriptionInputError(initState['descriptionInputError']);
    setValueTypeSelect(initState['valueTypeSelect']);
    setValueInput(initState['valueInput']);
    setValueInputError(initState['valueInputError']);
  }

  return (<FDrawer
      title={'编辑自定义属性'}
      onClose={() => {
        onCancel && onCancel();
      }}
      open={visible}
      width={720}
      afterOpenChange={(visible) => {
        if (visible) {
          onVisible_Drawer();
        } else {
          onInvisible_Drawer();
        }
      }}
      topRight={<Space size={30}>
        <FComponentsLib.FTextBtn
          type='default'
          onClick={() => {
            onCancel && onCancel();
          }}
        >取消</FComponentsLib.FTextBtn>
        <FComponentsLib.FRectBtn
          type='primary'
          disabled={keyInput === '' || keyInputError !== ''
          || descriptionInputError !== ''
          || (valueTypeSelect === 'select' && valueInput === '')
          || valueInputError !== ''}
          onClick={() => {
            onConfirm && onConfirm({
              key: keyInput,
              value: valueInput,
              description: descriptionInput,
              valueType: valueTypeSelect,
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
              disabled={disabledKeyInput}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value === '') {
                  errorText = '请输入';
                } else if (value.length > 20) {
                  errorText = '不超过20个字符';
                } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                  errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                } else if (disabledKeys.includes(value)) {
                  errorText = '键不能重复';
                }
                setKeyInput(value);
                setKeyInputError(errorText);
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
                setDescriptionInput(value);
                setDescriptionInputError(errorText);
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
          {
            !hideValueTypeSelect && (<Col span={6}>
              <Space size={5}>
                <i className={styles.dot} />
                <FComponentsLib.FTitleText type='h4' text={'属性值输入方式'} />
              </Space>
              <div style={{ height: 5 }} />
              <FSelect
                className={styles.input}
                disabled={disabledValueTypeSelect}
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
                value={valueTypeSelect}
                onChange={(value) => {
                  setValueTypeSelect(value);
                }}
              />
            </Col>)
          }

          {
            valueTypeSelect === 'input' ? (<Col span={18}>
                <Space size={5}>
                  {/*<i className={styles.dot} />*/}
                  {/*<FTitleText type='h4' text={'自定义选项(填写一个默认值)'} />*/}
                  <FComponentsLib.FTitleText type='h4' text={'自定义选项'} />
                </Space>
                <div style={{ height: 5 }} />
                <FInput
                  className={styles.input}
                  wrapClassName={styles.input}
                  placeholder={'输入自定义选项'}
                  value={valueInput}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let errorText: string = '';
                    // if (value === '') {
                    //   errorText = '请输入';
                    // } else
                    if (value.length > 140) {
                      errorText = '不超过140个字符';
                    }
                    setValueInput(value);
                    setValueInputError(errorText);
                  }}
                />
                {
                  valueInputError && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>{valueInputError}</div>
                  </>)
                }
              </Col>)
              : (<Col span={18}>
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
                  value={valueInput}
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
                    setValueInput(value);
                    setValueInputError(errorText);
                  }}
                />
                {
                  valueInputError && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>{valueInputError}</div>
                  </>)
                }
              </Col>)
          }

        </Row>
      </div>
    </FDrawer>
  );
}

export default FCustomOptionEditorDrawer;
