import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '../../../../@freelog/components-lib';
import FPopover from '@/components/FPopover';

interface FResourcePropertyAndOptionTipPopoverProps {
  info: {
    key: string;
    name: string;
    description: string;
  };
  children: React.ReactNode;
}

function FResourcePropertyAndOptionTipPopover({ info, children }: FResourcePropertyAndOptionTipPopoverProps) {
  return (<FPopover
    // visible={true}
    // trigger={['hover']}
    title={null}
    placement={'bottomLeft'}
    content={<Space size={15} direction={'vertical'} style={{ width: 320 }}>
      <div>
        <FComponentsLib.FContentText type={'additional2'} text={'key'} />
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText type={'normal'} text={info.key} />
      </div>
      {
        info.description && (<div>
          <FComponentsLib.FContentText type={'additional2'} text={'属性说明'} />
          <div style={{ height: 5 }} />
          <FComponentsLib.FContentText
            type={'normal'}
            text={info.description}
            style={{ maxWidth: 320, wordBreak: 'break-all' }}
          />
        </div>)
      }
    </Space>}
  >
    <div>
      {children}
    </div>
  </FPopover>);
}

export default FResourcePropertyAndOptionTipPopover;
