import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import { withRouter, router } from 'umi';
import RouterTypes from 'umi/routerTypes';
import { ChangeAction } from '@/models/global';
import { Dispatch, connect } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import { RouteComponentProps } from 'react-router';
import { ChangeAction as DiscoverChangeAction } from '@/models/discoverPage';
import FResultTip from '@/components/FResultTip';
// import FGraph_Tree_Authorization_Exhibit from '@/components/FAntvG6/FGraph_Tree_Authorization_Exhibit';
// import FGraph_Tree_Relationship_Exhibit from '@/components/FAntvG6/FGraph_Tree_Relationship_Exhibit';
// import FGraph_State_Machine from '@/components/FAntvG6/FGraph_State_Machine';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FTooltip from '@/components/FTooltip';
import { LoadingOutlined } from '@ant-design/icons';
// import FHeaderNavigation from '@/components/FHeaderNavigation';
import * as AHooks from 'ahooks';
import { OnActiveAction } from '@/models/nodeManagerPage';
import fMessage from '@/components/fMessage';

// const fsmDescriptionInfo: PolicyFullInfo_Type['fsmDescriptionInfo'] = {
//   initial: {
//     transitions: [
//       {
//         toState: 'finish',
//         service: 'freelog',
//         name: 'RelativeTimeEvent',
//         args: { elapsed: 1, timeUnit: 'month' },
//         code: 'A103',
//         isSingleton: false,
//         eventId: '1b0662145c874a7fa9fba4a8a3479550',
//       },
//     ],
//     serviceStates: ['active'],
//     isInitial: true,
//     isAuth: true,
//     isTestAuth: false,
//   },
//   finish: {
//     transitions: [],
//     serviceStates: [],
//     isAuth: false,
//     isTestAuth: false,
//     isTerminate: true,
//   },
// };

let myInterval: NodeJS.Timeout | null = null;

interface SuccessProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
}

function Success({ match, route, dispatch }: RouterTypes & SuccessProps) {
  const [themeList, setThemeList] = React.useState<any[]>([]);
  const [emptyTheme, setEmptyTheme] = React.useState<any>(null);
  const [activeId, setActiveId] = React.useState<null | string>(null);
  const [emptyPopupShow, setEmptyPopupShow] = React.useState(false);
  const [successPopupShow, setSuccessPopupShow] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  AHooks.useMount(async () => {
    const [themeList, emptyThemeList] = await Promise.all([
      FServiceAPI.Resource.resourcesRecommend({ recommendType: 1 }),
      FServiceAPI.Resource.resourcesRecommend({ recommendType: 2 }),
    ]);
    setThemeList(themeList.data);
    setEmptyTheme(emptyThemeList.data[0]);
  });

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  // function goto() {
  //   dispatch<DiscoverChangeAction>({
  //     type: 'discoverPage/change',
  //     payload: {
  //       resourceType: 'theme',
  //     },
  //   });
  //   router.push(FUtil.LinkTo.market());
  // }

  /** 跳转资源详情页 */
  const toResourceDetail = (id: string) => {
    window.open(FUtil.LinkTo.resourceDetails({ resourceID: id }));
  };

  /** 跳转节点管理页 */
  const toNodeManagement = () => {
    router.push(FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id) }));
  };

  /** 跳转节点-主题管理页 */
  const toNodeThemeManagement = () => {
    myInterval && clearInterval(myInterval);
    router.push(
      FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id), showPage: 'theme' }),
    );
  };

  /** 激活主题 */
  const activeTheme = async (theme: any) => {
    if (activeId) return;

    setActiveId(theme.resourceId);

    // const params: Parameters<typeof FServiceAPI.Exhibit.createPresentable>[0] = {
    const params: any = {
      nodeId: Number(match.params.id),
      resourceId: theme.resourceId,
      version: theme.latestVersion,
      resolveResources: [
        {
          resourceId: theme.resourceId,
          contracts: [
            {
              policyId: theme.policies.find((item: any) => item.policyName === '开放授权').policyId,
            },
          ],
        },
      ],
      presentableName: theme.resourceName.split('/')[1],
      policies: [
        {
          policyName: '开放授权',
          policyText: 'for public initial[active]:\n  terminate',
          status: 1,
        },
      ],
    };
    let result = await FServiceAPI.Exhibit.createPresentable(params);

    if (result.errCode !== 0) {
      fMessage('激活失败', 'error');
      setActiveId(null);
      return;
    }

    const activeParams: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
      presentableId: result.data.presentableId,
      onlineStatus: 1,
    };
    result = await FServiceAPI.Exhibit.presentablesOnlineStatus(activeParams);

    if (result.errCode !== 0) {
      fMessage('激活失败', 'error');
      setActiveId(null);
      return;
    }

    let time = 3;
    setActiveId(null);
    setEmptyPopupShow(false);
    setSuccessPopupShow(true);
    setCountdown(time);

    myInterval = setInterval(() => {
      setCountdown(--time);
      if (time === 0) {
        myInterval && clearInterval(myInterval);
        router.push(
          FUtil.LinkTo.nodeManagement({ nodeID: Number(match.params.id), showPage: 'theme' }),
        );
      }
    }, 1000);
  };

  /** 开关占位主题弹窗 */
  const operateEmptyPopup = () => {
    setEmptyPopupShow(!emptyPopupShow);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tip}>
        <i className={`freelog fl-icon-a-chenggongzhengqueduigou1 ${styles['tip-icon']}`} />
        <div className={styles['tip-text']}>节点创建成功</div>
      </div>

      <div className={styles['recommend-area']}>
        <div className={styles.btns}>
          <div className={styles['develop-btn']} onClick={operateEmptyPopup}>
            我是主题/插件开发者
          </div>
          <div className={styles['skip-btn']} onClick={toNodeManagement}>
            稍后设置
          </div>
        </div>
        <div className={styles.title}>为你的节点选择一个主题</div>
        <div className={styles.desc}>
          主题决定了节点的整体外观和设计，你签约的展品将通过主题在节点陈列和展示。主题为节点提供了高度可定制话的可能，你可以根据需要随时更改节点的主题
        </div>
        <div className={styles.list}>
          {themeList.map((item) => {
            return (
              <div className={styles.theme} key={item.resourceId}>
                <div className={styles.cover}>
                  <img className={styles['cover-img']} src={item.coverImages[0]} />
                  <div className={styles.triangle}></div>
                  <div className={styles['free-text']}>免费</div>
                </div>
                <div className={styles['right-area']}>
                  <div className={styles['title-area']}>
                    <div className={styles.title}>{item.resourceName.split('/')[1]}</div>
                    <FTooltip title="查看资源详情">
                      <i
                        className={`freelog fl-icon-chakanziyuan ${styles['view-detail']}`}
                        onClick={() => toResourceDetail(item.resourceId)}
                      />
                    </FTooltip>
                  </div>
                  <div className={styles.intro}>{item.intro}</div>
                  <div className={styles.version}>最新版本 {item.latestVersion}</div>
                  <div className={styles['active-btn']} onClick={() => activeTheme(item)}>
                    {activeId === item.resourceId && <LoadingOutlined className={styles.loader} />}
                    激活主题
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {(emptyPopupShow || successPopupShow) && (
        <div className={styles.modal}>
          {emptyPopupShow && (
            <div className={styles['empty-popup']}>
              <div className={styles.title}>我是主题/插件开发者</div>
              <div className={styles.desc}>使用占位主题，可快速进行主题/插件的开发</div>
              <div className={styles.btns}>
                <div className={styles['cancel-btn']} onClick={operateEmptyPopup}>
                  取消
                </div>
                <div className={styles['active-btn']} onClick={() => activeTheme(emptyTheme)}>
                  {activeId === emptyTheme.resourceId && (
                    <LoadingOutlined className={styles.loader} />
                  )}
                  使用占位主题
                </div>
              </div>
              <i
                className={`freelog fl-icon-guanbi ${styles['close-btn']}`}
                onClick={operateEmptyPopup}
              />
            </div>
          )}

          {successPopupShow && (
            <div className={styles['success-popup']}>
              <i
                className={`freelog fl-icon-a-chenggongzhengqueduigou1 ${styles['success-icon']}`}
              />
              <div className={styles.title}>主题激活成功</div>
              <div className={styles.desc}>
                即将进入节点管理页（{countdown}s）
                <div className={styles['enter-btn']} onClick={toNodeThemeManagement}>
                  立即进入
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>

    // <FCenterLayout style={{ backgroundColor: 'white' }}>
    //   <div style={{ height: 100 }} />
    //   <div className={styles.modal}>
    //     <FResultTip
    //       // h1={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
    //       h1={'节点创建成功'}
    //       // h2={FUtil1.I18n.message('msg_nodecreatedsuccessfully')}
    //       h2={
    //         '主题决定节点的整体外观和设计，你可以通过激活不同的主题来更改节点的布局、配色方案等。'
    //       }
    //       // btnText={FUtil1.I18n.message('cta_btn_add_theme')}
    //       btnText={'添加主题'}
    //       onClickBtn={goto}
    //     />
    //   </div>
    // </FCenterLayout>
  );
}

export default withRouter(connect()(Success));
