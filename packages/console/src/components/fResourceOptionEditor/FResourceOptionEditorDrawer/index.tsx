import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Input, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';

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
  pageState: 'loading' | 'loaded';
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
  pageState: 'loading',
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

  const [$keyPrefix, set$keyPrefix, get$keyPrefix] = FUtil.Hook.useGetState<string>('options_');
  const [$state, $setState] = AHooks.useSetState<FResourceOptionEditorDrawerStates>(initStates);

  function initData() {
    if (!defaultData) {
      $setState({
        pageState: 'loaded',
        selectInputs: [
          {
            value: '',
            error: '',
          },
        ],
      });
      return;
    }

    $setState({
      pageState: 'loaded',
      keyInput: defaultData.key.replace(get$keyPrefix(), ''),
      nameInput: defaultData.name,
      typeSelect: defaultData.type,
      inputInput: defaultData.input,
      selectInputs: defaultData.select.map((s) => {
        return {
          value: s,
          error: '',
        };
      }),
      descriptionInput: defaultData.description,
    });
  }

  return (<FDrawer
    // title={defaultData ? '编辑配置' : '添加配置'}
    title={defaultData ? FI18n.i18nNext.t('resourceoptions_edit_title') : FI18n.i18nNext.t('resourceoptions_add_title')}
    onClose={() => {
      // set_visible(false);
      $setState({
        visible: false,
      });
    }}
    open={$state.visible}
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
          // set_visible(false);
          $setState({
            visible: false,
          });
        }}
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type='primary'
        disabled={$state.nameInput === '' || $state.nameInputError !== ''
        || $state.keyInput === '' || $state.keyInputError !== ''
        || $state.descriptionInputError !== ''
        || ($state.typeSelect === 'input' ? ($state.inputInputError !== '') : ($state.selectInputs.length === 0 || $state.selectInputs.some((si) => {
          return si.value === '' || si.error !== '';
        })))}
        onClick={async () => {
          onOk && onOk({
            key: get$keyPrefix() + $state.keyInput,
            name: $state.nameInput,
            type: $state.typeSelect,
            input: $state.typeSelect === 'input' ? $state.inputInput : '',
            select: $state.typeSelect === 'select'
              ? $state.selectInputs.map((s) => {
                return s.value;
              })
              : [],
            description: $state.descriptionInput,
          });
          // set_visible(false);
          $setState({
            visible: false,
          });
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
    </Space>}
  >

    {
      $state.pageState === 'loading' && (<FLoadingTip height={800} />)
    }

    {
      $state.pageState === 'loaded' && (<Space
        size={20}
        direction='vertical'
        style={{ width: '100%' }}
      >

        <div className={styles.optionItem}>
          <div className={styles.title}>
            {/*<FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置名称'} />*/}
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceoptions_add_input_name')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            // disabled={true}
            disabled={noneEditableFields.includes('name')}
            // placeholder={'输入配置名称'}
            placeholder={FI18n.i18nNext.t('resourceoptions_add_input_name_hint')}
            value={$state.nameInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value === '') {
                errorText = '请输入配置名称';
              } else if (value.length > 50) {
                // errorText = '不超过50个字符';
                errorText = FI18n.i18nNext.t('alert_naming_convention_attribute_name');
              } else if (disabledNames.includes(value) && value !== defaultData?.name) {
                errorText = '名称不能重复';
              }
              // else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              //   errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
              // }
              // set_nameInput(value);
              // set_nameInputError(errorText);
              $setState({
                nameInput: value,
                nameInputError: errorText,
              });
            }}
          />
          {
            $state.nameInputError !== '' && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.nameInputError}</div>
            </>)
          }
        </div>

        <div className={styles.optionItem}>
          <div className={styles.title}>
            {/*<i className={styles.dot} />*/}
            {/*<FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>*/}
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              // text={'key'}
              text={FI18n.i18nNext.t('resourceoptions_add_input_key')}
            />
          </div>
          <div style={{ height: 5 }} />
          <Input
            prefix={(<FComponentsLib.FContentText
              type={'normal'}
              text={$keyPrefix}
            />)}
            className={[styles.keyInput, noneEditableFields.includes('key') ? styles.grayBg : ''].join(' ')}
            disabled={noneEditableFields.includes('key')}
            placeholder={FI18n.i18nNext.t('resourceoptions_add_input_key_hint')}
            value={$state.keyInput}
            onChange={(e) => {
              const value: string = e.target.value;
              console.log(value, 'value sdfoijdslkfjsdlkfjlksdjflkjsdlkjfl');
              const finalValue: string = get$keyPrefix() + value;
              let errorText: string = '';
              if (value === '') {
                errorText = '请输入key';
              } else if (value.length > 20) {
                // errorText = FI18n.i18nNext.t('alert_key_convention_key');
                errorText = '不超过20个字符';
              } else if (disabledKeys.includes(finalValue) && finalValue !== defaultData?.key) {
                errorText = FI18n.i18nNext.t('alert_key_exist');
              } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                errorText = FI18n.i18nNext.t('alert_naming_convention_key');
              }
              console.log(errorText, 'errorTextsdifjsdlkfjlsdkjflkjlk');
              // set_keyInput(value);
              // set_keyInputError(errorText);
              $setState({
                keyInput: value,
                keyInputError: errorText,
              });
            }}
          />
          {/*<Space size={5}>*/}
          {/*  <FComponentsLib.FContentText*/}
          {/*    type={'normal'}*/}
          {/*    text={'options_'}*/}
          {/*  />*/}
          {/*  <FComponentsLib.FInput.FSingleLine*/}
          {/*    lengthLimit={-1}*/}
          {/*    disabled={noneEditableFields.includes('key')}*/}
          {/*    // placeholder={'输入key'}*/}
          {/*    placeholder={FI18n.i18nNext.t('resourceoptions_add_input_key_hint')}*/}
          {/*    value={$state.keyInput}*/}
          {/*    className={styles.input}*/}
          {/*    onChange={(e) => {*/}
          {/*      const value: string = e.target.value;*/}
          {/*      let errorText: string = '';*/}
          {/*      if (value === '') {*/}
          {/*        errorText = '请输入key';*/}
          {/*      } else if (value.length > 20) {*/}
          {/*        // errorText = FI18n.i18nNext.t('alert_key_convention_key');*/}
          {/*        errorText = '不超过20个字符';*/}
          {/*      } else if (disabledKeys.includes(value) && value !== defaultData?.key) {*/}
          {/*        errorText = FI18n.i18nNext.t('alert_key_exist');*/}
          {/*      } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {*/}
          {/*        errorText = FI18n.i18nNext.t('alert_naming_convention_key');*/}
          {/*      }*/}
          {/*      // set_keyInput(value);*/}
          {/*      // set_keyInputError(errorText);*/}
          {/*      $setState({*/}
          {/*        keyInput: value,*/}
          {/*        keyInputError: errorText,*/}
          {/*      });*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Space>*/}
          {
            $state.keyInputError !== '' && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.keyInputError}</div>
            </>)
          }
        </div>

        <div className={styles.optionItem}>
          <div className={styles.title}>
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('resourceoptions_add_input_desc')}
            />
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'additional2'}
              text={FI18n.i18nNext.t('form_input_label_optional')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            disabled={noneEditableFields.includes('description')}
            value={$state.descriptionInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value.length > 50) {
                // errorText = '不超过50个字符';
                errorText = FI18n.i18nNext.t('alert_key_remark_length');
              }
              // set_descriptionInput(value);
              // set_descriptionInputError(errorText);
              $setState({
                descriptionInput: value,
                descriptionInputError: errorText,
              });
            }}
            placeholder={FI18n.i18nNext.t('resourceoptions_add_input_desc_hint')}
          />
          {
            $state.descriptionInputError !== '' && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.descriptionInputError}</div>
            </>)
          }
        </div>

        {
          !hideTypeSelect && (<div className={styles.optionItem}>
            <div className={styles.title}>
              <FComponentsLib.FContentText
                style={{ fontSize: 12 }}
                type={'highlight'}
                text={FI18n.i18nNext.t('resourceoptions_add_input_type')}
              />
            </div>
            <div style={{ height: 5 }} />
            <div
              className={styles.typeSelect}
              style={{
                opacity: noneEditableFields.includes('type') ? .6 : 1,
              }}
            >
              <div
                className={[styles.typeSelect_option, $state.typeSelect === 'input' ? styles.active : ''].join(' ')}
                style={{
                  cursor: noneEditableFields.includes('type') ? 'not-allowed' : 'pointer',
                }}
                onClick={() => {
                  if (noneEditableFields.includes('type')) {
                    return;
                  }
                  // set_typeSelect('input');
                  $setState({
                    typeSelect: 'input',
                  });
                }}
              >{FI18n.i18nNext.t('resourceoptions_add_input_type_textfield')}</div>
              <div
                style={{
                  cursor: noneEditableFields.includes('type') ? 'not-allowed' : 'pointer',
                }}
                className={[styles.typeSelect_option, $state.typeSelect === 'select' ? styles.active : ''].join(' ')}
                onClick={() => {
                  if (noneEditableFields.includes('type')) {
                    return;
                  }
                  // set_typeSelect('select');
                  $setState({
                    typeSelect: 'select',
                  });
                }}
              >{FI18n.i18nNext.t('resourceoptions_add_input_type_dropdownlist')}
              </div>
            </div>
          </div>)
        }

        {
          $state.typeSelect === 'input' && (<div className={styles.optionItem}>
            <div className={styles.title}>
              <FComponentsLib.FContentText
                style={{ fontSize: 12 }}
                type={'highlight'}
                text={FI18n.i18nNext.t('resourceoptions_add_input_default')}
              />
              <FComponentsLib.FContentText
                style={{ fontSize: 12 }}
                type={'additional2'}
                text={FI18n.i18nNext.t('form_input_label_optional')}
              />
            </div>
            <div style={{ height: 5 }} />
            <FComponentsLib.FInput.FSingleLine
              lengthLimit={-1}
              value={$state.inputInput}
              className={styles.input}
              disabled={noneEditableFields.includes('input')}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value.length > 140) {
                  errorText = '不超过140个字符';
                }
                // set_inputInput(value);
                // set_inputInputError(errorText);
                $setState({
                  inputInput: value,
                  inputInputError: errorText,
                });
              }}
              placeholder={FI18n.i18nNext.t('resourceoptions_add_input_default_hint')}
            />
            {
              $state.inputInputError !== '' && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{$state.inputInputError}</div>
              </>)
            }
          </div>)
        }

        {
          $state.typeSelect === 'select' && (<div className={styles.optionItem}>
            <div className={styles.title}>
              <FComponentsLib.FContentText
                style={{ fontSize: 12 }}
                type={'highlight'}
                text={FI18n.i18nNext.t('resourceoptions_add_input_optionvalues')}
              />
              <FComponentsLib.FContentText
                style={{ fontSize: 12 }}
                type={'additional2'}
                text={FI18n.i18nNext.t('resourceoptions_add_optionvalues_info')}
              />
            </div>
            <div style={{ height: 5 }} />
            <Space size={8} direction={'vertical'} style={{ width: '100%' }}>
              {
                $state.selectInputs.map((si, i) => {
                  return (<div key={i}>
                    <Space size={12}>
                      <FComponentsLib.FInput.FSingleLine
                        lengthLimit={-1}
                        disabled={noneEditableFields.includes('select')}
                        value={si.value}
                        // className={styles.input}
                        style={{ width: 480 }}
                        onChange={(e) => {
                          const value: string = e.target.value;
                          let errorText: string = '';
                          if (value === '') {
                            errorText = '输入配置值';
                          } else if (value.length > 140) {
                            errorText = '不超过140个字符';
                          }
                          // set_selectInputs(verifyDuplication(selectInputs.map((a, b) => {
                          //   if (b !== i) {
                          //     return a;
                          //   }
                          //   return {
                          //     value: value,
                          //     error: errorText,
                          //   };
                          // })));
                          $setState({
                            selectInputs: verifyDuplication($state.selectInputs.map((a, b) => {
                              if (b !== i) {
                                return a;
                              }
                              return {
                                value: value,
                                error: errorText,
                              };
                            })),
                          });
                        }}
                        placeholder={FI18n.i18nNext.t('resourceoptions_add_input_optionvalues_hint')}
                      />
                      <FComponentsLib.FCircleBtn
                        type={'danger'}
                        onClick={() => {
                          // set_selectInputs(verifyDuplication(selectInputs.filter((a, b) => {
                          //   return b !== i;
                          // })));
                          $setState({
                            selectInputs: verifyDuplication($state.selectInputs.filter((a, b) => {
                              return b !== i;
                            })),
                          });
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
              $state.selectInputs.length < 30 && (<>
                <div style={{ height: 10 }} />
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                  onClick={() => {
                    // set_selectInputs([
                    //   ...$state.selectInputs,
                    //   {
                    //     value: '',
                    //     error: '',
                    //   },
                    // ]);
                    $setState({
                      selectInputs: [
                        ...$state.selectInputs,
                        {
                          value: '',
                          error: '',
                        },
                      ],
                    });
                  }}
                >
                  <FComponentsLib.FCircleBtn type={'primary'} size={'small'} />
                  <span style={{
                    color: '#2784FF',
                    fontSize: 12,
                  }}>{FI18n.i18nNext.t('resourceoptions_add_btn_addanothervalue')}</span>
                </div>
              </>)
            }

          </div>)
        }

      </Space>)
    }

  </FDrawer>);
}

export default FResourceOptionEditorDrawer;

function verifyDuplication(selectInputs: FResourceOptionEditorDrawerStates['selectInputs']): FResourceOptionEditorDrawerStates['selectInputs'] {
  const map: Map<string, number> = new Map<string, number>();
  for (const item of selectInputs) {
    if (item.value === '') {
      continue;
    }
    map.set(item.value, (map.get(item.value) || 0) + 1);
  }
  // const errorText: string = '不能重复';
  const errorText: string = FI18n.i18nNext.t('alert_cutstom_option_value_exist');

  return selectInputs.map<FResourceOptionEditorDrawerStates['selectInputs'][number]>((d) => {
    if (d.error !== '' && d.error !== errorText) {
      return d;
    }
    return {
      ...d,
      error: (map.get(d.value) || 0) > 1 ? errorText : '',
    };
  });
}
