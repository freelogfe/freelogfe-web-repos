import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import { ChangeAction } from '@/models/resourceDetailPage';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { FUtil, FI18n } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FComponentsLib from '@freelog/components-lib';
import FAutoOverflowTooltipTitle from '@/components/FAutoOverflowTooltipTitle';

interface ResourcesProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Resources({ dispatch, resourceDetailPage }: ResourcesProps) {

  function onChangeSelected(id: string) {
    dispatch<ChangeAction>({
      type: 'resourceDetailPage/change',
      payload: {
        sign_SignResources: resourceDetailPage.sign_SignResources.map((sr) => ({
          ...sr,
          selected: id === sr.id,
        })),
      },
    });
  }

  return (<>
    <div style={{ height: 7 }} />
    <div className={styles.signLeftNav}>选择主资源授权策略</div>
    {
      resourceDetailPage.sign_SignResources
        .filter((r, i: number) => i === 0)
        .map((r) => {
          return (<div
            key={r.id}
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            onClick={() => onChangeSelected(r.id)}
          >
            <FAutoOverflowTooltipTitle
              title={r.name}
              right={<>
                {
                  r.error === 'offline' && (<>
                    <FResourceStatusBadge status={'offline'} />
                    <div style={{ width: 5 }} />
                  </>)
                }

                {
                  r.error === 'freeze' && (<>
                    <FResourceStatusBadge status={'freeze'} />
                    <div style={{ width: 5 }} />
                  </>)
                }

                {
                  r.error === 'unreleased' && (<>
                    <FResourceStatusBadge status={'unreleased'} />
                    <div style={{ width: 5 }} />
                  </>)
                }

                {
                  r.error === '' && r.warning === 'authException' && (<>
                    <div style={{ width: 5 }} />
                    <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning
                      style={{ fontSize: 16 }} /></FTooltip>
                  </>)
                }

                {
                  r.error === '' && r.warning === 'ownerFreeze' && (<>
                    <div style={{ width: 5 }} />
                    <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning
                      style={{ fontSize: 16 }} /></FTooltip>
                  </>)
                }
              </>}
            />
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText
              type='additional2'
              text={FUtil.Format.resourceTypeKeyArrToResourceType(r.type)}
            />
            <div style={{ height: 5 }} />
            {
              resourceDetailPage.sign_SelectedNodeID !== -1 && [...r.contracts, ...r.policies]
                .filter((c) => {
                  return c.checked;
                })
                .length === 0
                ? (<div style={{
                  color: '#E9A923',
                  fontSize: 12,
                  lineHeight: '18px',
                  fontWeight: 400,
                }}>未处理授权</div>)
                : (<FComponentsLib.F_Contract_And_Policy_Labels
                  data={[
                    ...r.contracts
                      .filter((c) => {
                        return c.checked;
                      })
                      .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                        return {
                          text: c.name,
                          dot: c.status === 'inactive' ? 'yellow' : 'green',
                        };
                      }),
                    ...r.policies
                      .filter((p) => {
                        return p.checked;
                      })
                      .map<{ text: string; dot: '' }>((p) => {
                        return {
                          text: p.fullInfo.policyName,
                          dot: '',
                        };
                      }),
                  ]}
                />)
            }
          </div>);
        })
    }

    {
      resourceDetailPage.sign_SignResources.length > 1 && (
        <div className={styles.signLeftNav}>选择基础上抛授权策略</div>)
    }

    {
      resourceDetailPage.sign_SignResources
        .filter((r, i: number) => i !== 0)
        .map((r) => {
          return (<div
            className={styles.signResource + ' ' + (r.selected ? styles.activatedSignResource : '')}
            key={r.id}
            onClick={() => onChangeSelected(r.id)}
          >
            <FAutoOverflowTooltipTitle
              title={r.name}
              right={<>

                {
                  r.error === 'offline' && (<>
                    <div style={{ width: 5 }} />
                    <FResourceStatusBadge status={'offline'} />
                  </>)
                }

                {
                  r.error === 'unreleased' && (<>
                    <div style={{ width: 5 }} />
                    <FResourceStatusBadge status={'unreleased'} />
                  </>)
                }

                {
                  r.error === 'freeze' && (<>
                    <div style={{ width: 5 }} />
                    <FResourceStatusBadge status={'freeze'} />
                  </>)
                }

                {
                  r.error === '' && r.warning === 'authException' && (<>
                    <div style={{ width: 5 }} />
                    <FTooltip title={'存在授权问题'}><FComponentsLib.FIcons.FWarning
                      style={{ fontSize: 16 }} /></FTooltip>
                  </>)
                }

                {
                  r.error === '' && r.warning === 'ownerFreeze' && (<>
                    <div style={{ width: 5 }} />
                    <FTooltip title={'该资源发行方账号因违规已被冻结'}><FComponentsLib.FIcons.FWarning
                      style={{ fontSize: 16 }} /></FTooltip>
                  </>)
                }

                <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
                  <div>
                    <FComponentsLib.FTextBtn
                      type={'primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(FUtil.LinkTo.resourceDetails({
                          resourceID: r.id,
                        }));
                      }}>
                      <FComponentsLib.FIcons.FFileSearch className={styles.FFileSearch} />
                    </FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>
              </>}
            />
      
            <div style={{ height: 5 }} />
            <FComponentsLib.FContentText
              type='additional2'
              text={FUtil.Format.resourceTypeKeyArrToResourceType(r.type)}
            />
            <div style={{ height: 5 }} />
            {
              resourceDetailPage.sign_SelectedNodeID !== -1 && [...r.contracts, ...r.policies]
                .filter((c) => {
                  return c.checked;
                })
                .length === 0
                ? (<div style={{
                  color: '#E9A923',
                  fontSize: 12,
                  lineHeight: '18px',
                  fontWeight: 400,
                }}>未处理授权</div>)
                : (<FComponentsLib.F_Contract_And_Policy_Labels
                  data={[
                    ...r.contracts
                      .filter((c) => {
                        return c.checked;
                      })
                      .map<{ text: string; dot: 'yellow' | 'green' }>((c) => {
                        return {
                          text: c.name,
                          dot: c.status === 'inactive' ? 'yellow' : 'green',
                        };
                      }),
                    ...r.policies
                      .filter((p) => {
                        return p.checked;
                      })
                      .map<{ text: string; dot: '' }>((p) => {
                        return {
                          text: p.fullInfo.policyName,
                          dot: '',
                        };
                      }),
                  ]}
                />)
            }

          </div>);
        })
    }
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({ resourceDetailPage }))(Resources);
