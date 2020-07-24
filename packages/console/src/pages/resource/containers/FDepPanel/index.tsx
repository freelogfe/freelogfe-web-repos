import * as React from 'react';

import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FCircleButton} from '@/components/FButton';
import {CopyOutlined} from '@ant-design/icons';
import {Space, Drawer} from 'antd';
import Resources from './Resources';
import Contracts from './Contracts';
import Policies from './Policies';
import IsUpthrow from './IsUpthrow';
import UpthrowList from './UpthrowList';
import Market from './Market';
import {connect} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState} from '@/models/connect';

export interface FDepPanelProps {
  // dispatch: Dispatch;
  creator: ResourceVersionCreatorPageModelState;
}

function FDepPanel({creator}: FDepPanelProps) {

  const [modalVisible, setModalVisible] = React.useState<boolean>(false);

  return (<>
    <Space size={80}>
      <Space size={10}>
        <FCircleButton
          onClick={() => setModalVisible(true)}
          theme="weaken"
        />
        <FContentText text={'添加'}/>
      </Space>
      <Space size={10}>
        <FCircleButton
          theme="weaken"
          icon={<CopyOutlined/>}
        />
        <FContentText text={'从上一版本导入'}/>
      </Space>
    </Space>

    {
      creator.depRelationship.length > 0 && (<>
        <UpthrowList/>

        <div style={{height: 20}}/>
        <div className={styles.DepPanel}>

          <div className={styles.DepPanelNavs}>
            <div>
              <Resources/>
            </div>
          </div>

          <div className={styles.DepPanelContent}>
            <div>

              <IsUpthrow/>

              <Contracts/>

              <Policies/>

            </div>
          </div>
        </div>
      </>)
    }


    <Drawer
      title={'添加依赖'}
      onClose={() => setModalVisible(false)}
      visible={modalVisible}
      width={820}
      bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    >
      <Market/>
    </Drawer>
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  creator: resourceVersionCreatorPage,
}))(FDepPanel);
