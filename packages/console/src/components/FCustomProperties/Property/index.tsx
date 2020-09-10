import * as React from 'react';
import styles from './index.less';
import FHorn from '@/pages/resource/components/FHorn';
import {i18nMessage} from '@/utils/i18n';
import {Col, Row, Switch} from 'antd';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import {Data} from '../index';
import Field from '../Field';

interface PropertyProps {
  data: Data;
  colNum?: number;
  stubborn?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
  onConfirm?: (data: PropertyProps['data']) => void;
  onDelete?: () => void;
}


function Property({colNum = 4, stubborn = false, data, onChange, onDelete, onConfirm}: PropertyProps) {
  const [editing, setEditing] = React.useState<'' | 'value' | 'remark'>('');
  const [valueText, setValueText] = React.useState<string>(data.value as string);
  const [descriptionText, setDescriptionText] = React.useState<string>(data.description as string);
  const colSpan = 24 / colNum;

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

  return (<FHorn
    extra={stubborn || (<a
      onClick={() => onDelete && onDelete()}
      className={styles.delete}
    >{i18nMessage('remove')}</a>)}
    className={styles.FHorn}>

    {/*<div className={styles.row}>*/}
    <div className={styles.Content}>
      <Row gutter={16}>
        <Col span={colSpan}>
          <Field title={i18nMessage('key')} dot={true}>
            <FInput
              wrapClassName={styles.FInputWrap}
              value={data.key}
              onChange={(e) => onChangeData({key: e.target.value})}
              disabled={stubborn}
            />
          </Field>
        </Col>
        <Col span={colSpan}>
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
          </Field>
        </Col>
        <Col span={colSpan}>
          <Field
            status={stubborn ? (editing === 'remark' ? 'editing' : 'editable') : 'normal'}
            title={i18nMessage('property_remark')}
            onClickEdit={() => setEditing('remark')}
            onClickCancel={() => setEditing('')}
            onClickConfirm={() => onSave({description: descriptionText})}
          >
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
          </Field>
        </Col>
        <Col span={colSpan}>
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
        </Col>
        {
          data.allowCustom && (<>
            <Col span={colSpan}>
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
            </Col>
            {
              data.custom === 'select' && (<Col span={colSpan}>
                <Field title={i18nMessage('value_options')} className={styles.customOptions}>
                  <FInput
                    wrapClassName={styles.FInputWrap}
                    value={data.customOption}
                    onChange={(e) => onChangeData({customOption: e.target.value})}
                    disabled={stubborn}
                  />
                </Field>
              </Col>)
            }

          </>)
        }
      </Row>
    </div>


  </FHorn>);
}

export default Property;
