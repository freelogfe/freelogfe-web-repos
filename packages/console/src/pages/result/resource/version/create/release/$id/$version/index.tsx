import * as React from 'react';
import styles from './index.less';
import { withRouter, history } from 'umi';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
// import { connect } from 'dva';
import { RouteComponentProps } from 'react-router';
import { Progress } from 'antd';
import { FUtil } from '@freelog/tools-lib';

interface SuccessProps extends RouteComponentProps<{
  id: string;
  version: string;
}> {

}

function Release({ match }: SuccessProps) {
  // match.params.id;
  // match.params.version

  const [percent, set_percent] = React.useState(0);

  AHooks.useTimeout(() => {
    history.replace(FUtil.LinkTo.resourceVersionCreateSuccess({
      resourceID: match.params.id,
      version: match.params.version,
    }));
  }, 2000);

  AHooks.useInterval(() => {
    set_percent(Math.min(percent + 1, 99));
  }, 8);

  return (<FCenterLayout>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <div style={{
        height: 452,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
        <div style={{ fontSize: 20, color: '#222', lineHeight: '28px' }}>{percent}%</div>
        <div style={{ height: 20 }} />
        <div style={{ width: 300 }}>
          <Progress percent={percent} showInfo={false} />
        </div>
        <div style={{ height: 40 }} />
        <div style={{ fontSize: 16, color: '#666', lineHeight: '22px' }}>资源版本正在发布，请稍后</div>

      </div>
    </div>
  </FCenterLayout>);
}

export default withRouter(Release);
