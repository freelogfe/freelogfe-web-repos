import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ResourceDetailPageModelState } from '@/models/connect';
import FExpandable from './FExpandable';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface DescriptionProps {
  resourceDetailPage: ResourceDetailPageModelState;
}

function Description({ resourceDetailPage }: DescriptionProps) {

  return (<>
    <div style={{ height: 30 }} />
    {
      !resourceDetailPage.resourceVersion_Info.description || resourceDetailPage.resourceVersion_Info.description === '<p></p>'
        ? (<FComponentsLib.FContentText
          text={FI18n.i18nNext.t('description_empty')}
          type='negative'
        />)
        : (<div className={styles.styles}>
          <FExpandable>
            {resourceDetailPage.resourceVersion_Info.description && (<div
              // ref={refContainer}
              // style={{height: marketResourcePage.showAllDescription ? 'fit-content' : 300}}
              dangerouslySetInnerHTML={{ __html: resourceDetailPage.resourceVersion_Info.description }}
              className={styles.container}
            />)}
          </FExpandable>
        </div>)
    }

    <div style={{ height: 20 }} />
  </>);
}

export default connect(({ resourceDetailPage }: ConnectState) => ({
  resourceDetailPage,
}))(Description);
