import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {Progress} from 'antd';
import FModal from '@/components/FModal';
import FInput from '@/components/FInput';
import {connect, Dispatch} from "dva";
import {ConnectState, StorageHomePageModelState} from "@/models/connect";
import {ChangeAction} from "@/models/storageHomePage";

interface SiderProps {
  dispatch: Dispatch;
  storage: StorageHomePageModelState,
}

const navs = [];

function Sider({storage, dispatch}: SiderProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  return (<div className={styles.sider}>
    <div className={styles.title}>
      <FTitleText text={'我的存储空间'} type="form"/>
      <FCircleButton
        theme="text"
        onClick={() => setModalVisible(true)}
      />
    </div>
    <div style={{height: 18}}/>
    {
      navs.length > 0 ? (<div className={styles.buckets}>
        <a className={styles.bucketActive}>bucket-001</a>
        <a>bucket-002</a>
        <a>bucket-003</a>
      </div>) : (<FContentText
        type="additional2" text={'单击“ + ”创建您的第一个项目。'}/>)
    }

    <div style={{height: 130}}/>

    <Progress
      strokeWidth={6}
      percent={30}
      showInfo={false}
      className={styles.progressBack}
    />
    <div className={styles.ratio}>23.5 MB / 2 GB</div>

    <div style={{height: 60}}/>

    <div className={styles.title}>
      <FTitleText text={'系统存储空间'} type="form"/>
      {/*<FCircleButton theme="text"/>*/}
    </div>

    <div style={{height: 18}}/>
    <div className={styles.buckets}>
      {/*<a className={styles.bucketActive}>bucket-001</a>*/}
      <a>.Nodedata</a>
      {/*<a>bucket-003</a>*/}
    </div>

    <FModal
      title="创建Bucket"
      visible={modalVisible}
      width={640}
      // onOk={this.handleOk}
      onCancel={() => setModalVisible(false)}
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
              },
            });
          }}
          wrapClassName={styles.wrapClassName}
          className={styles.FInput}
          errorText={<div>
            <div>只能包括小写字母、数字和短横线（-）；</div>
            <div>必须以小写字母或者数字开头和结尾 ；</div>
            <div>长度必须在 1–63 字符之间。</div>
          </div>}
        />
        <div style={{height: 100}}/>
      </div>
    </FModal>
  </div>);
}

export default connect(({storageHomePage}: ConnectState) => ({
  storage: storageHomePage,
}))(Sider);
