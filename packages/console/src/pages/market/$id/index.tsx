import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {Dispatch, connect} from 'dva';
import {ChangeAction} from '@/models/global';
import Sign from './Sign';
import {FTitleText, FContentText} from '@/components/FText';
import {FSwap} from "@/components/FIcons";

interface ResourceDetailsProps {
  dispatch: Dispatch;
}

function ResourceDetails({dispatch}: ResourceDetailsProps) {

  React.useEffect(() => {
    dispatch<ChangeAction>({
      type: 'global/change',
      payload: {
        backgroundColor: 'white',
      },
    });
    return () => {
      // console.log('#E#####EEEEE');
      dispatch<ChangeAction>({
        type: 'global/change',
        payload: {
          backgroundColor: '',
        },
      });
    }
  }, []);

  return (<FCenterLayout>
    <div className={styles.wrap}>
      <div style={{height: 40}}/>
      <Sign/>
      <div style={{height: 50}}/>
      <div>
        <div className={styles.versionTitle}>
          <FTitleText text={'当前版本 10.15.4'}/>
          <div style={{width: 15}}/>
          <FContentText text={'发布时间 2020/05/19'} type="additional1"/>
          <div style={{width: 20}}/>
          <FSwap/>
        </div>

      </div>
    </div>
  </FCenterLayout>);
}


export default connect()(ResourceDetails);
