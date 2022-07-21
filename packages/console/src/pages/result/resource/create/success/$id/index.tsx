import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {ChangeAction} from "@/models/global";
import {Dispatch, connect} from "dva";
import {FUtil,FI18n} from '@freelog/tools-lib';
import {RouteComponentProps} from "react-router";
import FComponentsLib from '@freelog/components-lib';

interface SuccessProps extends RouteComponentProps<{ id: string; }> {
  dispatch: Dispatch;
}

function Success({match, route, dispatch}: RouterTypes & SuccessProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  function goto() {
    // /resource/:id/$version/creator
    // router.replace(`/resource/${match.params.id}/$version/creator`)
    router.replace(FUtil.LinkTo.resourceCreateVersion({
      resourceID: match.params.id,
    }));
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FComponentsLib.FTipText type="second" text={FI18n.i18nNext.t('resource_created_successfully')}/>
      <div style={{height: 40}}/>
      <FComponentsLib.FTipText type="third" text={FI18n.i18nNext.t('hint_create_1st_version')}/>
      <div style={{height: 20}}/>
      <FComponentsLib.FRectBtn onClick={goto}>{FI18n.i18nNext.t('create_first_version')}</FComponentsLib.FRectBtn>
    </div>
  </FCenterLayout>)
}

export default withRouter(connect()(Success));
