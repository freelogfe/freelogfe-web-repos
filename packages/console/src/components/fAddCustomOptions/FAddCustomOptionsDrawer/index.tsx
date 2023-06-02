import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FCustomOptions from '../FCustomOptions';
import FDrawer from '../../FDrawer';
import FComponentsLib from '@freelog/components-lib';
import fMessage from '@/components/fMessage';
import { FI18n } from '@freelog/tools-lib';

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
          keyError: disabledKeys.includes(dd.key) ? FI18n.i18nNext.t('alert_key_exist') : '',
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
    // title={'添加自定义选项'}
    title={FI18n.i18nNext.t('resourceoptions_add_title')}
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
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        disabled={dataSource.length === 0
        || dataSource.some((eds) => {
          return eds.key === '' || eds.keyError !== ''
            || eds.name === '' || eds.nameError !== ''
            || (eds.type === 'input'
              ? (eds.inputError !== '')
              : (eds.select.length === 0 || eds.select.some((s) => {
                return s.value === '' || s.error !== '';
              })))
            || eds.descriptionError !== '';
        })}
        onClick={() => {
          // if (dataSource.some((ds) => {
          //   return ds.select.join(',').length > 500;
          // })) {
          //   fMessage('存在可配置项超过500个字符');
          //   return;
          // }
          onOk && onOk(dataSource.map((ds) => {
            return {
              key: ds.key,
              name: ds.name,
              description: ds.description,
              type: ds.type,
              input: ds.type === 'input' ? ds.input : '',
              select: ds.type === 'select'
                ? ds.select.map((s) => {
                  return s.value;
                })
                : [],
            };
          }));
          set_visible(false);
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
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

  </FDrawer>);
}

export default FAddCustomOptionsDrawer;
