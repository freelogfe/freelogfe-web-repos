import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FUtil } from '@freelog/tools-lib';

interface FResourceOptionEditorDrawerProps {
  disabledKeys: string[];
  disabledNames: string[];
  defaultData: {
    key: string;
    name: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
    description: string;
  } | null;

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
    set_inputInput(defaultData?.input || 'input');
    set_selectInputs(defaultData?.select.map((s) => {
      return {
        value: s,
        error: '',
      };
    }) || []);
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
        || (typeSelect === 'input' ? (inputInput === '' || inputInputError !== '') : (selectInputs.some((si) => {
          return si.value === '' || si.error !== '';
        })))}
        onClick={async () => {
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

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置名称'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          // disabled={true}
          placeholder={'输入配置名称'}
          value={nameInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入配置名称';
            } else if (value.length > 15) {
              errorText = '不超过30个字符';
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
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '输入key';
            } else if (value.length > 15) {
              errorText = '不超过30个字符';
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
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置说明'} />
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'additional2'} text={'（选填）'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          value={descriptionInput}
          // errorText={resourceVersionEditorPage.basePDescriptionInputError}
          className={styles.input}
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
          placeholder={'输入配置说明'}
        />
        {descriptionInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{descriptionInputError}</div>
        </>)}
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'配置方式'} />
        </div>
        <div style={{ height: 5 }} />
        <div className={styles.typeSelect}>
          <div className={[styles.typeSelect_option, styles.active].join(' ')}>输入框</div>
          <div className={[styles.typeSelect_option].join(' ')}>下拉选择器</div>
        </div>
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          {/*<i className={styles.dot} />*/}
          {/*<FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>*/}
          <FComponentsLib.FContentText style={{ fontSize: 12 }} type={'highlight'} text={'value'} />
        </div>
        <div style={{ height: 5 }} />
        <FInput
          value={inputInput}
          className={styles.input}
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
            set_inputInput(value);
            set_inputInputError(errorText);
          }}
          placeholder={'输入value'}
        />
        {inputInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{inputInputError}</div>
        </>)}
      </div>


    </Space>
  </FDrawer>);
}

export default FResourceOptionEditorDrawer;