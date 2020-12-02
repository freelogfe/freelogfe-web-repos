import * as React from 'react';
import styles from './index.less';
import {Button, Checkbox, Popover} from 'antd';
import {FNormalButton} from '@/components/FButton';
import FAutoComplete from "@/components/FAutoComplete";

interface FVersionHandlerPopoverProps {
  value: string;
  versionOptions: string[];
  onChange?: (version: FVersionHandlerPopoverProps['value']) => void;
  children?: React.ReactNode;
}

function FVersionHandlerPopover({value, versionOptions, onChange, children}: FVersionHandlerPopoverProps) {
  const [visible, setVisible] = React.useState<boolean>(false);

  function onConfirm() {
    setVisible(false);
    // return onChange && onChange(version);
  }

  return (<Popover
    placement="bottomLeft"
    trigger="click"
    onVisibleChange={(visible) => setVisible(visible)}
    visible={visible}
    content={<div onClick={(e) => e.stopPropagation()}>
      <div className={styles.select}>
        <FAutoComplete size="small" className={styles.FAutoComplete} value={'1.2.2'} options={[{value: '1.2.2'}]}/>
        <div style={{height: 10}}/>
        <div className={styles.Checkbox}>
          <Checkbox
            checked={true}
            onChange={(e) => null}
          />
          <div style={{width: 5}}/>
          <div>允许使用当前版本的最新变动</div>
        </div>
      </div>

      <div style={{height: 10}}/>
      <div className={styles.footer}>
        <Button
          size="small"
          type="default"
          onClick={() => setVisible(false)}
        >取消</Button>
        <div style={{width: 10}}/>
        <FNormalButton
          size="small"
          onClick={onConfirm}
        >确定</FNormalButton>
      </div>
    </div>}
    title={null}
  >
    <div className={styles.children} onClick={(e) => {
      e.stopPropagation();
      setVisible(true);
    }}>{children}</div>
  </Popover>);
}

export default FVersionHandlerPopover;
