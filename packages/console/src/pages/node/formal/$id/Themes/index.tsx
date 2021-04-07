import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import FInput from '@/components/FInput';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import {Space} from 'antd';
import {FWarning} from '@/components/FIcons';
import {connect, Dispatch} from 'dva';
import {ConnectState, NodeManagerModelState} from "@/models/connect";
import {OnActiveAction, OnChangeThemeAction, OnOnlineOrOfflineAction} from "@/models/nodeManagerPage";
import {router} from "umi";
// import {i18nMessage} from "@/utils/i18n";
import FNoDataTip from "@/components/FNoDataTip";
import {ChangeAction as MarketChangeAction} from "@/models/marketPage";
import FLoadingTip from "@/components/FLoadingTip";
import FLeftSiderLayout from "@/layouts/FLeftSiderLayout";
import Sider from "@/pages/node/formal/$id/Sider";
import FTooltip from "@/components/FTooltip";
// import FLinkTo from "@/utils/path-assembler";
import FLink from "@/components/FLink";
import fConfirmModal from "@/components/fConfirmModal";
import FDivider from "@/components/FDivider";
import FUtil from "@/utils";

interface ThemesProps {
  dispatch: Dispatch;
  nodeManagerPage: NodeManagerModelState;
}

function Themes({dispatch, nodeManagerPage}: ThemesProps) {

  if (nodeManagerPage.themeDataState === 'loading') {
    return (<FLoadingTip height={'calc(100vh - 70px)'}/>);
  }

  // if (nodeManagerPage.themeDataState === 'noData') {
  //   return (<FNoDataTip
  //     height={}
  //     tipText={'当前节点没有添加主题展品'}
  //     btnText={'添加主题展品'}
  //     onClick={() => {
  //       dispatch<MarketChangeAction>({
  //         type: 'marketPage/change',
  //         payload: {
  //           resourceType: 'theme',
  //         }
  //       });
  //       router.push('/market');
  //     }}
  //   />);
  // }

  return (<FLeftSiderLayout
    // header={''}
    sider={<Sider/>}
    type="empty"
  >

    {
      nodeManagerPage.themeDataState === 'noData'
        ? (<FNoDataTip
          height={'calc(100vh - 70px)'}
          tipText={'当前节点没有添加主题展品'}
          btnText={'添加主题展品'}
          onClick={() => {
            dispatch<MarketChangeAction>({
              type: 'marketPage/change',
              payload: {
                resourceType: 'theme',
              }
            });
            router.push(FUtil.LinkTo.market());
          }}
        />)
        : (<>
          <div className={styles.header}>
            <FTitleText type="h1" text={'主题管理'}/>
            <FInput
              className={styles.input}
              theme="dark"
              debounce={300}
              onDebounceChange={(value) => dispatch<OnChangeThemeAction>({
                type: 'nodeManagerPage/onChangeTheme',
                payload: {
                  themeInputFilter: value,
                },
              })}
            />
          </div>
          {
            nodeManagerPage.themeDataState === 'noSearchData'
              ? (<FNoDataTip height={'calc(100vh - 170px)'} tipText={'无搜索结果'}/>)
              : (<div className={styles.body}>
                {
                  nodeManagerPage.themeList.map((i) => {
                    const hasActiveBtn: boolean = !i.isOnline && i.isAuth && i.policies.length > 0;
                    return (<div
                      className={styles.theme}
                      key={i.id}
                    >
                      <div className={styles.cover}>
                        <Space size={10}>
                          <Label active={i.isOnline}/>
                          {!i.isAuth || i.policies.length === 0 ? <FTooltip title={!i.isAuth ? i.authErrorText : '暂无上线策略'}>
                            <FWarning/>
                          </FTooltip> : ''}
                        </Space>

                        <img
                          alt=""
                          src={i.cover || imgSrc}
                        />

                        <div
                          className={styles.action}
                          // style={{padding: hasActiveBtn ? '0 20px' : undefined}}
                        >
                          <div style={{width: 1}}/>
                          <FLink to={FUtil.LinkTo.exhibitManagement({exhibitID: i.id})}>编辑</FLink>
                          <FDivider/>
                          <FLink to={FUtil.LinkTo.resourceDetails({resourceID: i.resourceId})}>资源详情</FLink>
                          {
                            hasActiveBtn && (<>
                              <FDivider/>
                              <a onClick={() => {

                                if (!nodeManagerPage.nodeThemeId) {
                                  dispatch<OnActiveAction>({
                                    type: 'nodeManagerPage/onActive',
                                    payload: {
                                      id: i.id,
                                    }
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
                                    dispatch<OnActiveAction>({
                                      type: 'nodeManagerPage/onActive',
                                      payload: {
                                        id: i.id,
                                      }
                                    });
                                  },
                                });

                              }}>激活</a>
                            </>)
                          }
                          <div style={{width: 1}}/>
                        </div>
                      </div>
                      <div style={{height: 12}}/>
                      <FContentText
                        text={i.title}
                        singleRow
                      />
                      <div style={{height: 6}}/>
                      <FContentText type="additional1" text={i.version}/>
                      <div style={{height: 15}}/>
                      <div className={styles.bottom}>
                        <div className={styles.polices}>
                          {
                            i.policies.map((p) => (<label key={p}>{p}</label>))
                          }
                        </div>
                        <a onClick={() => null}>{FUtil.I18n.message('more_details')}>></a>
                      </div>
                    </div>);
                  })
                }
                <div style={{width: 290}}/>
                <div style={{width: 290}}/>
              </div>)
          }
        </>)
    }

  </FLeftSiderLayout>);
}

export default connect(({nodeManagerPage}: ConnectState) => ({
  nodeManagerPage,
}))(Themes);

interface LabelProps {
  active?: boolean
}

function Label({active = true}: LabelProps) {
  return (<label
    className={styles.label + ' ' + (active ? styles.labelActive : styles.labelInActive)}>{active ? '已激活' : '未激活'}</label>);
}
