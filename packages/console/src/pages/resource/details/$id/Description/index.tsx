import * as React from 'react';
import styles from './index.less';
import {Dispatch, connect} from 'dva';
import {ConnectState, ResourceDetailPageModelState} from '@/models/connect';
import FExpandable from "./FExpandable";
import {FContentText} from "@/components/FText";
import FUtil1 from "@/utils";

interface DescriptionProps {
  dispatch: Dispatch;
  resourceDetailPage: ResourceDetailPageModelState;
}

function Description({dispatch, resourceDetailPage}: DescriptionProps) {

  return (<>
    <div style={{height: 30}}/>
    {
      !resourceDetailPage.description || resourceDetailPage.description === '<p></p>'
        ? (<FContentText
          text={FUtil1.I18n.message('description_empty')}
          type="negative"
        />)
        : (<div className={styles.styles}>
          <FExpandable>
            {resourceDetailPage.description && (<div
              // ref={refContainer}
              // style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
              dangerouslySetInnerHTML={{__html: resourceDetailPage.description}}
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
