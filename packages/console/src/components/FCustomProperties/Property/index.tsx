import * as React from 'react';
import styles from './index.less';
import FHorn from '@/pages/resource/components/FHorn';
import {i18nMessage} from '@/utils/i18n';
import {Col, Row, Space, Switch} from 'antd';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import {Data} from '../index';
import Field from '../Field';

interface PropertyProps {
  data: Data;
  // colNum?: number;
  stubborn?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
  onConfirm?: (data: PropertyProps['data']) => void;
  onDelete?: () => void;
}

function Property({stubborn = false, data, onChange, onDelete, onConfirm}: PropertyProps) {
  const [editing, setEditing] = React.useState<'' | 'value' | 'remark'>('');
  const [valueText, setValueText] = React.useState<string>(data.value as string);
  const [descriptionText, setDescriptionText] = React.useState<string>(data.description as string);
  const colSpan = 12;

  function onChangeData(kv: any) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  function onSave(kv: Partial<Data>) {
    onConfirm && onConfirm({
      ...data,
      ...kv,
    });
    setEditing('');
  }

  return (
    <div className={styles.Content}>
      <div style={{height: 10}}/>
      <Space size={20} className={styles.row}>
        <Field title={i18nMessage('key')} dot={true}>
          <FInput
            wrapClassName={styles.FInputWrap}
            value={data.key}
            onChange={(e) => onChangeData({key: e.target.value})}
            disabled={stubborn}
          />
          <div className={styles.error}>1234</div>
        </Field>
        <Field
          status={stubborn ? (editing === 'value' ? 'editing' : 'editable') : 'normal'}
          title={i18nMessage('value')}
          dot={true}
          onClickEdit={() => setEditing('value')}
          onClickCancel={() => setEditing('')}
          onClickConfirm={() => onSave({value: valueText})}
        >
          {stubborn && editing === 'value'
            ? <FInput
              wrapClassName={styles.FInputWrap}
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
            />
            : <FInput
              wrapClassName={styles.FInputWrap}
              value={data.value}
              onChange={(e) => onChangeData({value: e.target.value})}
              disabled={stubborn}
            />}
          <div className={styles.error}>1234</div>
        </Field>
      </Space>
      <div style={{height: 15}}/>
      <Space className={styles.row} size={20}>
        <Field
          status={stubborn ? (editing === 'remark' ? 'editing' : 'editable') : 'normal'}
          title={i18nMessage('property_remark')}
          onClickEdit={() => setEditing('remark')}
          onClickCancel={() => setEditing('')}
          onClickConfirm={() => onSave({description: descriptionText})}>
          {stubborn && editing === 'remark'
            ? <FInput
              wrapClassName={styles.FInputWrap}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
            : (<FInput
              wrapClassName={styles.FInputWrap}
              value={data.description}
              onChange={(e) => onChangeData({description: e.target.value})}
              disabled={stubborn}
            />)}
          <div className={styles.error}>1234</div>
        </Field>
        <Field title={i18nMessage('support_customization')}>
          <div style={{height: 38, alignItems: 'center', display: 'flex'}}>
            <Switch
              checked={data.allowCustom}
              onChange={(value) => onChangeData({allowCustom: value})}
              disabled={stubborn}
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
              disabled={stubborn}
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
                  onChange={(e) => onChangeData({customOption: e.target.value})}
                  disabled={stubborn}
                />
              </Field>
              <div className={styles.error}>1234</div>
            </div>)
          }
        </Space>)
      }
      <div style={{height: 15}}/>
    </div>
  );
}

export default Property;
