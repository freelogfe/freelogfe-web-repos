import * as React from 'react';
import FAffixTabs from '@/components/FAffixTabs';
import { router, RouterTypes, withRouter } from 'umi';
import Resources from './Resources';
import Collects from './Collects';
import { RouteComponentProps } from 'react-router';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
import { ConnectState } from '@/models/connect';
import FNavTabs from '@/components/FNavTabs';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

// const navs = [
//   {
//     value: '1',
//     text: FUtil1.I18n.message('my_resources'),
//   },
//   {
//     value: '2',
//     text: FUtil1.I18n.message('my_collections'),
//   },
// ];

interface ListProps extends RouteComponentProps {
  dispatch: Dispatch;
}

function List({ match, dispatch, route }: ListProps & RouterTypes) {
  // const [tabValue, setTabValue] = React.useState<'1' | '2'>(match.path === '/resource/list' ? '1' : '2');
  const [showPage, setShowPage] = React.useState<'myResources' | 'myCollections'>('myResources');

  AHooks.useMount(() => {

  });

  AHooks.useUnmount(() => {

  });

  // React.useEffect(() => {
  //   dispatch<ChangeAction>({
  //     type: 'global/change',
  //     payload: {
  //       route: route,
  //     },
  //   });
  // }, [route]);

  React.useEffect(() => {
    if (match.path.startsWith(FUtil.LinkTo.myResources())) {
      setShowPage('myResources');
    }
    if (match.path.startsWith(FUtil.LinkTo.myCollects())) {
      setShowPage('myCollections');
    }
  }, [match.path]);

  // function onChangeTab(value: '1' | '2') {
  //   if (value === '1') {
  //     return router.push(FUtil.LinkTo.myResources());
  //   }
  //   if (value === '2') {
  //     return router.push(FUtil.LinkTo.myCollects());
  //   }
  // }

  return (<div>
    <div className={styles.top}>
      <div style={{ height: 10 }} />
      <FNavTabs
        options={[
          {
            value: 'myResources',
            label: FUtil1.I18n.message('my_resources'),
            href: FUtil.LinkTo.myResources(),
          },
          {
            value: 'myCollections',
            label: FUtil1.I18n.message('my_collections'),
            href: FUtil.LinkTo.myCollects(),
          },
        ]}
        activated={showPage}
      />
    </div>
    <FCenterLayout>
      {/*<FAffixTabs*/}
      {/*  value={tabValue}*/}
      {/*  options={navs}*/}
      {/*  onChange={onChangeTab}*/}
      {/*/>*/}

      {showPage === 'myResources' ? <Resources /> : null}
      {showPage === 'myCollections' ? <Collects /> : null}

    </FCenterLayout>
    <FComponentsLib.FPageFooter />
  </div>);
}

export default withRouter(connect(({ router }: ConnectState) => ({
  router,
}))(List));
