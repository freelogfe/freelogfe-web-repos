import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Input, Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';

interface FExhibitCustomInfoEditorDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData: {
    key: string;
    name: string;
    input: string;
    description: string;
  } | null;

  onOk?(data: {
    key: string;
    name: string;
    input: string;
    description: string;
  }): void;

  onClose?(): void;
}

interface FExhibitCustomInfoEditorDrawerStates {
  visible: boolean;
  pageState: 'loading' | 'loaded';
  nameInput: string;
  nameInputError: string;
  keyInput: string;
  keyInputError: string;
  inputInput: string;
  inputInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
}

const initStates: FExhibitCustomInfoEditorDrawerStates = {
  visible: true,
  pageState: 'loading',
  nameInput: '',
  nameInputError: '',
  keyInput: '',
  keyInputError: '',
  inputInput: '',
  inputInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
};

function FExhibitCustomInfoEditorDrawer({
                                          disabledKeys,
                                          disabledNames,
                                          defaultData,
                                          onOk,
                                          onClose,
                                        }: FExhibitCustomInfoEditorDrawerProps) {

  const [$state, $setState] = AHooks.useSetState<FExhibitCustomInfoEditorDrawerStates>(initStates);

  function initData() {
    if (!defaultData) {
      $setState({
        pageState: 'loaded',
      });
      return;
    }

    $setState({
      pageState: 'loaded',
      keyInput: defaultData.key,
      nameInput: defaultData.name,
      inputInput: defaultData.input,
      descriptionInput: defaultData.description,
    });
  }

  return (<FDrawer
    title={defaultData
      // ? '编辑自定义信息'
      ? FI18n.i18nNext.t('add_customdata_title')
      : '添加自定义信息'}
    onClose={() => {
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
      >{FI18n.i18nNext.t('add_customdata_btn_cancel')}</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type='primary'
        disabled={$state.nameInputError !== ''
        || $state.keyInput === '' || $state.keyInputError !== ''
        || $state.descriptionInputError !== ''
        || ($state.inputInputError !== '')}
        onClick={async () => {
          onOk && onOk({
            key: $state.keyInput,
            name: $state.nameInput,
            input: $state.inputInput,
            description: $state.descriptionInput,
          });
          $setState({
            visible: false,
          });
        }}
      >{FI18n.i18nNext.t('add_customdata_btn_submit')}</FComponentsLib.FRectBtn>
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
              text={FI18n.i18nNext.t('add_customdata_input_name_hint')}
            />
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            placeholder={FI18n.i18nNext.t('add_customdata_input_name_hint')}
            value={$state.nameInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              // if (value === '') {
              //   errorText = '请输入名称';
              // } else
              if (value.length > 50) {
                errorText = FI18n.i18nNext.t('alert_naming_convention_attribute_name');
              } else if (disabledNames.includes(value) && value !== defaultData?.name) {
                errorText = '名称不能重复';
              }
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
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              // text={'key'}
              text={FI18n.i18nNext.t('add_customdata_input_key')}
            />

            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'additional2'}
              text={'（必填）'}
            />
          </div>
          <div style={{ height: 5 }} />
          <Input
            // prefix={(<FComponentsLib.FContentText
            //   type={'normal'}
            //   text={$keyPrefix}
            // />)}
            className={[styles.keyInput].join(' ')}
            placeholder={FI18n.i18nNext.t('add_customdata_input_key_hint')}
            value={$state.keyInput}
            onChange={(e) => {
              const value: string = e.target.value;
              const finalValue: string = value;
              let errorText: string = '';
              if (value === '') {
                errorText = '请输入key';
              } else if (finalValue.length > 20) {
                // errorText = FI18n.i18nNext.t('alert_key_convention_key');
                errorText = '不超过20个字符';
              } else if (disabledKeys.includes(finalValue) && finalValue !== defaultData?.key) {
                errorText = FI18n.i18nNext.t('alert_key_exist');
              } else if (!FUtil.Regexp.CUSTOM_KEY.test(finalValue)) {
                errorText = FI18n.i18nNext.t('alert_naming_convention_key');
              }
              $setState({
                keyInput: value,
                keyInputError: errorText,
              });
            }}
          />
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
              text={FI18n.i18nNext.t('add_customdata_input_desc')}
            />
            {/*<FComponentsLib.FContentText*/}
            {/*  style={{ fontSize: 12 }}*/}
            {/*  type={'additional2'}*/}
            {/*  text={FI18n.i18nNext.t('form_input_label_optional')}*/}
            {/*/>*/}
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={$state.descriptionInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value.length > 50) {
                errorText = FI18n.i18nNext.t('alert_key_remark_length');
              }
              $setState({
                descriptionInput: value,
                descriptionInputError: errorText,
              });
            }}
            placeholder={FI18n.i18nNext.t('add_customdata_input_desc_hint')}
          />
          {
            $state.descriptionInputError !== '' && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.descriptionInputError}</div>
            </>)
          }
        </div>

        <div className={styles.optionItem}>
          <div className={styles.title}>
            <FComponentsLib.FContentText
              style={{ fontSize: 12 }}
              type={'highlight'}
              text={FI18n.i18nNext.t('add_customdata_input_value')}
            />
            {/*<FComponentsLib.FContentText*/}
            {/*  style={{ fontSize: 12 }}*/}
            {/*  type={'additional2'}*/}
            {/*  text={FI18n.i18nNext.t('form_input_label_optional')}*/}
            {/*/>*/}
          </div>
          <div style={{ height: 5 }} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={$state.inputInput}
            className={styles.input}
            onChange={(e) => {
              const value: string = e.target.value;
              let errorText: string = '';
              if (value.length > 140) {
                errorText = '不超过140个字符';
              }
              $setState({
                inputInput: value,
                inputInputError: errorText,
              });
            }}
            placeholder={FI18n.i18nNext.t('add_customdata_input_value_hint')}
          />
          {
            $state.inputInputError !== '' && (<>
              <div style={{ height: 5 }} />
              <div className={styles.errorTip}>{$state.inputInputError}</div>
            </>)
          }
        </div>

      </Space>)
    }

  </FDrawer>);
}

export default FExhibitCustomInfoEditorDrawer;

// function verifyDuplication(selectInputs: FResourceOptionEditorDrawerStates['selectInputs']): FResourceOptionEditorDrawerStates['selectInputs'] {
//   const map: Map<string, number> = new Map<string, number>();
//   for (const item of selectInputs) {
//     if (item.value === '') {
//       continue;
//     }
//     map.set(item.value, (map.get(item.value) || 0) + 1);
//   }
//   // const errorText: string = '不能重复';
//   const errorText: string = FI18n.i18nNext.t('alert_cutstom_option_value_exist');
//
//   return selectInputs.map<FResourceOptionEditorDrawerStates['selectInputs'][number]>((d) => {
//     if (d.error !== '' && d.error !== errorText) {
//       return d;
//     }
//     return {
//       ...d,
//       error: (map.get(d.value) || 0) > 1 ? errorText : '',
//     };
//   });
// }
