import * as React from 'react';
import styles from './index.less';
import FHorn from '@/pages/resource/components/FHorn';
import {i18nMessage} from '@/utils/i18n';
import {Col, Row, Space, Switch} from 'antd';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import {Data} from '../index';
import Field from '../Field';
import {CUSTOM_KEY} from "@/utils/regexp";

interface PropertyProps {
  data: Data;
  // colNum?: number;
  // stubborn?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
  // onConfirm?: (data: PropertyProps['data']) => void;
  // onDelete?: () => void;
}

function Property({data, onChange}: PropertyProps) {

  function onChangeData(kv: Partial<PropertyProps['data']>) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  return (
    <div className={styles.Content}>
      <div style={{height: 10}}/>
      <Space size={20} className={styles.row}>
        <Field title={i18nMessage('key')} dot={true}>
          <FInput
            wrapClassName={styles.FInputWrap}
            value={data.key}
            onChange={(e) => {
              const value: string = e.target.value;
              let keyError: string = '';
              if (value === '') {
                keyError = '请输入';
              } else if (value.length > 15) {
                keyError = '不超过15个字符';
              } else if (!CUSTOM_KEY.test(value)) {
                keyError = `不符合${CUSTOM_KEY}`;
              }
              // console.log(value, 'value0932ur32');
              onChangeData({
                key: value,
                keyError: keyError,
              });
            }}
          />
          {data.keyError && <div className={styles.error}>{data.keyError}</div>}
        </Field>
        <Field
          title={i18nMessage('value')}
          dot={true}
        >
          <FInput
            wrapClassName={styles.FInputWrap}
            value={data.value}
            onChange={(e) => {
              const value: string = e.target.value;
              let valueError: string = '';
              if (value === '') {
                valueError = '请输入';
              } else if (value.length > 30) {
                valueError = '不超过30个字符';
              }
              onChangeData({
                value: value,
                valueError: valueError,
              });
            }}
          />
          {data.valueError && <div className={styles.error}>{data.valueError}</div>}
        </Field>
      </Space>
      <div style={{height: 15}}/>
      <Space className={styles.row} size={20}>
        <Field title={i18nMessage('property_remark')}>
          <FInput
            wrapClassName={styles.FInputWrap}
            value={data.description}
            onChange={(e) => {
              const value: string = e.target.value;
              let descriptionError: string = '';
              // if (value === '') {
              //   descriptionError = '请输入';
              // } else
              if (value.length > 50) {
                descriptionError = '不超过50个字符';
              }
              onChangeData({
                description: value,
                descriptionError: descriptionError,
              });
            }}
          />
          {data.descriptionError && <div className={styles.error}>{data.descriptionError}</div>}
        </Field>
        <Field title={i18nMessage('support_customization')}>
          <div style={{height: 38, alignItems: 'center', display: 'flex'}}>
            <Switch
              checked={data.allowCustom}
              onChange={(value) => onChangeData({allowCustom: value})}
              className={styles.Switch}
              size="default"
              defaultChecked
            />
          </div>
        </Field>
      </Space>
      <div style={{height: 15}}/>
      {
        data.allowCustom && (<Space style={{padding: '0 20px', alignItems: 'flex-start'}} size={20}>
          <Field className={styles.FSelect} title={i18nMessage('value_input_mode')}>
            <FSelect
              value={data.custom}
              onChange={(value) => onChangeData({custom: value})}
              className={styles.FSelect}
              dataSource={[
                {value: 'input', title: i18nMessage('textfield')},
                {value: 'select', title: i18nMessage('dropdownlist')},
              ]}
              placeholder={'请选择'}
            />
          </Field>

          {
            data.custom === 'select' && (<div>
              <Field title={i18nMessage('value_options')} className={styles.customOptions}>
                <FInput
                  wrapClassName={styles.FInputWrap}
                  value={data.customOption}
                  onChange={(e) => {
                    const value: string = e.target.value;
                    let customOptionError: string = '';

                    if (value === '') {
                      customOptionError = '请输入';
                    } else if (value.length > 500) {
                      customOptionError = '不超过500个字符';
                    }

                    onChangeData({
                      customOption: e.target.value,
                      customOptionError: customOptionError,
                    });
                  }}
                />
              </Field>
              {data.customOptionError && <div className={styles.error}>{data.customOptionError}</div>}
            </div>)
          }
        </Space>)
      }
      <div style={{height: 15}}/>
    </div>
  );
}

export default Property;
