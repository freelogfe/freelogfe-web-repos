import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FCustomOptions from '../FCustomOptions';
import FDrawer from '../../FDrawer';
import FComponentsLib from '@freelog/components-lib';

interface FAddCustomOptionsDrawerProps {

  disabledNames: string[];
  disabledKeys: string[];
  hideTypeSelect: boolean;
  defaultData?: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  onOk?(data: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[]): void;

  onClose?(): void;
}

export interface FAddCustomOptionsDrawerStates {
  visible: boolean;
  dataSource: {
    key: string;
    keyError: string;
    name: string;
    nameError: string;
    description: string;
    descriptionError: string;
    type: 'input' | 'select';
    input: string;
    inputError: string;
    select: {
      value: string;
      error: string;
    }[];
  }[];
}

const initStates: FAddCustomOptionsDrawerStates = {
  visible: true,
  dataSource: [{
    key: '',
    keyError: '',
    name: '',
    nameError: '',
    description: '',
    descriptionError: '',
    type: 'input',
    input: '',
    inputError: '',
    select: [],
  }],
};

function FAddCustomOptionsDrawer({
                                   disabledNames,
                                   disabledKeys,
                                   hideTypeSelect,
                                   defaultData,
                                   onOk,
                                   onClose,
                                 }: FAddCustomOptionsDrawerProps) {

  const [visible, set_visible] = React.useState<FAddCustomOptionsDrawerStates['visible']>(initStates['visible']);
  const [dataSource, set_dataSource] = React.useState<FAddCustomOptionsDrawerStates['dataSource']>(initStates['dataSource']);

  function initData() {
    // console.log(defaultData, 'defaultData sdiofjsdlk jlkjl');
    if (defaultData) {
      set_dataSource(defaultData.map((dd) => {
        return {
          key: dd.key,
          keyError: disabledKeys.includes(dd.key) ? '键不能重复' : '',
          name: dd.name,
          nameError: disabledNames.includes(dd.name) ? '名称不能重复' : '',
          description: dd.description,
          descriptionError: '',
          type: dd.type,
          input: dd.input,
          inputError: '',
          select: dd.select.map((s) => {
            return {
              value: s,
              error: '',
            };
          }),
        };
      }));
    }
  }

  return (<FDrawer
    title={'添加自定义选项'}
    open={visible}
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
            || eds.name === '' || eds.nameError !== ''
            || (eds.type === 'input'
              ? (eds.inputError !== '')
              : eds.select.some((s) => {
                return s.value === '' || s.error !== '';
              }))
            || eds.descriptionError !== '';
        })}
        onClick={() => {
          onOk && onOk(dataSource.map((ds) => {
            return {
              key: ds.key,
              name: ds.name,
              description: ds.description,
              type: ds.type,
              input: ds.input,
              select: ds.select.map((s) => {
                return s.value;
              }),
            };
          }));
          set_visible(false);
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
  >

    <FCustomOptions
      disabledNames={disabledNames}
      hideTypeSelect={hideTypeSelect}
      dataSource={dataSource}
      disabledKeys={disabledKeys}
      onChange={(d) => {
        set_dataSource(d);
      }}
    />

    {/*{*/}
    {/*  dataSource.length > 0 && (<div style={{ height: 30 }} />)*/}
    {/*}*/}

    {/*<Space size={10}>*/}
    {/*  <FComponentsLib.FCircleBtn*/}
    {/*    size='small'*/}
    {/*    onClick={onClick_AddNewItem}*/}
    {/*  />*/}
    {/*  <div*/}
    {/*    style={{ cursor: 'pointer', display: 'inline-block' }}*/}
    {/*    onClick={onClick_AddNewItem}*/}
    {/*  >*/}
    {/*    <FComponentsLib.FContentText*/}
    {/*      text={'新增一项属性'}*/}
    {/*    />*/}
    {/*  </div>*/}
    {/*</Space>*/}

  </FDrawer>);
}

export default FAddCustomOptionsDrawer;
