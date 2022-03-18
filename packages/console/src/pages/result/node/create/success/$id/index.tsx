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
import FGraph_Relationship_Resource_Tree from '@/components/FAntvG6/FGraph_Relationship_Resource_Tree';

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
    <FGraph_Relationship_Resource_Tree
      height={600}
      width={1000}
      version={'0.1.2'}
      resourceID={'62189e5a182192002eef2f41'}
    />
  </FCenterLayout>);
}

export default withRouter(connect()(Success));
