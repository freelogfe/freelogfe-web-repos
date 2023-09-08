import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Space } from 'antd';
import * as AHooks from 'ahooks';

// import { useGetState } from '@/layouts/FBaseLayout';

interface PointCardsProps {

}

function PointCards({}: PointCardsProps) {

  const [$isLogin, set$isLogin, get$isLogin] = FUtil.Hook.useGetState<boolean>(true);

  AHooks.useMount(() => {
    if (FUtil.Tool.getUserIDByCookies() === -1) {
      set$isLogin(false);
      return;
    }

  });

  return (<>

    {
      !$isLogin
        ? (<div className={styles.noLogin}>
          <FComponentsLib.FContentText text={'详细积分情况请登录后查看'} type={'additional2'} />
          <FComponentsLib.FRectBtn
            type={'primary'}
            onClick={() => {
              // self.location.replace()
              FServiceAPI.User.currentUserInfo();
            }}
          >立即登录</FComponentsLib.FRectBtn>
        </div>)
        : (<div className={styles.pointCards}>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>60</div>
              <div>分</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>180</div>
              <div>位</div>
            </div>
          </div>
          <div className={styles.pointCard}>
            <FComponentsLib.FContentText type={'additional2'} text={'体验官积分'} />
            <div className={styles.pointCardPoint}>
              <div>分</div>
              <div>30</div>
              <div>分</div>
            </div>
          </div>
        </div>)
    }


    <div style={{ height: 40 }} />
    <Space size={30}>
      <div className={styles.h3}>每天12：00更新：最近更新{'更新数据时间'}</div>
      <FComponentsLib.FTextBtn type={'primary'} style={{ fontSize: 12 }}>积分活动获取记录</FComponentsLib.FTextBtn>
    </Space>
  </>);
}

export default PointCards;
