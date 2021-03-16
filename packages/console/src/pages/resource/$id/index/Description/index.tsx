import * as React from 'react';
import {FTitleText} from '@/components/FText';
import styles from './index.less';
import {FTextButton} from '@/components/FButton';
import {FDown} from '@/components/FIcons';
import {Dispatch, connect} from 'dva';
import {ConnectState, MarketResourcePageModelState} from '@/models/connect';
import {ChangeAction} from "@/models/marketResourcePage";
import FUp from "@/components/FIcons/FUp";
import FExpandable from "@/pages/resource/$id/index/Description/FExpandable";

interface DescriptionProps {
  dispatch: Dispatch;
  marketResourcePage: MarketResourcePageModelState;
}

// let devE: HTMLDivElement | null = null;

function Description({dispatch, marketResourcePage}: DescriptionProps) {

  if (!marketResourcePage.description || marketResourcePage.description === '<p></p>') {
    return null;
  }

  // const refContainer = React.useRef<any>();

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     dispatch<ChangeAction>({
  //       type: 'marketResourcePage/change',
  //       payload: {
  //         showAllDescription: true,
  //       },
  //     });
  //     setTimeout(() => {
  //       if (refContainer.current.clientHeight > 300) {
  //         dispatch<ChangeAction>({
  //           type: 'marketResourcePage/change',
  //           payload: {
  //             showAllDescription: false,
  //           },
  //         });
  //       }
  //     });
  //   });
  // }, [marketResourcePage.description]);

  return (<>
    <div style={{height: 30}}/>
    <div className={styles.styles}>
      {/*<FTitleText text={'版本描述'} type={'h3'}/>*/}
      {/*<div style={{height: 20}}/>*/}
      <FExpandable>
        {marketResourcePage.description && (<div
          // ref={refContainer}
          // style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
          dangerouslySetInnerHTML={{__html: marketResourcePage.description}}
          className={styles.container}
        />)}
      </FExpandable>
    </div>
    <div style={{height: 20}}/>
  </>);
}

export default connect(({marketResourcePage}: ConnectState) => ({
  marketResourcePage,
}))(Description);
