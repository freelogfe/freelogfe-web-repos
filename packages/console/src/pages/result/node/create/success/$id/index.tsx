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
import { ChangeAction as MarketChangeAction } from '@/models/marketPage';

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
    dispatch<MarketChangeAction>({
      type: 'marketPage/change',
      payload: {
        resourceType: 'theme',
      },
    });
    router.push(FUtil.LinkTo.market());
  }

  return (<FCenterLayout>
    <div style={{height: 100}}/>
    <div className={styles.modal}>
      <i className={'freelog fl-icon-shenqingchenggong'}/>
      <div style={{height: 20}}/>
      <FTipText type="second" text={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}/>
      <div style={{height: 40}}/>
      <FTipText type="third" text={FUtil1.I18n.message('cta_add_theme')}/>
      <div style={{height: 20}}/>
      <FRectBtn onClick={goto}>{FUtil1.I18n.message('cta_btn_add_theme')}</FRectBtn>
    </div>
  </FCenterLayout>)
}

export default withRouter(connect()(Success));
