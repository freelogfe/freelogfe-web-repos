import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FUtil } from '@freelog/tools-lib';

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
                                         onOk,
                                         onClose,
                                       }: FResourcePropertyEditorDrawerProps) {

  const [visible, set_visible] = React.useState<FResourcePropertyEditorDrawerStates['visible']>(initStates['visible']);
  const [nameInput, set_nameInput] = React.useState<FResourcePropertyEditorDrawerStates['nameInput']>(initStates['nameInput']);
  const [nameInputError, set_nameInputError] = React.useState<FResourcePropertyEditorDrawerStates['nameInputError']>(initStates['nameInputError']);
  const [keyInput, set_keyInput] = React.useState<FResourcePropertyEditorDrawerStates['keyInput']>(initStates['keyInput']);
  const [keyInputError, set_keyInputError] = React.useState<FResourcePropertyEditorDrawerStates['keyInputError']>(initStates['keyInputError']);
  const [valueInput, set_valueInput] = React.useState<FResourcePropertyEditorDrawerStates['valueInput']>(initStates['valueInput']);
  const [valueInputError, set_valueInputError] = React.useState<FResourcePropertyEditorDrawerStates['valueInputError']>(initStates['valueInputError']);
  const [descriptionInput, set_descriptionInput] = React.useState<FResourcePropertyEditorDrawerStates['descriptionInput']>(initStates['descriptionInput']);
  const [descriptionInputError, set_descriptionInputError] = React.useState<FResourcePropertyEditorDrawerStates['descriptionInputError']>(initStates['descriptionInputError']);

  function initData() {
    set_keyInput(defaultData?.key || '');
    set_nameInput(defaultData?.name || '');
    set_valueInput(defaultData?.value || '');
    set_descriptionInput(defaultData?.description || '');
  }

  return (<FDrawer
    title={defaultData ? '编辑基础属性' : '补充属性'}
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
        || valueInput === '' || valueInputError !== ''}
        onClick={async () => {
          onOk && onOk({
            key: keyInput,
            name: nameInput,
            value: valueInput,
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

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'属性名称'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          // disabled={true}
          placeholder={'输入属性名称'}
          disabled={noneEditableFields.includes('name')}
          value={nameInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入属性名称';
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

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'key'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          // disabled={true}
          placeholder={'输入key'}
          value={keyInput}
          disabled={noneEditableFields.includes('key')}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入key';
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

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'属性说明'} />
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'additional2'} text={'（选填）'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          value={descriptionInput}
          // errorText={resourceVersionEditorPage.basePDescriptionInputError}
          className={styles.input}
          disabled={noneEditableFields.includes('description')}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value.length > 50) {
              errorText = '不超过50个字符';
            }
            // onDescriptionInputChange && onDescriptionInputChange({
            //   value,
            //   errorText,
            // });
            set_descriptionInput(value);
            set_descriptionInputError(errorText);
          }}
          placeholder={'输入属性说明'}
        />
        {descriptionInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{descriptionInputError}</div>
        </>)}
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'value'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          value={valueInput}
          className={styles.input}
          disabled={noneEditableFields.includes('value')}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入value';
            } else if (value.length > 30) {
              errorText = '不超过30个字符';
            }
            // onValueInputChange && onValueInputChange({
            //   value,
            //   errorText,
            // });
            set_valueInput(value);
            set_valueInputError(errorText);
          }}
          placeholder={'输入value'}
        />
        {valueInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{valueInputError}</div>
        </>)}
      </div>


    </Space>
  </FDrawer>);
}

export default FResourcePropertyEditorDrawer;
