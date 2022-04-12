import * as React from 'react';
import FAffixTabs from '@/components/FAffixTabs';
import {router, RouterTypes, withRouter} from 'umi';
import Resources from "./Resources";
import Collects from "./Collects";
import {RouteComponentProps} from "react-router";
import {ChangeAction} from "@/models/global";
import {Dispatch, connect} from "dva";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import FCenterLayout from "@/layouts/FCenterLayout";
import * as AHooks from 'ahooks';
import {ConnectState} from "@/models/connect";

const navs = [
  {
    value: '1',
    text: FUtil1.I18n.message('my_resources'),
  },
  {
    value: '2',
    text: FUtil1.I18n.message('my_collections'),
  },
];

interface ListProps extends RouteComponentProps {
  dispatch: Dispatch;
}

function List({match, dispatch, route}: ListProps & RouterTypes) {
  const [tabValue, setTabValue] = React.useState<'1' | '2'>(match.path === '/resource/list' ? '1' : '2');

  AHooks.useMount(() => {

  });

  AHooks.useUnmount(() => {

  });

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    setTabValue(match.path === '/resource/list' ? '1' : '2')
  }, [match.path]);

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push(FUtil.LinkTo.myResources());
    }
    if (value === '2') {
      return router.push(FUtil.LinkTo.myCollects());
    }
  }

  return (
    <FCenterLayout>
      <FAffixTabs
        value={tabValue}
        options={navs}
        onChange={onChangeTab}
      />

      {tabValue === '1' ? <Resources/> : null}
      {tabValue === '2' ? <Collects/> : null}

    </FCenterLayout>
  );
}

export default withRouter(connect(({router}: ConnectState) => ({
  router,
}))(List));
