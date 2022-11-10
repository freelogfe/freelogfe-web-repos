import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FCustomOptions, { Data } from '../FCustomOptions';
import FDrawer from '../../FDrawer';
import FComponentsLib from '@freelog/components-lib';

interface FAddCustomOptionsDrawerProps {

  disabledKeys: string[];
  hideTypeSelect: boolean;
  defaultData?: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];

  onOk?(data: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[]): void;

  onClose?(): void;
}

export interface FAddCustomOptionsDrawerStates {
  visible: boolean;
  dataSource: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  }[];
}

const initStates: FAddCustomOptionsDrawerStates = {
  visible: true,
  dataSource: [{
    key: '',
    keyError: '',
    description: '',
    descriptionError: '',
    custom: 'input',
    defaultValue: '',
    defaultValueError: '',
    customOption: '',
    customOptionError: '',
  }],
};

function FAddCustomOptionsDrawer({
                                   disabledKeys,
                                   hideTypeSelect,
                                   defaultData,
                                   onOk,
                                   onClose,
                                 }: FAddCustomOptionsDrawerProps) {

  const [visible, set_visible] = React.useState<FAddCustomOptionsDrawerStates['visible']>(initStates['visible']);
  const [dataSource, set_dataSource] = React.useState<FAddCustomOptionsDrawerStates['dataSource']>(initStates['dataSource']);

  function initData() {
    if (defaultData) {
      set_dataSource(defaultData.map((dd) => {
        return {
          key: dd.key,
          keyError: '',
          description: dd.description,
          descriptionError: '',
          custom: dd.custom,
          defaultValue: dd.defaultValue,
          defaultValueError: '',
          customOption: dd.customOption,
          customOptionError: '',
        };
      }));
    }
  }

  function onClick_AddNewItem() {
    set_dataSource([
      ...dataSource,
      {
        key: '',
        keyError: '',
        description: '',
        descriptionError: '',
        custom: 'input',
        defaultValue: '',
        defaultValueError: '',
        customOption: '',
        customOptionError: '',
      },
    ]);
  }

  // function onChange_DataSource(value: FCustomOptionsEditorDrawerStates['dataSource']) {
  //   setDataSource(value);
  // }

  // function onClick_ConfirmBtn() {
  //   onConfirm && onConfirm(dataSource);
  // }

  return (<FDrawer
    title={'添加自定义选项'}
    visible={visible}
    onClose={() => {
      set_visible(false);
    }}
    afterOpenChange={(v) => {
      if (!v) {
        onClose && onClose();
      } else {
        initData();
      }
    }}
    width={720}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          set_visible(false);
        }}
      >取消</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        disabled={dataSource.length === 0
        || dataSource.some((eds) => {
          return eds.key === '' || eds.keyError !== ''
            || (eds.custom === 'select' ? (eds.customOption === '' || eds.customOptionError !== '') : eds.defaultValueError !== '')
            || eds.descriptionError !== '';
        })}
        onClick={() => {
          onOk && onOk(dataSource.map((ds) => {
            return {
              key: ds.key,
              description: ds.description,
              custom: ds.custom,
              defaultValue: ds.defaultValue,
              customOption: ds.customOption,
            };
          }));
          set_visible(false);
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
  >

    <FCustomOptions
      hideTypeSelect={hideTypeSelect}
      dataSource={dataSource}
      disabledKeys={disabledKeys}
      onChange={(d) => {
        set_dataSource(d);
      }}
    />

    {
      dataSource.length > 0 && (<div style={{ height: 30 }} />)
    }

    <Space size={10}>
      <FComponentsLib.FCircleBtn
        size='small'
        onClick={onClick_AddNewItem}
      />
      <div
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={onClick_AddNewItem}
      >
        <FComponentsLib.FContentText
          text={'新增一项属性'}
        />
      </div>
    </Space>

  </FDrawer>);
}

export default FAddCustomOptionsDrawer;
