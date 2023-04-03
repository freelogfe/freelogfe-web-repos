import * as React from 'react';
import styles from './index.less';
import { Col, Row, Space } from 'antd';
import FInput from '../../../FInput';
import FSelect from '../../../FSelect';
import { Data } from '../index';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface PropertyProps {
  data: Data;
  hideTypeSelect?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
}

function Property({ data, hideTypeSelect = false, onChange }: PropertyProps) {

  function onChangeData(kv: Partial<PropertyProps['data']>) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  return (<div className={styles.option}>
    <Row gutter={10}>
      <Col span={12}>
        <Space size={5}>
          <i className={styles.dot} />
          <FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('key')} />
        </Space>
        <div style={{ height: 5 }} />
        <FInput
          className={styles.input}
          wrapClassName={styles.input}
          placeholder={'输入key'}
          value={data.key}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value === '') {
              errorText = '请输入';
            } else if (value.length > 15) {
              errorText = '不超过15个字符';
            } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
              errorText = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
            }

            onChangeData({
              key: value,
              keyError: errorText,
            });
          }}

        />

        {
          data.keyError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{data.keyError}</div>
          </>)
        }
      </Col>
      <Col span={12}>
        <Space size={5}>
          <FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('property_remark')} />
        </Space>
        <div style={{ height: 5 }} />
        <FInput
          className={styles.input}
          wrapClassName={styles.input}
          placeholder={'输入属性说明'}
          value={data.description}
          onChange={(e) => {
            const value: string = e.target.value;
            let errorText: string = '';
            if (value.length > 50) {
              errorText = '不超过50个字符';
            }

            onChangeData({
              description: value,
              descriptionError: errorText,
            });
          }}
        />
        {
          data.descriptionError && (<>
            <div style={{ height: 5 }} />
            <div className={styles.errorTip}>{data.descriptionError}</div>
          </>)
        }
      </Col>
    </Row>
    <div style={{ height: 10 }} />
    <Row gutter={10}>
      {
        !hideTypeSelect && (<Col span={6}>
          <Space size={5}>
            <i className={styles.dot} />
            <FComponentsLib.FTitleText type='h4' text={FI18n.i18nNext.t('value_input_mode')} />
          </Space>
          <div style={{ height: 5 }} />
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
            value={data.custom}
            onChange={(value) => {
              onChangeData({ custom: value });
            }}
          />
        </Col>)
      }

      {
        data.custom === 'input' ? (<Col span={18}>
            <Space size={5}>
              {/*<i className={styles.dot} />*/}
              {/*<FTitleText type='h4' text={'自定义选项(填写一个默认值)'} />*/}
              <FComponentsLib.FTitleText
                type='h4'
                text={!hideTypeSelect ? '自定义选项' : FI18n.i18nNext.t('options_textfield_value_title')}
              />
            </Space>
            <div style={{ height: 5 }} />
            <FInput
              className={styles.input}
              wrapClassName={styles.input}
              placeholder={!hideTypeSelect ? '输入自定义选项' : FI18n.i18nNext.t('options_textfield_value_hint')}
              value={data.defaultValue}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                // if (value === '') {
                //   errorText = '请输入';
                // } else
                if (value.length > 140) {
                  errorText = '不超过140个字符';
                }
                onChangeData({
                  defaultValue: value,
                  defaultValueError: errorText,
                });
              }}
            />
            {
              data.defaultValueError && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{data.defaultValueError}</div>
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
              // placeholder={'输入属性说明'}
              placeholder={FI18n.i18nNext.t('msg_customdropdownlist')}
              value={data.customOption}
              onChange={(e) => {
                const value: string = e.target.value;
                let errorText: string = '';
                if (value === '') {
                  errorText = '请输入';
                } else if (value.length > 500) {
                  errorText = '不超过500个字符';
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

                // onOptionsInputChange && onOptionsInputChange({
                //   value,
                //   errorText,
                // });
                onChangeData({
                  customOption: e.target.value,
                  customOptionError: errorText,
                });
              }}
            />
            {
              data.customOptionError && (<>
                <div style={{ height: 5 }} />
                <div className={styles.errorTip}>{data.customOptionError}</div>
              </>)
            }
          </Col>)
      }

    </Row>
  </div>);

  // return (
  //   <div className={styles.Content}>
  //     <div style={{height: 10}}/>
  //     <Space size={20} className={styles.row}>
  //       <Field title={FUtil.I18n.message('key')} dot={true}>
  //         <FInput
  //           wrapClassName={styles.FInputWrap}
  //           value={data.key}
  //           onChange={(e) => {
  //             const value: string = e.target.value;
  //             let keyError: string = '';
  //             if (value === '') {
  //               keyError = '请输入';
  //             } else if (value.length > 15) {
  //               keyError = '不超过15个字符';
  //             } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
  //               keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
  //             }
  //             // console.log(value, 'value0932ur32');
  //             onChangeData({
  //               key: value,
  //               keyError: keyError,
  //             });
  //           }}
  //         />
  //         {data.keyError && <div className={styles.error}>{data.keyError}</div>}
  //       </Field>
  //       <Field title={FUtil.I18n.message('property_remark')}>
  //         <FInput
  //           wrapClassName={styles.FInputWrap}
  //           value={data.description}
  //           onChange={(e) => {
  //             const value: string = e.target.value;
  //             let descriptionError: string = '';
  //             if (value.length > 50) {
  //               descriptionError = '不超过50个字符';
  //             }
  //             onChangeData({
  //               description: value,
  //               descriptionError: descriptionError,
  //             });
  //           }}
  //         />
  //         {data.descriptionError && <div className={styles.error}>{data.descriptionError}</div>}
  //       </Field>
  //     </Space>
  //
  //     <div style={{height: 15}}/>
  //     {
  //       <Space style={{padding: '0 20px', alignItems: 'flex-start'}} size={20}>
  //         <Field
  //           className={styles.FSelect}
  //           title={FUtil.I18n.message('value_input_mode')}
  //         >
  //           <FSelect
  //             value={data.custom}
  //             onChange={(value) => onChangeData({custom: value})}
  //             className={styles.FSelect}
  //             dataSource={[
  //               {value: 'input', title: FUtil.I18n.message('textfield')},
  //               {value: 'select', title: FUtil.I18n.message('dropdownlist')},
  //             ]}
  //             placeholder={'请选择'}
  //           />
  //         </Field>
  //
  //         {
  //           data.custom === 'select' && (<div>
  //             <Field
  //               dot={true}
  //               // title={FUtil.I18n.message('value_options')}
  //               title={'自定义选项(首个选项为默认值)'}
  //               className={styles.customOptions}
  //             >
  //               <FInput
  //                 wrapClassName={styles.FInputWrap}
  //                 value={data.customOption}
  //                 onChange={(e) => {
  //                   const value: string = e.target.value;
  //                   let customOptionError: string = '';
  //
  //                   if (value === '') {
  //                     customOptionError = '请输入';
  //                   } else if (value.length > 500) {
  //                     customOptionError = '不超过500个字符';
  //                   } else if (value.split(',').length > 30) {
  //                     customOptionError = '不超过30个选项';
  //                   }
  //
  //                   if (!customOptionError) {
  //                     const allOptions = value.split(',');
  //                     const setS = new Set(allOptions);
  //                     if (setS.size !== allOptions.length) {
  //                       customOptionError = '选项不能重复';
  //                     }
  //                   }
  //
  //                   onChangeData({
  //                     customOption: e.target.value,
  //                     customOptionError: customOptionError,
  //                   });
  //                 }}
  //               />
  //             </Field>
  //             {data.customOptionError && <div className={styles.error}>{data.customOptionError}</div>}
  //           </div>)
  //         }
  //
  //         {
  //           data.custom === 'input' && (<Field
  //             // title={FUtil.I18n.message('value')}
  //             title={'自定义选项(填写一个默认值)'}
  //             dot={true}
  //             className={styles.customOptions}
  //           >
  //             <FInput
  //               // style={{width: 330}}
  //               wrapClassName={styles.FInputWrap}
  //               value={data.defaultValue}
  //               onChange={(e) => {
  //                 const value: string = e.target.value;
  //                 let valueError: string = '';
  //                 if (value === '') {
  //                   valueError = '请输入';
  //                 } else if (value.length > 30) {
  //                   valueError = '不超过30个字符';
  //                 }
  //                 onChangeData({
  //                   defaultValue: value,
  //                   defaultValueError: valueError,
  //                 });
  //               }}
  //             />
  //             {data.defaultValueError && <div className={styles.error}>{data.defaultValueError}</div>}
  //           </Field>)
  //         }
  //
  //       </Space>
  //     }
  //     <div style={{height: 15}}/>
  //   </div>
  // );
}

export default Property;
