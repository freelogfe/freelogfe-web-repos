import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FUtil } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';

interface FResourceOptionEditorDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
  hideTypeSelect?: boolean;
  defaultData: {
    key: string;
    name: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
    description: string;
  } | null;
  noneEditableFields?: Array<'key' | 'name' | 'description' | 'type' | 'input' | 'select'>;

  onOk?(data: {
    key: string;
    name: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
    description: string;
  }): void;

  onClose?(): void;
}

interface FResourceOptionEditorDrawerStates {
  visible: boolean;
  nameInput: string;
  nameInputError: string;
  keyInput: string;
  keyInputError: string;
  typeSelect: 'input' | 'select';
  inputInput: string;
  inputInputError: string;
  selectInputs: {
    value: string;
    error: string;
  }[];
  descriptionInput: string;
  descriptionInputError: string;
}

const initStates: FResourceOptionEditorDrawerStates = {
  visible: true,
  nameInput: '',
  nameInputError: '',
  keyInput: '',
  keyInputError: '',
  typeSelect: 'input',
  inputInput: '',
  inputInputError: '',
  selectInputs: [],
  descriptionInput: '',
  descriptionInputError: '',
};

function FResourceOptionEditorDrawer({
                                       disabledKeys,
                                       disabledNames,
                                       defaultData,
                                       hideTypeSelect = false,
                                       noneEditableFields = [],
                                       onOk,
                                       onClose,
                                     }: FResourceOptionEditorDrawerProps) {

  const [visible, set_visible] = React.useState<FResourceOptionEditorDrawerStates['visible']>(initStates['visible']);
  const [nameInput, set_nameInput] = React.useState<FResourceOptionEditorDrawerStates['nameInput']>(initStates['nameInput']);
  const [nameInputError, set_nameInputError] = React.useState<FResourceOptionEditorDrawerStates['nameInputError']>(initStates['nameInputError']);
  const [keyInput, set_keyInput] = React.useState<FResourceOptionEditorDrawerStates['keyInput']>(initStates['keyInput']);
  const [keyInputError, set_keyInputError] = React.useState<FResourceOptionEditorDrawerStates['keyInputError']>(initStates['keyInputError']);
  const [typeSelect, set_typeSelect] = React.useState<FResourceOptionEditorDrawerStates['typeSelect']>(initStates['typeSelect']);
  const [inputInput, set_inputInput] = React.useState<FResourceOptionEditorDrawerStates['inputInput']>(initStates['inputInput']);
  const [inputInputError, set_inputInputError] = React.useState<FResourceOptionEditorDrawerStates['inputInputError']>(initStates['inputInputError']);
  const [selectInputs, set_selectInputs] = React.useState<FResourceOptionEditorDrawerStates['selectInputs']>(initStates['selectInputs']);
  const [descriptionInput, set_descriptionInput] = React.useState<FResourceOptionEditorDrawerStates['descriptionInput']>(initStates['descriptionInput']);
  const [descriptionInputError, set_descriptionInputError] = React.useState<FResourceOptionEditorDrawerStates['descriptionInputError']>(initStates['descriptionInputError']);

  function initData() {
    set_keyInput(defaultData?.key || '');
    set_nameInput(defaultData?.name || '');
    set_typeSelect(defaultData?.type || 'input');
    set_inputInput(defaultData?.input || '');
    set_selectInputs(defaultData?.select.map((s) => {
      return {
        value: s,
        error: '',
      };
    }) || [
      {
        value: '',
        error: '',
      },
    ]);
    set_descriptionInput(defaultData?.description || '');
  }

  return (<FDrawer
    title={defaultData ? '编辑配置' : '添加配置'}
    onClose={() => {
      set_visible(false);
    }}
    open={visible}
    width={580}
    afterOpenChange={(v) => {
      if (!v) {
        onClose && onClose();
      } else {
        initData();
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
        disabled={nameInput === '' || nameInputError !== ''
        || keyInput === '' || keyInputError !== ''
        || descriptionInputError !== ''
        || (typeSelect === 'input' ? (inputInputError !== '') : (selectInputs.some((si) => {
          return si.value === '' || si.error !== '';
        })))}
        onClick={async () => {

          if (typeSelect === 'select' && selectInputs.join(',').length > 500) {
            fMessage('自定义选项总长度不超过500个字符', 'error');
            return;
          }

          onOk && onOk({
            key: keyInput,
            name: nameInput,
            type: typeSelect,
            input: inputInput,
            select: selectInputs.map((s) => {
              return s.value;
            }),
            description: descriptionInput,
          });
          set_visible(false);
        }}
      >保存</FComponentsLib.FRectBtn>
    </Space>}
  >
    <Space
      size={20}
      direction='vertical'
      style={{ width: '100%' }}
    >

      <div className={styles.optionItem}>
        <div className={styles.title}>
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置名称'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          // disabled={true}
          disabled={noneEditableFields.includes('name')}
          placeholder={'输入配置名称'}
          value={nameInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入配置名称';
            } else if (value.length > 50) {
              errorText = '不超过50个字符';
            } else if (disabledNames.includes(value) && value !== defaultData?.name) {
              errorText = '名称不能重复';
            }
            // else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
            //   errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            // }
            set_nameInput(value);
            set_nameInputError(errorText);
          }}
        />
        {nameInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{nameInputError}</div>
        </>)}
      </div>

      <div className={styles.optionItem}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText
            style={{ fontSize: 12 }}
            type={'highlight'}
            text={'key'}
          />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          disabled={noneEditableFields.includes('key')}
          placeholder={'输入key'}
          value={keyInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入key';
            } else if (value.length > 20) {
              errorText = '不超过20个字符';
            } else if (disabledKeys.includes(value) && value !== defaultData?.key) {
              errorText = '键不能重复';
            } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            }
            set_keyInput(value);
            set_keyInputError(errorText);
          }}
        />
        {keyInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{keyInputError}</div>
        </>)}
      </div>

      <div className={styles.optionItem}>
        <div className={styles.title}>
          {/*<FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置说明'} />
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'additional2'} text={'（选填）'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          disabled={noneEditableFields.includes('description')}
          value={descriptionInput}
          // errorText={resourceVersionEditorPage.basePDescriptionInputError}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value.length > 50) {
              errorText = '不超过50个字符';
            }
            set_descriptionInput(value);
            set_descriptionInputError(errorText);
          }}
          placeholder={'输入配置说明'}
        />
        {descriptionInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{descriptionInputError}</div>
        </>)}
      </div>

      {
        !hideTypeSelect && (<div className={styles.optionItem}>
          <div className={styles.title}>
            <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置方式'} />
          </div>
          <div style={{ height: 5 }} />
          <div
            className={styles.typeSelect}
            style={{
              opacity: noneEditableFields.includes('type') ? .6 : 1,
            }}
          >
            <div
              className={[styles.typeSelect_option, typeSelect === 'input' ? styles.active : ''].join(' ')}
              style={{
                cursor: noneEditableFields.includes('type') ? 'not-allowed' : 'pointer',
              }}
              onClick={() => {
                if (noneEditableFields.includes('type')) {
                  return;
                }
                set_typeSelect('input');
              }}
            >输入框
            </div>
            <div
              style={{
                cursor: noneEditableFields.includes('type') ? 'not-allowed' : 'pointer',
              }}
              className={[styles.typeSelect_option, typeSelect === 'select' ? styles.active : ''].join(' ')}
              onClick={() => {
                if (noneEditableFields.includes('type')) {
                  return;
                }
                set_typeSelect('select');
              }}
            >下拉选择器
            </div>
          </div>
        </div>)
      }

      {
        typeSelect === 'input' && (<div className={styles.optionItem}>
          <div className={styles.title}>
            <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'默认值'} />
            <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'additional2'} text={'（选填）'} />
          </div>
          <div style={{ height: 5 }} />
          <FInput
            value={inputInput}
            className={styles.input}
            disabled={noneEditableFields.includes('input')}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              // if (value === '') {
              //   errorText = '输入value';
              // } else
              if (value.length > 140) {
                errorText = '不超过140个字符';
              }
              set_inputInput(value);
              set_inputInputError(errorText);
            }}
            placeholder={'输入value'}
          />
          {inputInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{inputInputError}</div>
          </>)}
        </div>)
      }

      {
        typeSelect === 'select' && (<div className={styles.optionItem}>
          <div className={styles.title}>
            <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'下拉选择器中的配置值'} />
          </div>
          <div style={{ height: 5 }} />
          <Space size={8} direction={'vertical'} style={{ width: '100%' }}>
            {
              selectInputs.map((si, i) => {
                return (<div key={i}>
                  <Space size={12}>
                    <FInput
                      disabled={noneEditableFields.includes('select')}
                      value={si.value}
                      // className={styles.input}
                      style={{ width: 480 }}
                      onChange={(e) => {
                        const value: string = e.target.value;
                        let errorText: string = '';
                        if (value === '') {
                          errorText = '输入配置值';
                        } else if (value.length > 500) {
                          errorText = '不超过500个字符';
                        }
                        set_selectInputs(selectInputs.map((a, b) => {
                          if (b !== i) {
                            return a;
                          }
                          return {
                            value: value,
                            error: errorText,
                          };
                        }));
                      }}
                      placeholder={'输入配置值'}
                    />
                    <FComponentsLib.FCircleBtn
                      type={'danger'}
                      onClick={() => {
                        set_selectInputs(selectInputs.filter((a, b) => {
                          return b !== i;
                        }));
                      }}
                    />
                  </Space>
                  {si.error && (<>
                    <div style={{ height: 5 }} />
                    <div className={styles.errorTip}>{si.error}</div>
                  </>)}
                </div>);
              })
            }
          </Space>
          {
            selectInputs.length < 30 && (<>
              <div style={{ height: 10 }} />
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                onClick={() => {
                  set_selectInputs([
                    ...selectInputs,
                    {
                      value: '',
                      error: '',
                    },
                  ]);
                }}
              >
                <FComponentsLib.FCircleBtn type={'primary'} size={'small'} />
                <span style={{ color: '#2784FF', fontSize: 12 }}>增加配置选项</span>
              </div>
            </>)
          }

        </div>)
      }

    </Space>
  </FDrawer>);
}

export default FResourceOptionEditorDrawer;
