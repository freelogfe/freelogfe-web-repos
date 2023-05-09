import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import { FUtil } from '@freelog/tools-lib';

interface FEditFileBasePropDrawerProps {
  disabledKeys: string[];
  defaultData: {
    key: string;
    value: string;
    description: string;
  };

  onOk?(data: {
    key: string;
    value: string;
    description: string;
  }): void;

  onClose?(): void;
}

interface FEditFileBasePropDrawerStates {
  visible: boolean;
  keyInput: string;
  keyInputError: string;
  valueInput: string;
  valueInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
}

const initStates: FEditFileBasePropDrawerStates = {
  visible: true,
  keyInput: '',
  keyInputError: '',
  valueInput: '',
  valueInputError: '',
  descriptionInput: '',
  descriptionInputError: '',
};

function FEditFileBasePropDrawer({ disabledKeys, defaultData, onOk, onClose }: FEditFileBasePropDrawerProps) {

  const [visible, set_visible] = React.useState<FEditFileBasePropDrawerStates['visible']>(initStates['visible']);
  const [keyInput, set_keyInput] = React.useState<FEditFileBasePropDrawerStates['keyInput']>(initStates['keyInput']);
  const [keyInputError, set_keyInputError] = React.useState<FEditFileBasePropDrawerStates['keyInputError']>(initStates['keyInputError']);
  const [valueInput, set_valueInput] = React.useState<FEditFileBasePropDrawerStates['valueInput']>(initStates['valueInput']);
  const [valueInputError, set_valueInputError] = React.useState<FEditFileBasePropDrawerStates['valueInputError']>(initStates['valueInputError']);
  const [descriptionInput, set_descriptionInput] = React.useState<FEditFileBasePropDrawerStates['descriptionInput']>(initStates['descriptionInput']);
  const [descriptionInputError, set_descriptionInputError] = React.useState<FEditFileBasePropDrawerStates['descriptionInputError']>(initStates['descriptionInputError']);

  function initData() {
    set_keyInput(defaultData.key);
    set_valueInput(defaultData.value);
    set_descriptionInput(defaultData.description);
  }

  return (<FDrawer
    title={'编辑基础属性'}
    onClose={() => {
      set_visible(false);
    }}
    open={visible}
    width={720}
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
        disabled={!!keyInputError || !!valueInputError || !!descriptionInputError}
        onClick={async () => {
          onOk && onOk({
            key: keyInput,
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
          <i className={styles.dot} />
          <FComponentsLib.FTitleText type='h4'>key</FComponentsLib.FTitleText>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          // disabled={true}
          value={keyInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入';
            } else if (value.length > 15) {
              errorText = '不超过30个字符';
            } else if (disabledKeys.includes(value) && value !== defaultData.key) {
              errorText = '键不能重复';
            } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            }
            // onKeyInputChange && onKeyInputChange({
            //   value,
            //   errorText,
            // });
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
          <i className={styles.dot} />
          <FComponentsLib.FTitleText type='h4'>value</FComponentsLib.FTitleText>
        </div>
        <div style={{ height: 5 }} />
        <FInput
          value={valueInput}
          className={styles.input}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入';
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

      <div className={styles.input}>
        <div className={styles.title}>
          <FComponentsLib.FTitleText type='h4'>属性说明</FComponentsLib.FTitleText>
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
          placeholder={'输入属性说明'}
        />
        {descriptionInputError && (<>
          <div style={{ height: 5 }} />
          <div className={styles.errorTip}>{descriptionInputError}</div>
        </>)}
      </div>

    </Space>
  </FDrawer>);
}

export default FEditFileBasePropDrawer;
