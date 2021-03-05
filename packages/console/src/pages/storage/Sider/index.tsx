import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FCircleButton, FNormalButton} from '@/components/FButton';
import {Popconfirm, Progress, Space} from 'antd';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState} from '@/models/connect';
import {
  ChangeAction,
  CreateBucketAction,
  DeleteBucketByNameAction,
  OnChangeActivatedBucketAction
} from '@/models/storageHomePage';
import {humanizeSize} from '@/utils/format';
import {FDelete} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";
import {i18nMessage} from "@/utils/i18n";
import {NavLink} from 'umi';
import {storageSpace} from "@/utils/path-assembler";

interface SiderProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState;
}


function Sider({storage, dispatch}: SiderProps) {

  // const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  const customBuckets = (storage.bucketList || []).filter((b) => b.bucketType === 1);
  const systemBuckets = (storage.bucketList || []).filter((b) => b.bucketType === 2);

  // React.useEffect(() => {
  //     dispatch<OnChangeActivatedBucketAction>({
  //       type: 'storageHomePage/onChangeActivatedBucket',
  //       payload: b.bucketName,
  //     });
  // }, []);

  return (<>
    <div className={styles.sider}>
      <div>
        <div style={{height: 45}}/>
        <div className={styles.title}>
          <Space size={10}>
            <FTitleText
              text={`我的存储空间`}
              type="form"
            />
            <FTitleText
              text={`${(storage.bucketList || []).length}/5`}
              type="form"
            />
          </Space>
          {
            (storage.bucketList || []).length < 5
              ? (<FCircleButton
                theme="text"
                onClick={() => dispatch<ChangeAction>({
                  type: 'storageHomePage/change',
                  payload: {
                    newBucketName: '',
                    newBucketNameError: false,
                    newBucketModalVisible: true,
                  },
                })}
              />)
              : (<FTooltip title={i18nMessage('msg_bucket_quantity_exceed ')}>
                <div><FCircleButton
                  theme="text"
                  size="small"
                  // disabled
                /></div>
              </FTooltip>)
          }
        </div>
        <div style={{height: 18}}/>
        {/*storage*/}
        {
          customBuckets.length > 0 ? (<div className={styles.buckets}>
            {
              customBuckets
                .map((b) => (<NavLink
                  key={b.bucketName}
                  className={storage.activatedBucket === b.bucketName
                    ? styles.bucketActive
                    : ''}
                  to={storageSpace({
                    bucketName: b.bucketName,
                  })}
                  // onClick={() => {
                  //   if (storage.activatedBucket === b.bucketName) {
                  //     return;
                  //   }
                  //   dispatch<OnChangeActivatedBucketAction>({
                  //     type: 'storageHomePage/onChangeActivatedBucket',
                  //     payload: b.bucketName,
                  //   });
                  // }}
                >
                  <span>{b.bucketName}</span>
                  {storage.activatedBucket === b.bucketName && b.totalFileQuantity === 0 && <Popconfirm
                    title={'确定删除吗？'}
                    onConfirm={() => {
                      dispatch<DeleteBucketByNameAction>({
                        type: 'storageHomePage/deleteBucketByName',
                        payload: b.bucketName,
                      });
                    }}
                  ><FDelete
                    // onClick={}
                    style={{color: '#EE4040'}}
                  />
                  </Popconfirm>}
                </NavLink>))
            }
          </div>) : (<FContentText
            type="additional2" text={'单击“ + ”创建您的第一个项目。'}/>)
        }

      </div>

      <div>
        <Progress
          strokeWidth={6}
          percent={storage.usedStorage / storage.totalStorage}
          showInfo={false}
          className={styles.progressBack}
        />
        <div className={styles.ratio}>{humanizeSize(storage.usedStorage)} / {humanizeSize(storage.totalStorage)}</div>

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

    <FModal
      title="创建Bucket"
      visible={storage.newBucketModalVisible}
      width={640}
      onOk={() => {
        dispatch<CreateBucketAction>({
          type: 'storageHomePage/createBucket',
        });
        // setModalVisible(false);
      }}
      onCancel={() => dispatch<ChangeAction>({
        type: 'storageHomePage/change',
        payload: {
          newBucketModalVisible: false,
        },
      })}
    >
      <div className={styles.FModalBody}>
        <div style={{height: 50}}/>
        <ul className={styles.tip}>
          <li>请注意存储空间的名称一但创建则不可修改</li>
          <li>Freelog为每个用户提供2GB的免费存储空间</li>
        </ul>
        <div style={{height: 10}}/>
        <FInput
          value={storage.newBucketName}
          onChange={(e) => {
            dispatch<ChangeAction>({
              type: 'storageHomePage/change',
              payload: {
                newBucketName: e.target.value,
                newBucketNameError: false,
              },
            });
          }}
          wrapClassName={styles.wrapClassName}
          className={styles.FInput}
          errorText={storage.newBucketNameError ? (<div>
            <div>只能包括小写字母、数字和短横线（-）；</div>
            <div>必须以小写字母或者数字开头和结尾 ；</div>
            <div>长度必须在 1–63 字符之间。</div>
          </div>) : ''}
        />
        <div style={{height: 100}}/>
      </div>
    </FModal>

  </>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Sider);
