import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import FInput from "../FInput";
import FDrawer from "../FDrawer";
import FComponentsLib from '@freelog/components-lib';

interface FBasePropEditorDrawerProps {
  visible?: boolean;
  keyInput: string;
  keyInputError: string;
  valueInput: string;
  valueInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
  usedKeys?: string[];

  onKeyInputChange?(data: { value: string; errorText: string }): void;

  onValueInputChange?(data: { value: string; errorText: string }): void;

  onDescriptionInputChange?(data: { value: string; errorText: string }): void;

  onCancel?(): void;

  onConfirm?(): void;
}

function FBasePropEditorDrawer({
                                 visible, onCancel, onConfirm,
                                 keyInput, keyInputError, valueInput, valueInputError, descriptionInput, descriptionInputError, usedKeys = [],
                                 onKeyInputChange, onValueInputChange, onDescriptionInputChange
                               }: FBasePropEditorDrawerProps) {
  return (<FDrawer
    title={'编辑基础属性'}
    onClose={() => {
      onCancel && onCancel();
    }}
    open={visible}
    width={720}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type="default"
        onClick={() => {
          onCancel && onCancel();
        }}
      >取消</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type="primary"
        disabled={!!keyInputError || !!valueInputError || !!descriptionInputError}
        onClick={async () => {
          onConfirm && onConfirm();
        }}
      >保存</FComponentsLib.FRectBtn>
    </Space>}
  >
    <Space
      size={20}
      direction="vertical"
      style={{width: '100%'}}
    >
      <div className={styles.input}>
        <div className={styles.title}>
          <i className={styles.dot}/>
          <FComponentsLib.FTitleText type="h4">key</FComponentsLib.FTitleText>
        </div>
        <div style={{height: 5}}/>
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
            } else if (usedKeys.includes(value)) {
              errorText = '键不能重复';
            }
            onKeyInputChange && onKeyInputChange({
              value,
              errorText,
            });
          }}
        />
        {keyInputError && (<>
          <div style={{height: 5}}/>
          <div className={styles.errorTip}>{keyInputError}</div>
        </>)}
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          <i className={styles.dot}/>
          <FComponentsLib.FTitleText type="h4">value</FComponentsLib.FTitleText>
        </div>
        <div style={{height: 5}}/>
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
            onValueInputChange && onValueInputChange({
              value,
              errorText,
            });
          }}
          placeholder={'输入value'}
        />
        {valueInputError && (<>
          <div style={{height: 5}}/>
          <div className={styles.errorTip}>{valueInputError}</div>
        </>)}
      </div>

      <div className={styles.input}>
        <div className={styles.title}>
          <FComponentsLib.FTitleText type="h4">属性说明</FComponentsLib.FTitleText>
        </div>
        <div style={{height: 5}}/>
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
            onDescriptionInputChange && onDescriptionInputChange({
              value,
              errorText,
            });
          }}
          placeholder={'输入属性说明'}
        />
        {descriptionInputError && (<>
          <div style={{height: 5}}/>
          <div className={styles.errorTip}>{descriptionInputError}</div>
        </>)}
      </div>

    </Space>
  </FDrawer>);
}

export default FBasePropEditorDrawer;
