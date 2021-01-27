import * as React from 'react';
import styles from './index.less';
import {FContentText, FTitleText} from '@/components/FText';
import FSwitch from '@/components/FSwitch';
import {Space} from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import {connect, Dispatch} from 'dva';
import {
  ConnectState,
  ExhibitInfoPageModelState,
  InformalNodeManagerPageModelState,
  InformExhibitInfoPageModelState
} from '@/models/connect';
import {
  ChangeAction,
  FetchInfoAction,
  UpdateStatusAction,
} from '@/models/informExhibitInfoPage';
import RouterTypes from 'umi/routerTypes';
import {nodeDetail} from '@/services/nodes';
import {FTextButton} from '@/components/FButton';
import {router} from 'umi';
import FTooltip from "@/components/FTooltip";
import {FWarning} from "@/components/FIcons";
import {informExhibitManagement, nodeManagement} from "@/utils/path-assembler";
import {RouteComponentProps} from "react-router";

interface InformExhibitProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  // exhibitInfoPage: ExhibitInfoPageModelState;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}

function Presentable({dispatch, match, informExhibitInfoPage}: InformExhibitProps) {

  React.useEffect(() => {

    initDate();

    // dispatch<FetchInfoAction>({
    //   type: 'exhibitInfoPage/fetchInfo',
    // });
  }, []);

  async function initDate() {
    await dispatch<ChangeAction>({
      type: 'informExhibitInfoPage/change',
      payload: {
        // informExhibitID:
      },
    });
  }

  return (<div className={styles.styles}>
    <div>
      <div className={styles.header}>
        <div className={styles.nav}>
          <FTextButton onClick={() => {
            // router.push(`/node/exhibit/formal/${exhibitInfoPage.nodeId}/informal`)
            // router.push(nodeManagement({nodeID: exhibitInfoPage.nodeId}));
          }}><FContentText
            type="negative"
            text={informExhibitInfoPage.nodeName}
          /></FTextButton>
          <div style={{width: 2}}/>
          <FContentText type="negative" text={'>'}/>
          <div style={{width: 2}}/>
          <FTitleText text={informExhibitInfoPage.informExhibitName}/>
        </div>
        <Space size={20}>
          <span style={{color: '#666'}}>{informExhibitInfoPage.isOnline ? '上线' : '未上线'}</span>
          <FSwitch
            // disabled={!informExhibitInfoPage.isAuth || informExhibitInfoPage.policies.filter((p) => p.status === 1).length === 0}
            // checked={informExhibitInfoPage.isOnline}
            // onChange={(value) => dispatch<UpdateStatusAction>({
            //   type: 'exhibitInfoPage/updateStatus',
            //   payload: value ? 1 : 0,
            // })}
          />
          {/*<FTooltip title={!informExhibitInfoPage.isAuth ? informExhibitInfoPage.authErrorText : '暂无上线策略'}>*/}
          {/*  <FWarning/>*/}
          {/*</FTooltip>*/}
        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div>
            {/*<Policies/>*/}
            {/*<div style={{height: 50}}/>*/}
            <Contracts/>
            <div style={{height: 50}}/>
            <Viewports/>
          </div>
        </div>
        <div style={{width: 10}}/>
        <Side/>
      </div>
    </div>
    <div style={{height: 100}}/>
  </div>);
}

export default connect(({informExhibitInfoPage}: ConnectState) => ({
  informExhibitInfoPage,
}))(Presentable);
