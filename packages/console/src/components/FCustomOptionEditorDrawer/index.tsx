import * as React from 'react';
import styles from './index.less';
import {Space, Row, Col} from "antd";
import {FRectBtn, FTextBtn} from "../FButton";
import FDrawer from "../FDrawer";
import {FTitleText} from '@/components/FText';
import FInput from "@/components/FInput";
import FSelect from "@/components/FSelect";
import FUtil from "@/utils";

interface FCustomOptionEditorDrawerProps {
  visible?: boolean;
  keyInput: string;
  keyInputError: string;
  descriptionInput: string;
  descriptionInputError: string;
  typeSelect: 'input' | 'select';
  valueInput: string;
  valueInputError: string;
  optionsInput: string;
  optionsInputError: string;

  usedKeys?: string[];

  onKeyInputChange?(data: { value: string; errorText: string }): void;

  onDescriptionInputChange?(data: { value: string; errorText: string }): void;

  onSelectChange?(data: { value: 'input' | 'select' }): void;

  onValueInputChange?(data: { value: string; errorText: string }): void;

  onOptionsInputChange?(data: { value: string; errorText: string }): void;

  onCancel?(): void;

  onConfirm?(): void;
}

function FCustomOptionEditorDrawer({
                                     visible = false, onCancel, onConfirm, usedKeys,
                                     keyInput, keyInputError, descriptionInput, descriptionInputError, typeSelect, valueInput, valueInputError, optionsInput, optionsInputError,
                                     onKeyInputChange, onDescriptionInputChange, onSelectChange, onValueInputChange, onOptionsInputChange
                                   }: FCustomOptionEditorDrawerProps) {
  return (<FDrawer
      title={'编辑自定义属性'}
      onClose={() => {
        onCancel && onCancel();
      }}
      visible={visible}
      width={720}
      topRight={<Space size={30}>
        <FTextBtn
          type="default"
          onClick={() => {
            onCancel && onCancel();
          }}
        >取消</FTextBtn>
        <FRectBtn
          type="primary"
          disabled={!keyInput || !!keyInputError || !!descriptionInputError || (typeSelect === 'input' ? (!valueInput || !!valueInputError) : (!optionsInput || !!optionsInputError))}
          onClick={() => {
            onConfirm && onConfirm();
          }}
        >保存</FRectBtn>
      </Space>}
    >
      <div className={styles.option}>
        <Row gutter={10}>
          <Col span={12}>
            <Space size={5}>
              <i className={styles.dot}/>
              <FTitleText type="h4" text={'key'}/>
            </Space>
            <div style={{height: 5}}/>
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              placeholder={'输入key'}
              value={keyInput}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value === '') {
                  errorText = '请输入';
                } else if (value.length > 15) {
                  errorText = '不超过15个字符';
                } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
                  errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
                } else if (usedKeys?.includes(value)) {
                  errorText = '键不能重复';
                }
                onKeyInputChange && onKeyInputChange({
                  value,
                  errorText,
                });
              }}
            />

            {
              keyInputError && (<>
                <div style={{height: 5}}/>
                <div className={styles.errorTip}>{keyInputError}</div>
              </>)
            }
          </Col>
          <Col span={12}>
            <Space size={5}>
              <FTitleText type="h4" text={'属性说明'}/>
            </Space>
            <div style={{height: 5}}/>
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              placeholder={'输入属性说明'}
              value={descriptionInput}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value.length > 50) {
                  errorText = '不超过15个字符';
                }
                onDescriptionInputChange && onDescriptionInputChange({
                  value,
                  errorText,
                });
              }}
            />
            {
              descriptionInputError && (<>
                <div style={{height: 5}}/>
                <div className={styles.errorTip}>{descriptionInputError}</div>
              </>)
            }
          </Col>
        </Row>
        <div style={{height: 10}}/>
        <Row gutter={10}>
          <Col span={6}>
            <Space size={5}>
              <i className={styles.dot}/>
              <FTitleText type="h4" text={'属性值输入方式'}/>
            </Space>
            <div style={{height: 5}}/>
            <FSelect
              className={styles.input}
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
              value={typeSelect}
              onChange={(value) => {
                onSelectChange && onSelectChange({
                  value,
                });
              }}
            />
          </Col>
          {
            typeSelect === 'input' ? (<Col span={18}>
                <Space size={5}>
                  <i className={styles.dot}/>
                  <FTitleText type="h4" text={'自定义选项(填写一个默认值)'}/>
                </Space>
                <div style={{height: 5}}/>
                <FInput
                  className={styles.input}
                  wrapClassName={styles.input}
                  placeholder={'输入属性说明'}
                  value={valueInput}
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
                />
                {
                  valueInputError && (<>
                    <div style={{height: 5}}/>
                    <div className={styles.errorTip}>{valueInputError}</div>
                  </>)
                }
              </Col>)
              : (<Col span={18}>
                <Space size={5}>
                  <i className={styles.dot}/>
                  <FTitleText type="h4" text={'自定义选项(首个选项为默认值)'}/>
                </Space>
                <div style={{height: 5}}/>
                <FInput
                  className={styles.input}
                  wrapClassName={styles.input}
                  placeholder={'输入属性说明'}
                  value={optionsInput}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let errorText: string = '';
                    if (value === '') {
                      errorText = '请输入';
                    } else if (value.length > 50) {
                      errorText = '不超过15个字符';
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

                    onOptionsInputChange && onOptionsInputChange({
                      value,
                      errorText,
                    });
                  }}
                />
                {
                  optionsInputError && (<>
                    <div style={{height: 5}}/>
                    <div className={styles.errorTip}>{optionsInputError}</div>
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
