import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {FTipText} from '@/components/FText';
import {FRectBtn} from '@/components/FButton';
import {withRouter, router} from 'umi';
import RouterTypes from "umi/routerTypes";
import {ChangeAction} from "@/models/global";
import {Dispatch, connect} from "dva";
import FUtil1 from "@/utils";
import {FUtil} from '@freelog/tools-lib';
import {RouteComponentProps} from "react-router";

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
      <FTipText type="second" text={FUtil1.I18n.message('resource_created_successfully')}/>
      <div style={{height: 40}}/>
      <FTipText type="third" text={FUtil1.I18n.message('hint_create_1st_version')}/>
      <div style={{height: 20}}/>
      <FRectBtn onClick={goto}>{FUtil1.I18n.message('create_first_version')}</FRectBtn>
    </div>
  </FCenterLayout>)
}

export default withRouter(connect()(Success));
