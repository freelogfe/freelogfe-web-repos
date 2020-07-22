import * as React from 'react';
import FInput from '@/components/FInput';
import FSelect from '@/components/FSelect';
import styles from './index.less';
import {Space, Switch} from 'antd';
import {EditOutlined, CopyOutlined} from '@ant-design/icons';
import {FCircleButton, FTextButton} from '@/components/FButton';
import FHorn from '@/pages/resource/components/FHorn';
import {FContentText} from "@/components/FText";

interface Data {
  readonly key: string | number;
  readonly value: string | number;
  readonly description: string;
  readonly allowCustom: boolean;
  readonly custom: 'input' | 'select';
  readonly customOption: string;
}

export interface FCustomPropertiesProps {
  readonly stubborn?: boolean;
  readonly dataSource: Data[];
  onChange?: (dataSource: FCustomPropertiesProps['dataSource']) => void;
}

export default function ({stubborn = false, dataSource, onChange}: FCustomPropertiesProps) {
  function onChangeProperty(value: Data, index: number) {
    return onChange && onChange(dataSource.map((i, j) => {
      if (index !== j) {
        return i;
      }
      return value;
    }));
  }

  function onDelete(index: number) {
    return onChange && onChange(dataSource.filter((i, j) => j !== index));
  }

  function onAdd() {
    return onChange && onChange([
      {key: '', value: '', description: '', allowCustom: false, custom: 'input', customOption: ''},
      ...dataSource,
    ]);
  }

  return (<>
    <Space size={80}>
      <Space size={10}>
        <FCircleButton onClick={onAdd} theme="weaken"/>
        <FContentText text={'添加'}/>
      </Space>
      <Space size={10}>
        <FCircleButton theme="weaken" icon={<CopyOutlined/>}/>
        <FContentText text={'从上一版本导入'}/>
      </Space>
    </Space>
    {dataSource.length > 0 && <div className={styles.styles}>
      <div style={{height: 35}}/>
      {
        dataSource.map((i, j) => (<Property
          key={j}
          stubborn={stubborn}
          data={i}
          onChange={(value) => onChangeProperty(value, j)}
          onDelete={() => onDelete(j)}
        />))
      }
    </div>}
  </>);
}

interface PropertyProps {
  data: Data;
  stubborn?: boolean;
  onChange?: (data: PropertyProps['data']) => void;
  onDelete?: () => void;
}


function Property({stubborn = false, data, onChange, onDelete}: PropertyProps) {

  const [editing, setEditing] = React.useState<'' | 'value' | 'remark'>('remark');

  function onChangeData(kv: any) {
    return onChange && onChange({
      ...data,
      ...kv,
    });
  }

  return (<FHorn
    extra={stubborn || (<a
      onClick={() => onDelete && onDelete()}
      className={styles.delete}
    >删除</a>)}
    className={styles.FHorn}>

    <div className={styles.row}>
      <Field title={'key'} dot={true}>
        <FInput
          value={data.key}
          onChange={(e) => onChangeData({key: e.target.value})}
          disabled={stubborn}
        />
      </Field>
      <Field status={stubborn ? (editing === 'value' ? 'editing' : 'editable') : 'normal'} title={'value'} dot={true}>
        <FInput
          value={data.value}
          onChange={(e) => onChangeData({value: e.target.value})}
          disabled={stubborn}
        />
      </Field>
      <Field status={stubborn ? (editing === 'remark' ? 'editing' : 'editable') : 'normal'} title={'属性说明'}>
        <FInput
          value={data.description}
          onChange={(e) => onChangeData({description: e.target.value})}
          disabled={false}
        />
      </Field>
      <Field title={'允许展品自定义'}>
        <Switch
          checked={data.allowCustom}
          onChange={(value) => onChangeData({allowCustom: value})}
          disabled={stubborn}
          className={styles.Switch}
          size="default"
          defaultChecked
        />
      </Field>
    </div>

    {
      data.allowCustom && (<div className={styles.row}>
        <Field className={styles.FSelect} title={'自定义方式'}>
          <FSelect
            value={data.custom}
            onChange={(value) => onChangeData({custom: value})}
            disabled={stubborn}
            className={styles.FSelect}
            dataSource={[{value: 'input', title: '输入框'}, {value: 'select', title: '下拉框'}]}
            placeholder={'请选择'}
          />
        </Field>
        {
          data.custom === 'select' && (<Field title={'自定义选项'} className={styles.customOptions}>
            <FInput
              value={data.customOption}
              onChange={(e) => onChangeData({customOption: e.target.value})}
              disabled={stubborn}
            />
          </Field>)
        }

      </div>)
    }

  </FHorn>);
}


interface FieldProps {
  dot?: boolean;
  title: string;
  children?: React.ReactNode;
  className?: string;
  status?: 'normal' | 'editable' | 'editing';
}

function Field({status = 'normal', className, dot = false, title, children}: FieldProps) {
  return (<div className={styles.Field + ' ' + className}>
      <div className={styles.FieldTitle}>
        {dot && <i className={styles.dot}/>}
        <span>{title}</span>
      </div>
      <div style={{height: 5}}/>

      <FHorn extra={<>
        {
          status === 'editable' && (
            <FTextButton className={styles.editable}>
              <EditOutlined/>
            </FTextButton>
          )
        }
        {
          status === 'editing' && (
            <Space size={10}><FTextButton>取消</FTextButton><FTextButton theme="primary">保存</FTextButton></Space>)
        }
      </>}>
        {children}
      </FHorn>
    </div>
  );
}
