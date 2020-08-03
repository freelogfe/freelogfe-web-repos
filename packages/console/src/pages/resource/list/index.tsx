import * as React from 'react';
import FCenterLayout from '@/layouts/FCenterLayout';
import FAffixTabs from '@/components/FAffixTabs';
import {router, withRouter} from 'umi';
import Resources from "./Resources";
import Collects from "./Collects";
import {RouteComponentProps} from "react-router";

const navs = [
  {
    value: '1',
    text: '我的资源',
  },
  {
    value: '2',
    text: '我的收藏',
  },
];

interface ListProps extends RouteComponentProps {

}

function List({match}: ListProps) {
  const [tabValue, setTabValue] = React.useState<'1' | '2'>(match.path === '/resource/list' ? '1' : '2');

  React.useEffect(() => {
    setTabValue(match.path === '/resource/list' ? '1' : '2')
  }, [match.path]);

  function onChangeTab(value: '1' | '2') {
    if (value === '1') {
      return router.push('/resource/list');
    }
    if (value === '2') {
      return router.push('/resource/collect');
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

export default withRouter(List);
