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
  defaultValue?: FCustomOptionsEditorDrawerStates['dataSource'];

  onConfirm?(value: FCustomOptionsEditorDrawerStates['dataSource']): void;

  onCancel?(): void;
}

export interface FCustomOptionsEditorDrawerStates {
  dataSource: Data[];
}

const initDataSource: FCustomOptionsEditorDrawerStates['dataSource'] = [{
  key: '',
  keyError: '',
  description: '',
  descriptionError: '',
  custom: 'input',
  defaultValue: '',
  defaultValueError: '',
  customOption: '',
  customOptionError: '',
}];

function FCustomOptionsEditorDrawer({
                                      visible,
                                      disabledKeys,
                                      hideTypeSelect = false,
                                      defaultValue,
                                      onConfirm,
                                      onCancel,
                                    }: FCustomOptionsEditorDrawerProps) {

  const [dataSource, setDataSource] = React.useState<FCustomOptionsEditorDrawerStates['dataSource']>([]);

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
        disabled={dataSource.length === 0
        || dataSource.some((eds) => {
          return eds.key === '' || eds.keyError !== ''
            || (eds.custom === 'select' ? (eds.customOption === '' || eds.customOptionError !== '') : eds.defaultValueError !== '')
            || eds.descriptionError !== '';
        })}
        onClick={onClick_ConfirmBtn}
      >确定</FRectBtn>
    </Space>}
    afterVisibleChange={(visible) => {
      if (!visible) {
        setDataSource(initDataSource);
      } else {
        setDataSource(defaultValue || initDataSource);
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
      <div
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={onClick_AddNewItem}
      >
        <FContentText
          text={'新增一项属性'}
        />
      </div>
    </Space>

  </FDrawer>);
}

export default FCustomOptionsEditorDrawer;
