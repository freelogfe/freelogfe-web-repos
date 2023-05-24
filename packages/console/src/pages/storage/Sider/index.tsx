import * as React from 'react';
import styles from './index.less';
import { Progress, Space } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState } from '@/models/connect';
import {
  DeleteBucketByNameAction,
} from '@/models/storageHomePage';
import FTooltip from '@/components/FTooltip';
import fMessage from '@/components/fMessage';
import fConfirmModal from '@/components/fConfirmModal';
import FLink from '@/components/FLink';
import { FUtil, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import FComponentsLib from '@freelog/components-lib';

interface SiderProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Sider({ storageHomePage, dispatch }: SiderProps) {

  const siderRef = React.useRef<any>(null);
  const customBuckets = (storageHomePage.bucketList || []).filter((b) => b.bucketType === 1);
  const systemBuckets = (storageHomePage.bucketList || []).filter((b) => b.bucketType === 2);

  return (<>
    <div
      className={styles.sider}
      ref={siderRef}
    >
      <div>
        <div style={{ height: 30 }} />
        <div className={styles.title}>
          <Space size={10}>
            <FComponentsLib.FTitleText
              // text={`我的存储空间`}
              text={FI18n.i18nNext.t('my_buckets')}
              type='h4'
            />
            <FComponentsLib.FTitleText
              text={`${(storageHomePage.bucketList || []).length}/5`}
              type='h4'
            />
          </Space>

          {
            (storageHomePage.bucketList || []).length < 5
              ? (<FComponentsLib.FCircleBtn
                type='transparent'
                onClick={() => {
                  history.replace(FUtil.LinkTo.storageSpace({
                    bucketName: storageHomePage.activatedBucket,
                    createBucket: true,
                  }));
                }}
              />)
              : (<FTooltip
                title={FI18n.i18nNext.t('msg_bucket_quantity_exceed')}
                trigger='click'
                placement='topLeft'
              >
                <FComponentsLib.FCircleBtn type='transparent' />
              </FTooltip>)
          }

        </div>
        <div style={{ height: 30 }} />
        {
          customBuckets.length > 0 ? (<div className={styles.navs}>
            {
              customBuckets
                .map((b) => {
                  return (<FLink
                    replace
                    key={b.bucketName}
                    className={storageHomePage.activatedBucket === b.bucketName
                      ? styles.activated
                      : ''}
                    to={FUtil.LinkTo.storageSpace({
                      bucketName: b.bucketName,
                    })}
                  >
                    <span>{b.bucketName}</span>
                    <FTooltip
                      title={FI18n.i18nNext.t('tip_delete')}
                      // arrowPointAtCenter={true}
                      getPopupContainer={() => siderRef.current}
                    >
                      <FComponentsLib.FIcons.FDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // console.log('@#@#$dsiofud890saufoisdajfl;sd');
                          if (b.totalFileQuantity === 0) {
                            fConfirmModal({
                              message: FI18n.i18nNext.t('msg_delete_object_confirm'),
                              okText: FI18n.i18nNext.t('btn_delete_object'),
                              cancelText: FI18n.i18nNext.t('btn_cancel'),
                              onOk() {
                                dispatch<DeleteBucketByNameAction>({
                                  type: 'storageHomePage/deleteBucketByName',
                                  payload: b.bucketName,
                                });
                              },
                            });
                          } else {
                            fMessage('该存储空间内还有未删除模拟资源', 'warning');
                          }
                        }}
                        className={styles.bucketDeleteBtn}
                      />
                    </FTooltip>
                  </FLink>);
                })
            }
          </div>) : (<div style={{ padding: '0 40px' }}>
            <FComponentsLib.FContentText
              type='additional2'
              // text={'单击“ + ”创建您的第一个项目。'}
              text={FI18n.i18nNext.t('my_buckets_list_empty')}
            />
          </div>)
        }

      </div>

      <div className={styles.statistics}>
        <Progress
          strokeWidth={6}
          percent={storageHomePage.usedStorage / storageHomePage.totalStorage * 100}
          showInfo={false}
          className={styles.progressBack}
        />
        <div
          className={styles.ratio}>{FUtil.Format.humanizeSize(storageHomePage.usedStorage)} / {FUtil.Format.humanizeSize(storageHomePage.totalStorage)}</div>

        {systemBuckets.length > 0 && (<>
          <div style={{ height: 60 }} />

          <div className={styles.title}>
            <FComponentsLib.FTitleText text={'系统存储空间'} type='h4' />
          </div>

          {/*<div style={{height: 18}}/>*/}
          {/*<div className={styles.buckets}>*/}
          {/*  <a*/}
          {/*    className={storage.activatedBucket === '.UserNodeData' ? styles.bucketActive : ''}*/}
          {/*    onClick={() => dispatch<OnChangeActivatedBucketAction>({*/}
          {/*      type: 'storageHomePage/onChangeActivatedBucket',*/}
          {/*      payload: '.UserNodeData',*/}
          {/*    })}>.Nodedata</a>*/}
          {/*</div>*/}
        </>)}
        <div style={{ height: 40 }} />
      </div>

    </div>

  </>);
}

export default connect(({ storageHomePage }: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Sider);
