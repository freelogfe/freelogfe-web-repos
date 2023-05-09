import * as React from 'react';
import { withRouter } from 'umi';
import Resources from './Resources';
import Collects from './Collects';
import { RouteComponentProps } from 'react-router';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FCenterLayout from '@/layouts/FCenterLayout';
import * as AHooks from 'ahooks';
import { ConnectState } from '@/models/connect';
import FNavTabs from '@/components/FNavTabs';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';

interface ListProps extends RouteComponentProps {
  dispatch: Dispatch;
}

function List({ match }: ListProps) {
  // const [tabValue, setTabValue] = React.useState<'1' | '2'>(match.path === '/resource/list' ? '1' : '2');
  const [showPage, setShowPage] = React.useState<'myResources' | 'myCollections'>('myResources');

  AHooks.useMount(() => {

  });

  AHooks.useUnmount(() => {

  });

  React.useEffect(() => {
    if (match.path.startsWith(FUtil.LinkTo.myResources())) {
      setShowPage('myResources');
    }
    if (match.path.startsWith(FUtil.LinkTo.myCollects())) {
      setShowPage('myCollections');
    }
  }, [match.path]);

  return (<div>
    <div className={styles.top}>
      <div style={{ height: 10 }} />
      <FNavTabs
        options={[
          {
            value: 'myResources',
            label: FI18n.i18nNext.t('my_resources'),
            href: FUtil.LinkTo.myResources(),
          },
          {
            value: 'myCollections',
            label: FI18n.i18nNext.t('my_collections'),
            href: FUtil.LinkTo.myCollects(),
          },
        ]}
        activated={showPage}
      />
    </div>
    <FCenterLayout>

      {showPage === 'myResources' ? <Resources /> : null}
      {showPage === 'myCollections' ? <Collects /> : null}

    </FCenterLayout>
    <FComponentsLib.FPageFooter />
  </div>);
}

export default withRouter(connect(({ router }: ConnectState) => ({
  router,
}))(List));
