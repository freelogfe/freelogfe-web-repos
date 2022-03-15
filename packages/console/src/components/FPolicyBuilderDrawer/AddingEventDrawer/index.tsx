import * as React from 'react';
import styles from './index.less';
import FDrawer from '../../FDrawer';
import { FContentText, FTipText, FTitleText } from '@/components/FText';
import { FRectBtn, FTextBtn } from '../../FButton';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface FAddingEventDrawerProps {
  visible: boolean;
  disabledTerminateEvent: boolean;

  onClose(): void;

  onSelectEvent(type: 'relativeTime' | 'absoluteTime' | 'payment' | 'terminate'): void;
}

interface FAddingEventDrawerStates {
  areAccountActivated: boolean;
}

const initStates: FAddingEventDrawerStates = {
  areAccountActivated: true,
};

function FAddingEventDrawer({ visible, disabledTerminateEvent, onClose, onSelectEvent }: FAddingEventDrawerProps) {

  const [areAccountActivated, set_AreAccountActivated] = React.useState<FAddingEventDrawerStates['areAccountActivated']>(initStates['areAccountActivated']);

  AHooks.useMount(async () => {
    const params: Parameters<typeof FServiceAPI.Transaction.individualAccounts>[0] = {
      userId: FUtil.Tool.getUserIDByCookies(),
    };
    const { data } = await FServiceAPI.Transaction.individualAccounts(params);

    if (data.status !== 1) {
      set_AreAccountActivated(false);
    }
  });

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
        disabled={!areAccountActivated}
        onClick={() => {
          onSelectEvent('payment');
        }}
      >选择</FRectBtn>
    </div>
    {
      !areAccountActivated && (<>
        <div style={{ height: 5 }} />
        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
          <FTextBtn
            style={{ fontSize: 12 }}
            type='primary'
            onClick={() => {
              window.open(FUtil.Format.completeUrlByDomain('user') + FUtil.LinkTo.wallet());
            }}
          >马上激活</FTextBtn>
          <div style={{ width: 5 }} />
          <span style={{ fontSize: 12, color: '#666' }}>你的羽币账户未激活，无法添加支付事件</span>
        </div>
      </>)
    }


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
