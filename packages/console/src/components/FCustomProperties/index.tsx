import * as React from 'react';
import styles from './index.less';
import {Space, Switch, Row, Col} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import {FCircleButton, FTextButton} from '@/components/FButton';
import {FContentText} from "@/components/FText";
import {i18nMessage} from "@/utils/i18n";
import Property from './Property';

export type Data = Readonly<{
  key: string;
  value: string;
  description: string;
  allowCustom: boolean;
  custom: 'input' | 'select';
  customOption: string;
}>;

export type FCustomPropertiesProps = Readonly<{
  stubborn?: boolean;
  colNum?: number;
  noHeaderButton?: boolean;
  dataSource: Data[];
  onChange?(dataSource: FCustomPropertiesProps['dataSource']): void;
  onSave?(dataSource: FCustomPropertiesProps['dataSource']): void;
  onImport?(): void;
}>;

export default function ({noHeaderButton = false, stubborn = false, dataSource, onChange, onImport, onSave, colNum}: FCustomPropertiesProps) {
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

  function onConfirm(value: Data, index: number) {
    onSave && onSave(dataSource.map((i, j) => {
      if (j !== index) {
        return i;
      }
      return value;
    }));
  }

  return (<>
    {
      !stubborn && !noHeaderButton && (<>
        <Space size={80}>
          <Space size={10}>
            <FCircleButton onClick={onAdd} theme="weaken"/>
            <FContentText text={i18nMessage('create_property')}/>
          </Space>
          <Space size={10}>
            <FCircleButton
              theme="weaken"
              icon={<CopyOutlined/>}
              onClick={() => onImport && onImport()}
            />
            <FContentText text={i18nMessage('import_from_previous_version')}/>
          </Space>
        </Space>

      </>)
    }

    {dataSource.length > 0 && <div className={styles.styles}>
      <div style={{height: 35}}/>
      {
        dataSource.map((i, j) => (<Property
          colNum={colNum}
          key={j}
          stubborn={stubborn}
          data={i}
          onChange={(value) => onChangeProperty(value, j)}
          onConfirm={(value) => onConfirm(value, j)}
          onDelete={() => onDelete(j)}
        />))
      }
    </div>}
  </>);
}




