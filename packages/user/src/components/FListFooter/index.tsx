import * as React from 'react';
import styles from './index.less';
// import { FLoading } from '../FIcons';
import FComponentsLib from '@freelog/components-lib';

interface FListFooterProps {
  state: 'andMore' | 'loading' | 'noMore';

  onClickLoadMore?(): void;
}

function FListFooter({ state, onClickLoadMore }: FListFooterProps) {
  return (<div className={styles.styles}>
    {
      state === 'andMore' && (<FComponentsLib.FRectBtn
        type='primary'
        onClick={() => {
          onClickLoadMore && onClickLoadMore();
        }}
      >
        加载更多
      </FComponentsLib.FRectBtn>)
    }

    {
      // state === 'loading' && (<FLoading style={{ fontSize: 24 }} />)
    }

    {
      state === 'noMore' && (<FComponentsLib.FTipText text={'没有更多~'} type='third' />)
    }

  </div>);
}

export default FListFooter;

interface listStateAndListMoreParams {
  list_Length: number;
  total_Length: number;
  has_FilterCriteria: boolean;
}

export function listStateAndListMore(payload: listStateAndListMoreParams): {
  state: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  more: 'loading' | 'andMore' | 'noMore';
} {
  let state: ReturnType<typeof listStateAndListMore>['state'];
  let more: ReturnType<typeof listStateAndListMore>['more'];

  if (payload.list_Length === 0) {
    if (!payload.has_FilterCriteria) {
      state = 'noData';
    } else {
      state = 'noSearchResult';
    }
    more = 'noMore';
  } else {
    if (payload.list_Length < payload.total_Length) {
      more = 'andMore';
    } else {
      more = 'noMore';
    }
    state = 'loaded';
  }
  return {
    state,
    more,
  };
}
