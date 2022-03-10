import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { FTipText } from '@/components/FText';
import { FRectBtn } from '@/components/FButton';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';
import FNoDataTip from '@/components/FNoDataTip';
import FResultTip from '@/components/FResultTip';

interface SuccessProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
}

function Success({ match, route, dispatch }: RouterTypes & SuccessProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function goto() {
    dispatch<MarketChangeAction>({
      type: 'marketPage/change',
      payload: {
        resourceType: 'theme',
      },
    });
    router.push(FUtil.LinkTo.market());
  }

  return (<FCenterLayout>
    <div style={{ height: 100 }} />
    <div className={styles.modal}>
      <FResultTip
        // h1={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
        h1={'节点创建成功'}
        // h2={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
        h2={'主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'}
        // btnText={FUtil1.I18n.message('cta_btn_add_theme')}
        btnText={'添加主题'}
        onClickBtn={goto}
      />

    </div>
  </FCenterLayout>);
}

export default withRouter(connect()(Success));
