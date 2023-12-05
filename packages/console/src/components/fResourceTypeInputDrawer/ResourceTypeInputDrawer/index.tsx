import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeInput from '@/components/FResourceTypeInput';
import FDrawer from '@/components/FDrawer';
import { Space } from 'antd';
import { FI18n, FUtil } from '@freelog/tools-lib';

type ValueType = {
  value: string;
  labels: string[];
  customInput?: string;
} | null;

interface ResourceTypeInputDrawerProps {
  onOk?(value: ValueType): void;

  onClose?(): void;
}

function ResourceTypeInputDrawer({ onOk, onClose }: ResourceTypeInputDrawerProps) {

  const [$open, set$open, get$open] = FUtil.Hook.useGetState<boolean>(true);
  const [$value, set$value, get$value] = FUtil.Hook.useGetState<ValueType>(null);

  return (<FDrawer
    title={FI18n.i18nNext.t('storage_bulkaction_settype_title')}
    open={$open}
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          set$open(false);
        }}
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FTextBtn>

      <FComponentsLib.FRectBtn
        type='primary'
        onClick={() => {
          onOk && onOk(get$value());
          set$open(false);
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
    </Space>}
    afterOpenChange={(o) => {
      if (!o) {
        onClose && onClose();
      }
    }}
  >
    <FComponentsLib.FContentText
      text={FI18n.i18nNext.t('storage_bulkaction_settype_input_type')}
      type={'highlight'}
    />
    <div style={{ height: 5 }} />
    <FResourceTypeInput
      value={$value}
      onChange={(value) => {
        set$value(value);
      }}
    />
    <div style={{ height: 20 }} />
    <div className={styles.footer}>
      <div><FComponentsLib.FIcons.FInfo
        style={{ fontSize: 14 }} />&nbsp;{FI18n.i18nNext.t('storage_bulkaction_settype_input_type_msg')}</div>
    </div>
  </FDrawer>);
}

export default ResourceTypeInputDrawer;
