import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import { FContentText } from '../FText';
import { FCircleBtn, FRectBtn, FTextBtn } from '../FButton';
import FCustomOptions, { Data } from './FCustomOptions';
import FDrawer from '../FDrawer';

interface FCustomOptionsEditorDrawerProps {
  visible: boolean;
  disabledKeys: string[];
  hideTypeSelect?: boolean;

  onConfirm?(value: FCustomOptionsEditorDrawerStates['dataSource']): void;

  onCancel?(): void;
}

export interface FCustomOptionsEditorDrawerStates {
  dataSource: Data[];
}

const initDataSource: FCustomOptionsEditorDrawerStates['dataSource'] = [{
  key: '',
  keyError: '',
  defaultValue: '',
  defaultValueError: '',
  description: '',
  descriptionError: '',
  custom: 'input',
  customOption: '',
  customOptionError: '',
}];

function FCustomOptionsEditorDrawer({
                                      visible,
                                      disabledKeys,
                                      hideTypeSelect = false,
                                      onConfirm,
                                      onCancel,
                                    }: FCustomOptionsEditorDrawerProps) {

  const [dataSource, setDataSource] = React.useState<FCustomOptionsEditorDrawerStates['dataSource']>(initDataSource);

  function onClick_AddNewItem() {
    setDataSource([
      ...dataSource,
      ...initDataSource,
    ]);
  }

  function onChange_DataSource(value: FCustomOptionsEditorDrawerStates['dataSource']) {
    setDataSource(value);
  }

  function onClick_ConfirmBtn() {
    onConfirm && onConfirm(dataSource);
  }

  return (<FDrawer
    title={'添加自定义选项'}
    onClose={() => {
      onCancel && onCancel();
    }}
    visible={visible}
    width={720}
    topRight={<Space size={30}>
      <FTextBtn
        type='default'
        onClick={() => {
          onCancel && onCancel();
        }}
      >取消</FTextBtn>
      <FRectBtn
        disabled={!!dataSource.find((eds) => {
          return !eds.key || !!eds.keyError
            || (eds.custom === 'select' ? (eds.customOption === '' || !!eds.customOptionError) : (eds.defaultValue === '' || !!eds.defaultValueError))
            || !!eds.descriptionError;
        })}
        onClick={onClick_ConfirmBtn}
      >确定</FRectBtn>
    </Space>}
    afterVisibleChange={(visible) => {
      if (!visible) {
        setDataSource(initDataSource);
      }
    }}
  >

    <FCustomOptions
      hideTypeSelect={hideTypeSelect}
      dataSource={dataSource}
      disabledKeys={disabledKeys}
      onChange={onChange_DataSource}
    />

    {
      dataSource.length > 0 && (<div style={{ height: 30 }} />)
    }

    <Space size={10}>
      <FCircleBtn
        size='small'
        onClick={onClick_AddNewItem}
      />
      <FContentText
        text={'新增一项属性'}
      />
    </Space>

  </FDrawer>);
}

export default FCustomOptionsEditorDrawer;
