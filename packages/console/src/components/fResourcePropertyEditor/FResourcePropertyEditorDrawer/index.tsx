import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';

interface FResourcePropertyEditorDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData: {
    key: string;
    name: string;
    value: string;
    description: string;
  } | null;
  noneEditableFields?: Array<'key' | 'name' | 'value' | 'description'>;
  valueAcceptNull?: boolean;

  onOk?(data: {
    key: string;
    name: string;
    value: string;
    description: string;
  }): void;

  onClose?(): void;
}

interface FResourcePropertyEditorDrawerStates {
  visible: boolean;
  nameInput: string;
  nameInputError: string;
  keyInput: string;
  keyInputError: string;
  valueInput: string;
  valueInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
}

const initStates: FResourcePropertyEditorDrawerStates = {
  visible: true,
  nameInput: '',
  nameInputError: '',
  keyInput: '',
  keyInputError: '',
  valueInput: '',
  valueInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
};

function FResourcePropertyEditorDrawer({
                                         disabledKeys,
                                         disabledNames,
                                         defaultData,
                                         noneEditableFields = [],
                                         valueAcceptNull = false,
                                         onOk,
                                         onClose,
                                       }: FResourcePropertyEditorDrawerProps) {

  const [$state, $setState] = AHooks.useSetState<FResourcePropertyEditorDrawerStates>(initStates);
  // const [visible, set_visible] = React.useState<FResourcePropertyEditorDrawerStates['visible']>(initStates['visible']);
  // const [nameInput, set_nameInput] = React.useState<FResourcePropertyEditorDrawerStates['nameInput']>(initStates['nameInput']);
  // const [nameInputError, set_nameInputError] = React.useState<FResourcePropertyEditorDrawerStates['nameInputError']>(initStates['nameInputError']);
  // const [keyInput, set_keyInput] = React.useState<FResourcePropertyEditorDrawerStates['keyInput']>(initStates['keyInput']);
  // const [keyInputError, set_keyInputError] = React.useState<FResourcePropertyEditorDrawerStates['keyInputError']>(initStates['keyInputError']);
  // const [valueInput, set_valueInput] = React.useState<FResourcePropertyEditorDrawerStates['valueInput']>(initStates['valueInput']);
  // const [valueInputError, set_valueInputError] = React.useState<FResourcePropertyEditorDrawerStates['valueInputError']>(initStates['valueInputError']);
  // const [descriptionInput, set_descriptionInput] = React.useState<FResourcePropertyEditorDrawerStates['descriptionInput']>(initStates['descriptionInput']);
  // const [descriptionInputError, set_descriptionInputError] = React.useState<FResourcePropertyEditorDrawerStates['descriptionInputError']>(initStates['descriptionInputError']);

  async function initData() {
    // set_keyInput(defaultData?.key || '');
    // set_nameInput(defaultData?.name || '');
    // set_valueInput(defaultData?.value || '');
    // set_descriptionInput(defaultData?.description || '');
    if (!defaultData) {
      return;
    }
    $setState({
      keyInput: defaultData.key,
      nameInput: defaultData.name,
      valueInput: defaultData.value,
      descriptionInput: defaultData.description,
    });

    const params: Parameters<typeof FServiceAPI.Resource.getAttrsInfoByKey>[0] = {
      key: defaultData.key,
    };

    const { ret, errCode, msg, data } = await FServiceAPI.Resource.getAttrsInfoByKey(params);
    console.log(data, 'sd9iofjsdlifjljlkjl');
  }

  // console.log(valueAcceptNull, 'valueAcceptNullisdojfl asdiofjlk jlk')

  return (<FDrawer
    // title={defaultData ? '编辑基础属性' : '补充属性'}
    title={defaultData ? FI18n.i18nNext.t('resourceinfo_edit_title') : FI18n.i18nNext.t('resourceinfo_add_title')}
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
        // $setState(initStates);
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
        || (!valueAcceptNull && $state.valueInput === '') || $state.valueInputError !== ''}
        onClick={async () => {
          onOk && onOk({
            key: $state.keyInput,
            name: $state.nameInput,
            value: $state.valueInput,
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
    <Space
      size={20}
      direction='vertical'
      style={{ width: '100%' }}
    >

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'属性名称'} />*/}
          <FComponentsLib.FContentText
            style={{ fontSize: 12 }}
            type={'highlight'}
            text={FI18n.i18nNext.t('resourceinfo_add_input_name')}
          />
        </div>
        <div style={{ height: 5 }} />
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          // disabled={true}
          // placeholder={'输入属性名称'}
          placeholder={FI18n.i18nNext.t('resourceinfo_add_input_name_hint')}
          disabled={noneEditableFields.includes('name')}
          value={$state.nameInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入属性名称';
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
          $state.nameInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{$state.nameInputError}</div>
          </>)
        }
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>*/}
          {/*<FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'key'} />*/}
          <FComponentsLib.FContentText
            style={{ fontSize: 12 }}
            type={'highlight'}
            text={FI18n.i18nNext.t('resourceinfo_add_input_key')}
          />
        </div>
        <div style={{ height: 5 }} />
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          // disabled={true}
          // placeholder={'输入key'}
          placeholder={FI18n.i18nNext.t('resourceinfo_add_input_key_hint')}
          value={$state.keyInput}
          disabled={noneEditableFields.includes('key')}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入key';
            } else if (value.length > 20) {
              errorText = '不超过20个字符';
              // errorText = FI18n.i18nNext.t('alert_key_convention_key');
            } else if (disabledKeys.includes(value) && value !== defaultData?.key) {
              // errorText = '键不能重复';
              errorText = FI18n.i18nNext.t('alert_key_exist');
            } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              // console.log(FUtil.Regexp.CUSTOM_KEY, 'FUtil.Regexp.CUSTOM_KEY.test(value)')
              // errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
              errorText = FI18n.i18nNext.t('alert_naming_convention_key');
            }
            // set_keyInput(value);
            // set_keyInputError(errorText);
            $setState({
              keyInput: value,
              keyInputError: errorText,
            });
          }}
        />
        {
          $state.keyInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{$state.keyInputError}</div>
          </>)
        }
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText
            style={{ fontSize: 12 }}
            type={'highlight'}
            text={FI18n.i18nNext.t('resourceinfo_add_input_desc')}
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
          value={$state.descriptionInput}
          // errorText={resourceVersionEditorPage.basePDescriptionInputError}
          className={styles.input}
          disabled={noneEditableFields.includes('description')}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value.length > 50) {
              // errorText = '不超过50个字符';
              errorText = FI18n.i18nNext.t('alert_key_remark_length');
            }
            // onDescriptionInputChange && onDescriptionInputChange({
            //   value,
            //   errorText,
            // });
            // set_descriptionInput(value);
            // set_descriptionInputError(errorText);
            $setState({
              descriptionInput: value,
              descriptionInputError: errorText,
            });
          }}
          // placeholder={'输入属性说明'}
          placeholder={FI18n.i18nNext.t('resourceinfo_add_input_desc_hint')}
        />
        {
          $state.descriptionInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{$state.descriptionInputError}</div>
          </>)
        }
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>*/}
          {/*<FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'value'} />*/}
          <FComponentsLib.FContentText
            style={{ fontSize: 12 }}
            type={'highlight'}
            text={FI18n.i18nNext.t('resourceinfo_add_input_value')}
          />
        </div>
        <div style={{ height: 5 }} />
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          value={$state.valueInput}
          className={styles.input}
          disabled={noneEditableFields.includes('value')}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (!valueAcceptNull && value === '') {
              errorText = '输入value';
            } else if (value.length > 140) {
              // errorText = '不超过140个字符';
              errorText = FI18n.i18nNext.t('alert_custom_option_field');
            }
            // onValueInputChange && onValueInputChange({
            //   value,
            //   errorText,
            // });
            // set_valueInput(value);
            // set_valueInputError(errorText);
            $setState({
              valueInput: value,
              valueInputError: errorText,
            });
          }}
          // placeholder={'输入value'}
          placeholder={FI18n.i18nNext.t('resourceinfo_add_input_value_hint')}
        />
        {
          $state.valueInputError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{$state.valueInputError}</div>
          </>)
        }
      </div>


    </Space>
  </FDrawer>);
}

export default FResourcePropertyEditorDrawer;
