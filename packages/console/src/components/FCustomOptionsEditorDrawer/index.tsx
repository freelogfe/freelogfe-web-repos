import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import {FContentText} from "@/components/FText";
import {FCircleBtn, FRectBtn, FTextBtn} from "@/components/FButton";
import FCustomOptions, {Data} from './FCustomOptions';
import FDrawer from "@/components/FDrawer";

interface FCustomOptionsEditorDrawerProps {
  visible: boolean;
  dataSource: Data[];
  disabledKeys: string[];

  onChange?(value: FCustomOptionsEditorDrawerProps['dataSource']): void

  onConfirm?(): void;

  onCancel?(): void;
}

function FCustomOptionsEditorDrawer({visible, dataSource, disabledKeys, onChange, onConfirm, onCancel}: FCustomOptionsEditorDrawerProps) {

  return (<FDrawer
    title={'添加自定义选项'}
    onClose={() => {
      onCancel && onCancel();
    }}
    visible={visible}
    // visible={true}
    width={720}
    topRight={<Space size={30}>
      <FTextBtn
        type="default"
        onClick={() => {
          onCancel && onCancel()
        }}
      >取消</FTextBtn>
      <FRectBtn
        disabled={!!dataSource.find((eds) => {
          return !eds.key || !!eds.keyError
            || (eds.custom === 'select' ? (eds.customOption === '' || !!eds.customOptionError) : (eds.defaultValue === '' || !!eds.defaultValueError))
            || !!eds.descriptionError;
        })}
        onClick={() => {
          onConfirm && onConfirm();
        }}
      >确定</FRectBtn>
    </Space>}
  >

    <FCustomOptions
      dataSource={dataSource}
      disabledKeys={disabledKeys}
      onChange={(value) => onChange && onChange(value)}
    />

    {
      dataSource.length > 0 && (<div style={{height: 30}}/>)
    }

    <Space size={10}>
      <FCircleBtn
        size="small"
        onClick={() => {
          onChange && onChange([
            ...dataSource,
            {
              key: '',
              keyError: '',
              defaultValue: '',
              defaultValueError: '',
              description: '',
              descriptionError: '',
              custom: 'input',
              customOption: '',
              customOptionError: '',
            },
          ]);
        }}
      />
      <FContentText
        text={'新增一项属性'}
      />
    </Space>

  </FDrawer>);
}

export default FCustomOptionsEditorDrawer;
