import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FCircleBtn, FCircleButton} from '@/components/FButton';
import {Progress, Space, Modal} from 'antd';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {
  ChangeAction,
  CreateBucketAction,
  DeleteBucketByNameAction,
} from '@/models/storageHomePage';
import {FDelete, FWarning} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";
import fMessage from "@/components/fMessage";
import fConfirmModal from "@/components/fConfirmModal";
import FLink from "@/components/FLink";
import FUtil from "@/utils";

interface SiderProps {
  dispatch: Dispatch;
  storageHomePage: StorageHomePageModelState;
}

function Sider({storageHomePage, dispatch}: SiderProps) {

  const siderRef = React.useRef<any>(null);
  const customBuckets = (storageHomePage.bucketList || []).filter((b) => b.bucketType === 1);
  const systemBuckets = (storageHomePage.bucketList || []).filter((b) => b.bucketType === 2);

  return (<>
    <div
      className={styles.sider}
      ref={siderRef}
    >
      <div>
        <div style={{height: 30}}/>
        <div className={styles.title}>
          <Space size={10}>
            <FTitleText
              text={`我的存储空间`}
              type="form"
            />
            <FTitleText
              text={`${(storageHomePage.bucketList || []).length}/5`}
              type="form"
            />
          </Space>

          <FCircleBtn
            type="transparent"
            onClick={() => {
              if ((storageHomePage.bucketList || []).length < 5) {
                dispatch<ChangeAction>({
                  type: 'storageHomePage/change',
                  payload: {
                    newBucketName: '',
                    newBucketNameError: false,
                    newBucketModalVisible: true,
                  },
                });
              } else {
                fMessage(FUtil.I18n.message('msg_bucket_quantity_exceed '), 'warning');
              }
            }}
          />
        </div>
        <div style={{height: 30}}/>
        {
          customBuckets.length > 0 ? (<div className={styles.navs}>
            {
              customBuckets
                .map((b) => {
                  return (<FLink
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
                      trigger={'hover'}
                      title={'删除'}
                      placement={'bottomLeft'}
                      // arrowPointAtCenter={true}
                      getPopupContainer={() => siderRef.current}
                    >
                      <FDelete
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // console.log('@#@#$dsiofud890saufoisdajfl;sd');
                          if (b.totalFileQuantity === 0) {
                            fConfirmModal({
                              message: '存储空间一旦删除则无法恢复，确认删除吗？',
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
          </div>) : (<div style={{padding: '0 40px'}}>
            <FContentText
              type="additional2"
              text={'单击“ + ”创建您的第一个项目。'}
            />
          </div>)
        }

      </div>

      <div className={styles.statistics}>
        <Progress
          strokeWidth={6}
          percent={storageHomePage.usedStorage / storageHomePage.totalStorage}
          showInfo={false}
          className={styles.progressBack}
        />
        <div
          className={styles.ratio}>{FUtil.Format.humanizeSize(storageHomePage.usedStorage)} / {FUtil.Format.humanizeSize(storageHomePage.totalStorage)}</div>

        {systemBuckets.length > 0 && (<>
          <div style={{height: 60}}/>

          <div className={styles.title}>
            <FTitleText text={'系统存储空间'} type="form"/>
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
        <div style={{height: 40}}/>
      </div>

    </div>

  </>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storageHomePage: storageHomePage,
}))(Sider);
