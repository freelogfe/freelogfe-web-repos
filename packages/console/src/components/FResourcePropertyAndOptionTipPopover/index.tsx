import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FPopover from '@/components/FPopover';

interface FResourcePropertyAndOptionTipPopoverProps {
  info: {
    key: string;
    name: string;
    description: string;
  };
  children: React.ReactNode;
  type?: 'property' | 'option';
}

function FResourcePropertyAndOptionTipPopover({
                                                info,
                                                children,
                                                type = 'property',
                                              }: FResourcePropertyAndOptionTipPopoverProps) {
  return (<FPopover
    // visible={true}
    // trigger={['hover']}
    title={null}
    placement={'bottomLeft'}
    content={<Space size={15} direction={'vertical'} style={{ width: 320 }}>
      <div>
        <FComponentsLib.FContentText type={'additional2'} text={type === 'property' ? '属性名称' : '配置名称'} />
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          type={'normal'}
          text={info.name}
          style={{ maxWidth: 320, wordBreak: 'break-all' }}
        />
      </div>
      <div>
        <FComponentsLib.FContentText type={'additional2'} text={'key'} />
        <div style={{ height: 5 }} />
        <FComponentsLib.FContentText
          type={'normal'}
          text={info.key}
          style={{ maxWidth: 320, wordBreak: 'break-all' }}
        />
      </div>
      {
        info.description && (<div>
          <FComponentsLib.FContentText type={'additional2'} text={type === 'property' ? '属性说明' : '配置说明'} />
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
