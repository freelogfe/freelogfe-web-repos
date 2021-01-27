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
import {ConnectState, ExhibitInfoPageModelState} from '@/models/connect';
import {ChangeAction, FetchInfoAction, UpdateStatusAction} from '@/models/exhibitInfoPage';
import RouterTypes from 'umi/routerTypes';
import {nodeDetail} from '@/services/nodes';
import {FTextButton} from '@/components/FButton';
import {router} from 'umi';
import FTooltip from "@/components/FTooltip";
import {FWarning} from "@/components/FIcons";
import {informExhibitManagement, nodeManagement} from "@/utils/path-assembler";
import {RouteComponentProps} from "react-router";

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({dispatch, exhibitInfoPage, match}: PresentableProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        presentableId: (match.params as any).id,
      },
    });

    dispatch<FetchInfoAction>({
      type: 'exhibitInfoPage/fetchInfo',
    });
  }, []);

  return (<div className={styles.styles}>
    <div>
      <div className={styles.header}>
        <div className={styles.nav}>
          <FTextButton onClick={() => {
            // router.push(`/node/exhibit/formal/${exhibitInfoPage.nodeId}/informal`)
            router.push(nodeManagement({nodeID: exhibitInfoPage.nodeId}));
          }}><FContentText type="negative" text={exhibitInfoPage.nodeName}/></FTextButton>
          <div style={{width: 2}}/>
          <FContentText type="negative" text={'>'}/>
          <div style={{width: 2}}/>
          <FTitleText text={exhibitInfoPage.pName}/>
        </div>
        <Space size={20}>
          <span style={{color: '#666'}}>{exhibitInfoPage.isOnline ? '上线' : '未上线'}</span>
          <FSwitch
            disabled={!exhibitInfoPage.isAuth || exhibitInfoPage.policies.filter((p) => p.status === 1).length === 0}
            checked={exhibitInfoPage.isOnline}
            onChange={(value) => dispatch<UpdateStatusAction>({
              type: 'exhibitInfoPage/updateStatus',
              payload: value ? 1 : 0,
            })}
          />
          {
            !exhibitInfoPage.isAuth || exhibitInfoPage.policies.filter((p) => p.status === 1).length === 0 ? (
              <FTooltip title={!exhibitInfoPage.isAuth ? exhibitInfoPage.authErrorText : '暂无上线策略'}>
                <FWarning/>
              </FTooltip>) : ''
          }

        </Space>
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <div>
            <Policies/>
            <div style={{height: 50}}/>
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

export default connect(({exhibitInfoPage}: ConnectState) => ({
  exhibitInfoPage,
}))(Presentable);
