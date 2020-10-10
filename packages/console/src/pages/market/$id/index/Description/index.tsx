import * as React from 'react';
import {FTitleText} from '@/components/FText';
import styles from './index.less';
import {FTextButton} from '@/components/FButton';
import {FDown} from '@/components/FIcons';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageState} from '@/models/connect';
import {ChangeAction} from "@/models/marketResourcePage";

interface DescriptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageState;
}

function Description({dispatch, marketResourcePage}: DescriptionProps) {

  const refContainer = React.useRef<any>();

  React.useEffect(() => {
    setTimeout(() => {
      dispatch<ChangeAction>({
        type: 'marketResourcePage/change',
        payload: {
          showAllDescription: true,
        },
      });
      setTimeout(() => {
        if (refContainer.current.clientHeight > 300) {
          dispatch<ChangeAction>({
            type: 'marketResourcePage/change',
            payload: {
              showAllDescription: false,
            },
          });
        }
      });
    });
  }, [marketResourcePage.description]);

  return (<div className={styles.styles}>
    <FTitleText text={'版本描述'} type={'h3'}/>
    <div style={{height: 20}}/>
    <div
      ref={refContainer}
      style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
      dangerouslySetInnerHTML={{__html: marketResourcePage.description}}
      className={styles.content + ' ' + styles.container}
    />
    {
      !marketResourcePage.showAllDescription && (<>
        <div className={styles.mask}/>
        <div className={styles.footer}>
          <FTextButton theme="primary">展开查看全部 <FDown/></FTextButton>
        </div>
      </>)
    }

  </div>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Description);
