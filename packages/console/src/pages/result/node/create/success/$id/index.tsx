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
import FG6MiniDemo from '@/components/FAntvG6/FAntvG6Test/FG6MiniDemo';
import FGraph_Relationship_Resource_Tree from '@/components/FAntvG6/FGraph_Tree_Relationship_Resource';
import FGraph_Tree_Dependency_Resource from '@/components/FAntvG6/FGraph_Tree_Dependency_Resource';
import FGraph_Tree_Authorization_Resource from '@/components/FAntvG6/FGraph_Tree_Authorization_Resource';

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
    <div style={{ height: 100 }} />
    {/*<FG6MiniDemo/>*/}
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
    <FGraph_Tree_Authorization_Resource
      height={600}
      width={1000}
      version={'0.1.2'}
      resourceID={'62189e5a182192002eef2f41'}
    />
  </FCenterLayout>);
}

export default withRouter(connect()(Success));
