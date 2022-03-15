import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import { FContentText, FTitleText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';

interface FAddingEventDrawerProps {
  visible: boolean;
  disabledTerminateEvent: boolean;

  onClose(): void;

  onSelectEvent(type: 'relativeTime' | 'absoluteTime' | 'payment' | 'terminate'): void;
}

interface FAddingEventDrawerStates {
  areAccountActivated: boolean;
}

function FAddingEventDrawer({ visible, disabledTerminateEvent, onClose, onSelectEvent }: FAddingEventDrawerProps) {

  const [areAccountActivated, set_AreAccountActivated] = React.useState<FAddingEventDrawerStates['areAccountActivated']>(true);

  return (<FDrawer
    width={640}
    visible={visible}
    title={'添加事件或指令'}
    onClose={() => {
      onClose();
    }}
  >
    <FTitleText type='h3' text={'事件'} />
    <div style={{ height: 20 }} />
    <div className={styles.templateEvent}>
      <div>
        <div style={{ width: 130 }}>
          <FContentText type='normal' text={'相对时间事件'} />
        </div>
        <div>
          <FContentText type='negative' text={'示例：1 周之后'} />
        </div>
      </div>
      <FRectBtn
        type='secondary'
        size='small'
        onClick={() => {
          onSelectEvent('relativeTime');
        }}>选择</FRectBtn>
    </div>

    <div style={{ height: 10 }} />

    <div className={styles.templateEvent}>
      <div>
        <div style={{ width: 130 }}>
          <FContentText type='normal' text={'绝对时间事件'} />
        </div>
        <div>
          <FContentText type='negative' text={'示例：于 2021/05/03'} />
        </div>
      </div>
      <FRectBtn
        type='secondary'
        size='small'
        onClick={() => {
          onSelectEvent('absoluteTime');
        }}>选择</FRectBtn>
    </div>

    <div style={{ height: 10 }} />

    <div className={styles.templateEvent}>
      <div>
        <div style={{ width: 130 }}>
          <FContentText type='normal' text={'支付事件'} />
        </div>
        <div>
          <FContentText type='negative' text={'示例：支付 10 羽币 至 我的代币账户'} />
        </div>
      </div>
      <FRectBtn
        type='secondary'
        size='small'
        onClick={() => {
          onSelectEvent('payment');
        }}
      >选择</FRectBtn>
    </div>

    <div style={{ height: 30 }} />

    <FTitleText type='h3' text={'指令'} />

    <div style={{ height: 20 }} />

    <div className={styles.templateEvent}>
      <div>
        <FContentText type='normal' text={'状态机终止，停止接收事件'} />
      </div>
      <FRectBtn
        type='secondary'
        size='small'
        disabled={disabledTerminateEvent}
        onClick={() => {
          onSelectEvent('terminate');
        }}
      >选择</FRectBtn>
    </div>
  </FDrawer>);
}

export default FAddingEventDrawer;
