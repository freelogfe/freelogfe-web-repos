import * as React from 'react';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import {ConnectState, ResourceDetailPageModelState} from '@/models/connect';
import FExpandable from "./FExpandable";
import {FContentText} from "@/components/FText";
// import FUtil1 from "@/utils";
import { fI18nNext } from '@freelog/tools-lib';

interface DescriptionProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Description({dispatch, resourceDetailPage}: DescriptionProps) {

  return (<>
    <div style={{height: 30}}/>
    {
      !resourceDetailPage.resourceVersion_Info.description || resourceDetailPage.resourceVersion_Info.description === '<p></p>'
        ? (<FContentText
          text={fI18nNext.t('description_empty')}
          type="negative"
        />)
        : (<div className={styles.styles}>
          <FExpandable>
            {resourceDetailPage.resourceVersion_Info.description && (<div
              // ref={refContainer}
              // style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
              dangerouslySetInnerHTML={{__html: resourceDetailPage.resourceVersion_Info.description}}
              className={styles.container}
            />)}
          </FExpandable>
        </div>)
    }

    <div style={{height: 20}}/>
  </>);
}

export default connect(({resourceDetailPage}: ConnectState) => ({
  resourceDetailPage,
}))(Description);
