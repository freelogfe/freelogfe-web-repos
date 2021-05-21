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
import FTooltip from "@/components/FTooltip";
import {FWarning} from "@/components/FIcons";
import {RouteComponentProps} from "react-router";
import fConfirmModal from "@/components/fConfirmModal";
import FUtil from "@/utils";
import {FTextBtn} from "@/components/FButton";

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({dispatch, exhibitInfoPage, match}: PresentableProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'exhibitInfoPage/change',
      payload: {
        presentableId: match.params.id,
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
          {/*<FLink to={}>*/}
          <FTextBtn
            onClick={() => {
              window.open(FUtil.LinkTo.nodeManagement({nodeID: exhibitInfoPage.nodeId}));
            }}
            style={{fontWeight: 600}}
            type="default"
          >
            <FContentText
              type="negative"
              text={exhibitInfoPage.nodeName}
              className={styles.nodeName}
            />
          </FTextBtn>
          {/*</FLink>*/}
          <div style={{width: 2}}/>
          <FContentText
            type="negative"
            text={'>'}
          />
          <div style={{width: 2}}/>
          <FTitleText
            text={exhibitInfoPage.pName}
            style={{
              maxWidth: 800,
            }}
            singleRow
          />
        </div>
        <Space size={20}>
          {
            exhibitInfoPage.resourceType === 'theme'
              ? (<span
                style={{color: exhibitInfoPage.isOnline ? '#42C28C' : '#666'}}>{FUtil.I18n.message('toggle_activate_theme')}</span>)
              : (<span
                style={{color: exhibitInfoPage.isOnline ? '#42C28C' : '#666'}}>{FUtil.I18n.message('btn_show_exhibit')}</span>)
          }

          <FSwitch
            disabled={!exhibitInfoPage.isAuth || exhibitInfoPage.policies.filter((p) => p.status === 1).length === 0}
            checked={exhibitInfoPage.isOnline}
            onChange={(value) => {
              if (exhibitInfoPage.resourceType !== 'theme' || !exhibitInfoPage.nodeThemeId || !value) {
                dispatch<UpdateStatusAction>({
                  type: 'exhibitInfoPage/updateStatus',
                  payload: value ? 1 : 0,
                });
                return;
              }

              fConfirmModal({
                // message: FUtil.I18n.message('msg_change_theme_confirm'),
                message: '激活该主题，将下线其它主题',
                // okText: FUtil.I18n.message('active_new_theme'),
                okText: '激活',
                // cancelText: FUtil.I18n.message('keep_current_theme'),
                cancelText: '保持当前主题',
                onOk() {
                  dispatch<UpdateStatusAction>({
                    type: 'exhibitInfoPage/updateStatus',
                    payload: value ? 1 : 0,
                  });
                },
              });
            }}
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
