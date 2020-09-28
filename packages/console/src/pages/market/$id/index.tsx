import * as React from 'react';
import styles from './index.less';
import FCenterLayout from '@/layouts/FCenterLayout';
import {Dispatch, connect} from 'dva';
import {ChangeAction} from '@/models/global';
import {FTitleText} from '@/components/FText';
import FCopyToClipboard from "@/components/FCopyToClipboard";

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

      <div className={styles.info}>
        <div className={styles.infoLeft}>
          <img
            className={styles.cover}
            src={'https://image.freelog.com/preview-image/f3b712c4a7a052d71226e1d5b1c0c3342ae8d725'}/>
          <div style={{height: 10}}/>
          <div>
            <FTitleText text={'stefan/Smells like teen spirit'}/>
            <FCopyToClipboard
              text={'stefan/Smells like teen spirit'}
              title={'复制资源名称'}
            />
          </div>

        </div>
        <div className={styles.cell}/>
        <div className={styles.infoRight}>

        </div>
      </div>
    </div>
  </FCenterLayout>);
}


export default connect()(ResourceDetails);
