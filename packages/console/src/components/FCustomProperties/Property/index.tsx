import * as React from 'react';
import styles from './index.less';
import {Space} from 'antd';
import FInput from '../../FInput';
import FSelect from '../../FSelect';
import {Data} from '../index';
import Field from '../Field';
// import FUtil1 from "@/utils";
import {FUtil, fI18nNext} from '@freelog/tools-lib';

interface PropertyProps {
  data: Data;
  onChange?: (data: PropertyProps['data']) => void;
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
    <Field title={fI18nNext.t('key')} dot={true}>
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
          } else if (!FUtil.Regexp.CUSTOM_KEY.test(value)) {
            keyError = `不符合${FUtil.Regexp.CUSTOM_KEY}`;
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
    <Field title={fI18nNext.t('property_remark')}>
      <FInput
        wrapClassName={styles.FInputWrap}
        value={data.description}
        onChange={(e) => {
          const value: string = e.target.value;
          let descriptionError: string = '';
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
  </Space>

  <div style={{height: 15}}/>
  {
    <Space style={{padding: '0 20px', alignItems: 'flex-start'}} size={20}>
      <Field
        className={styles.FSelect}
        title={fI18nNext.t('value_input_mode')}
      >
        <FSelect
          value={data.custom}
          onChange={(value) => onChangeData({custom: value})}
          className={styles.FSelect}
          dataSource={[
            {value: 'input', title: fI18nNext.t('textfield')},
            {value: 'select', title: fI18nNext.t('dropdownlist')},
          ]}
          placeholder={'请选择'}
        />
      </Field>

      {
        data.custom === 'select' && (<div>
          <Field
            dot={true}
            // title={FUtil.I18n.message('value_options')}
            title={'自定义选项(首个选项为默认值)'}
            className={styles.customOptions}
          >
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

                if (!customOptionError) {
                  const allOptions = value.split(',');
                  const setS = new Set(allOptions);
                  if (setS.size !== allOptions.length) {
                    customOptionError = '选项不能重复';
                  }
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

      {
        data.custom === 'input' && (<Field
          // title={FUtil.I18n.message('value')}
          title={'自定义选项(填写一个默认值)'}
          dot={true}
          className={styles.customOptions}
        >
          <FInput
            wrapClassName={styles.FInputWrap}
            value={data.defaultValue}
            onChange={(e) => {
              const value: string = e.target.value;
              let valueError: string = '';
              if (value === '') {
                valueError = '请输入';
              } else if (value.length > 30) {
                valueError = '不超过30个字符';
              }
              onChangeData({
                defaultValue: value,
                defaultValueError: valueError,
              });
            }}
          />
          {data.defaultValueError && <div className={styles.error}>{data.defaultValueError}</div>}
        </Field>)
      }

    </Space>
  }
  <div style={{height: 15}}/>
  </div>
  );
}

export default Property;
