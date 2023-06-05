import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import Contracts from './Contracts';
import Policies from './Policies';
import Resources from './Resources';
import NodeSelector from './NodeSelector';
import Bottom from './Bottom';
import { Space, Tooltip } from 'antd';
import FCoverImage from '@/components/FCoverImage';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FUtil } from '@freelog/tools-lib';

interface SignProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Sign({ dispatch, resourceDetailPage }: SignProps) {
  const resourceInfoLength: number = resourceDetailPage.resource_Info?.about.length || 0;

  const resource = resourceDetailPage.sign_SignResources.find((r) => r.selected);

  return (<div className={styles.info}>
    <div className={styles.infoLeft}>
      <div>
        <FCoverImage src={resourceDetailPage.resource_Info?.cover || ''} width={260} style={{ borderRadius: 10 }} />
        <div style={{ height: 20 }} />
        <div className={styles.babels}>
          {
            (resourceDetailPage.resource_Info?.tags || []).filter((t, i) => i < 5).map((t) => (
              <label
                key={t}
                onClick={() => {
                  self.open(FUtil.LinkTo.globalSearch({ search: t }));
                }}
              >{t}</label>))
          }
        </div>
        <div style={{ height: 20 }} />

        <Tooltip
          title={resourceDetailPage.resource_Info?.about}
          mouseEnterDelay={3}
          overlayClassName={styles.TooltipOverlay}
          color={'rgba(0, 0, 0, 0.5)'}
          // visible={true}
          placement='right'
        >
          <div>
            <FComponentsLib.FContentText
              text={resourceInfoLength < 205 ? (resourceDetailPage.resource_Info?.about || '') : (resourceDetailPage.resource_Info?.about.substr(0, 205) + '...')} />
          </div>
        </Tooltip>
      </div>
    </div>
    <div className={styles.cell} />
    <div className={styles.infoRight}>
      <FComponentsLib.FHotspotTooltip
        id={'resourceDetailPage.nodeSelector'}
        style={{ left: '44%', top: 8 }}
        text={FI18n.i18nNext.t('hotpots_createnode_selectnode')}
        onMount={() => {
          FComponentsLib.fSetHotspotTooltipVisible('resourceDetailPage.nodeSelector', {
            value: false,
            effectiveImmediately: false,
            onlyNullish: true,
          });
        }}
      >
        <div className={styles.top}>
          <NodeSelector />
        </div>
      </FComponentsLib.FHotspotTooltip>
      <div className={styles.mid}>
        <div className={styles.sign}>
          <div className={styles.signLeft}>
            <Resources />
          </div>
          <div className={styles.signRight}>
            {
              resourceDetailPage.sign_SelectedNodeID === -1 && resourceDetailPage.user_Logged
                ? (<div className={styles.noNode}>
                  请先选择签约的节点…
                </div>)
                : (<>
                  {
                    resource && (resource.error === '' || (resource.error === 'offline' && resource.contracts.length > 0) ? (<>
                      {
                        resource.warning === 'authException' && (<>
                          <div style={{ height: 15 }} />
                          <Space size={10}>
                            <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
                            <span style={{ fontSize: 16, color: '#C78D12' }}>该资源授权链异常，请谨慎签约。</span>
                          </Space>
                        </>)
                      }

                      {
                        resource.warning === 'ownerFreeze' && (<>
                          <div style={{ height: 15 }} />
                          <Space size={10}>
                            <FComponentsLib.FIcons.FWarning style={{ fontSize: 20 }} />
                            <span style={{
                              fontSize: 16,
                              color: '#C78D12',
                            }}>该资源发行方账号因违规已被冻结，请谨慎处理授权。</span>
                          </Space>
                        </>)
                      }

                      <div style={{ height: 15 }} />
                      <Contracts />
                      {
                        resource.error === '' && (<Policies />)
                      }

                      <div style={{ height: 15 }} />
                    </>) : (<>
                      {
                        resource?.error === 'offline' && (<div className={styles.noNode}>
                          {FI18n.i18nNext.t('alarm_resource_not_available')}
                        </div>)
                      }
                      {
                        resource?.error === 'freeze' && <div className={styles.noNode}>
                          资源已封禁
                        </div>
                      }
                    </>))
                  }
                </>)
            }

          </div>
        </div>
      </div>
      <div className={styles.bot}>
        <Bottom />
      </div>

    </div>
  </div>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(Sign);
