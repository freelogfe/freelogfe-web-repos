import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import { FUtil } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';
import FResultTip from '@/components/FResultTip';
import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';

interface SuccessProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
}

function Success({ route, dispatch }: RouterTypes & SuccessProps) {

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

  return (<FCenterLayout style={{ backgroundColor: 'white' }}>
    {/*<div style={{ height: 100 }} />*/}
    {/*<div className={styles.modal}>*/}
    {/*  <FResultTip*/}
    {/*    // h1={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}*/}
    {/*    h1={'节点创建成功'}*/}
    {/*    // h2={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}*/}
    {/*    h2={'主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'}*/}
    {/*    // btnText={FUtil1.I18n.message('cta_btn_add_theme')}*/}
    {/*    btnText={'添加主题'}*/}
    {/*    onClickBtn={goto}*/}
    {/*  />*/}
    {/*</div>*/}
    <FGraph_Tree_Authorization_Exhibit
      exhibitID={'624168f30f691f002e80ce33'}
      width={860}
      height={500}
    />
  </FCenterLayout>);
}

export default withRouter(connect()(Success));
