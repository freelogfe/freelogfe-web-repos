import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import { Dispatch } from 'redux';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import fSignResourceToNode from '@/components/fSignResourceToNode';
import { history } from '@@/core/history';
import fCenterMessage from '@/components/fCenterMessage';

interface FinishProps {
  dispatch: Dispatch;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}

function Finish({ dispatch, resourceCreatorBatchPage }: FinishProps) {
  return (<div className={styles.container4}>
    <div style={{ height: 60 }} />
    <div style={{
      fontSize: 30,
      fontWeight: 400,
      color: '#666',
      lineHeight: '42px',
    }}>{FI18n.i18nNext.t('brr_completed_msg')}
    </div>
    <div style={{ height: 30 }} />
    <div style={{
      fontSize: 16,
      fontWeight: 400,
      color: '#666',
      lineHeight: '22px',
    }}>{FI18n.i18nNext.t('brr_completed_msg2')}
    </div>
    <div style={{ height: 60 }} />
    <Space size={60}>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.myResources());
        }}
      >{FI18n.i18nNext.t('brr_completed_btn_viewmyresource')}</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreatorEntry());
        }}
      >{FI18n.i18nNext.t('brr_completed_btn_moretorelease_single')}</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={async () => {
          const resourceIDs: string[] = resourceCreatorBatchPage.resultList
            .filter((r) => {
              return r.status === 'online';
            })
            .map((r) => {
              return r.resourceID;
            });
          if (resourceIDs.length === 0) {
            fCenterMessage({ message: '不存在上线资源不能签约到节点' });
          }
          const result = await fSignResourceToNode({
            resourceIDs: resourceIDs,
          });
          if (result) {
            history.push(FUtil.LinkTo.nodeManagement({ nodeID: result.nodeID }));
          }
        }}
      >{FI18n.i18nNext.t('myresources_bulkaction_btn_addtomynode')}</FComponentsLib.FTextBtn>
    </Space>
    <div style={{ height: 50 }} />
    <div className={styles.list}>
      {
        resourceCreatorBatchPage.resultList.map((result) => {
          return (<div
            className={[styles.card, result.failReason !== '' ? styles.error : ''].join(' ')}
            key={result.resourceID}
          >
            <div className={styles.cardLeft}>
              <div style={{ position: 'relative' }}>
                <FCoverImage
                  src={result.cover}
                  width={112}
                  style={{ display: 'block' }}
                />
                <div style={{ position: 'absolute', top: 5, left: 5 }}>
                  <FResourceStatusBadge
                    status={result.status}
                  />
                </div>
              </div>
              <div>
                <FComponentsLib.FContentText
                  text={result.resourceTitle}
                  type={'highlight'}
                  singleRow
                  style={{ maxWidth: 400 }}
                />
                <div style={{ height: 10 }} />
                <FComponentsLib.FContentText
                  text={result.resourceName}
                  type={'additional2'}
                  singleRow
                  style={{ maxWidth: 400 }}
                />
                <div style={{ height: 10 }} />
                <div className={styles.MetaFooter}>
                  {
                    result.policies.length > 0
                      ? (<FComponentsLib.F_Contract_And_Policy_Labels
                        data={result.policies.map((p) => {
                          return {
                            text: p,
                            dot: '',
                          };
                        })}
                        singleRow
                      />)
                      : (<FComponentsLib.FContentText
                        text={FI18n.i18nNext.t('brr_completed_item_msg_noauthplan')}
                        type='additional2'
                      />)
                  }
                </div>
              </div>
            </div>
            <div className={styles.cardRight}>
              {
                result.failReason !== ''
                  ? (<Space size={5}>
                      <span style={{ color: '#EE4040' }}>{FI18n.i18nNext.t('brr_completed_item_error')}</span>
                      <FTooltip title={result.failReason}>
                        <FComponentsLib.FIcons.FInfo style={{ color: '#EE4040', fontSize: 16 }} />
                      </FTooltip>
                    </Space>
                  )
                  : (<FComponentsLib.FTextBtn
                    type={'primary'}
                    onClick={() => {
                      self.open(FUtil.LinkTo.resourceDetails({
                        resourceID: result.resourceID,
                      }));
                    }}
                  >{FI18n.i18nNext.t('brr_completed_item_btn_viewdetails')}</FComponentsLib.FTextBtn>)
              }

            </div>
          </div>);
        })
      }
    </div>

    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(Finish);
