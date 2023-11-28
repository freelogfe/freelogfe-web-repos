import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FResourceStatusBadge from '@/components/FResourceStatusBadge';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorBatchPageState } from '@/models/connect';
import { Dispatch } from 'redux';
import { FUtil } from '../../../../../../@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';

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
    }}>已完成批量发行
    </div>
    <div style={{ height: 30 }} />
    <div style={{
      fontSize: 16,
      fontWeight: 400,
      color: '#666',
      lineHeight: '22px',
    }}>已添加授权策略的资源将会自动上架，未上架的资源可在您补充授权策略后主动执行上架
    </div>
    <div style={{ height: 60 }} />
    <Space size={60}>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.myResources());
        }}
      >管理我的资源</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreator());
        }}
      >继续发行(单个)</FComponentsLib.FTextBtn>
      <FComponentsLib.FTextBtn
        type={'primary'}
        onClick={() => {
          self.open(FUtil.LinkTo.resourceCreatorBatch());
        }}
      >继续发行(批量)</FComponentsLib.FTextBtn>
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
                <FComponentsLib.FContentText text={result.resourceTitle} type={'highlight'} />
                <div style={{ height: 10 }} />
                <FComponentsLib.FContentText text={result.resourceName} type={'additional2'} />
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
                      : (<FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />)
                  }
                </div>
              </div>
            </div>
            <div className={styles.cardRight}>
              {
                result.failReason !== ''
                  ? (<Space size={5}>
                      <span style={{ color: '#EE4040' }}>发行失败</span>
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
                  >查看资源详情</FComponentsLib.FTextBtn>)
              }

            </div>
          </div>);
        })
      }


      {/*<div className={styles.card}>*/}
      {/*  <div className={styles.cardLeft}>*/}
      {/*    <div style={{ position: 'relative' }}>*/}
      {/*      <FCoverImage*/}
      {/*        src={''}*/}
      {/*        width={112}*/}
      {/*        style={{ display: 'block' }}*/}
      {/*      />*/}
      {/*      <div style={{ position: 'absolute', top: 5, left: 5 }}>*/}
      {/*        <FResourceStatusBadge*/}
      {/*          status={'online'}*/}

      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <FComponentsLib.FContentText text={'夕阳下停靠的船'} type={'highlight'} />*/}
      {/*      <div style={{ height: 10 }} />*/}
      {/*      <FComponentsLib.FContentText text={'夕阳下停靠的船'} type={'additional2'} />*/}
      {/*      <div style={{ height: 10 }} />*/}
      {/*      <div className={styles.MetaFooter}>*/}
      {/*        {*/}
      {/*          1 > 0*/}
      {/*            // ? resource.policy.map((i: string) => <Policy key={i} text={i} />)*/}
      {/*            ? (<FComponentsLib.F_Contract_And_Policy_Labels*/}
      {/*              data={['免费试用7天'].map((p) => {*/}
      {/*                return {*/}
      {/*                  text: p,*/}
      {/*                  dot: '',*/}
      {/*                };*/}
      {/*              })}*/}
      {/*              singleRow*/}
      {/*            />)*/}
      {/*            : (<FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />)*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className={styles.cardRight}>*/}
      {/*    <FComponentsLib.FTextBtn type={'primary'}>查看资源详情</FComponentsLib.FTextBtn>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className={styles.card}>*/}
      {/*  <div className={styles.cardLeft}>*/}
      {/*    <div style={{ position: 'relative' }}>*/}
      {/*      <FCoverImage*/}
      {/*        src={''}*/}
      {/*        width={112}*/}
      {/*        style={{ display: 'block' }}*/}
      {/*      />*/}
      {/*      <div style={{ position: 'absolute', top: 5, left: 5 }}>*/}
      {/*        <FResourceStatusBadge*/}
      {/*          status={'online'}*/}

      {/*        />*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div>*/}
      {/*      <FComponentsLib.FContentText text={'夕阳下停靠的船'} type={'highlight'} />*/}
      {/*      <div style={{ height: 10 }} />*/}
      {/*      <FComponentsLib.FContentText text={'夕阳下停靠的船'} type={'additional2'} />*/}
      {/*      <div style={{ height: 10 }} />*/}
      {/*      <div className={styles.MetaFooter}>*/}
      {/*        {*/}
      {/*          1 > 0*/}
      {/*            // ? resource.policy.map((i: string) => <Policy key={i} text={i} />)*/}
      {/*            ? (<FComponentsLib.F_Contract_And_Policy_Labels*/}
      {/*              data={['免费试用7天'].map((p) => {*/}
      {/*                return {*/}
      {/*                  text: p,*/}
      {/*                  dot: '',*/}
      {/*                };*/}
      {/*              })}*/}
      {/*              singleRow*/}
      {/*            />)*/}
      {/*            : (<FComponentsLib.FContentText text={'暂无策略…'} type='additional2' />)*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className={styles.cardRight}>*/}
      {/*    <FComponentsLib.FTextBtn type={'primary'}>查看资源详情</FComponentsLib.FTextBtn>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>

    <div style={{ height: 100 }} />
  </div>);
}

export default connect(({ resourceCreatorBatchPage }: ConnectState) => ({
  resourceCreatorBatchPage: resourceCreatorBatchPage,
}))(Finish);
