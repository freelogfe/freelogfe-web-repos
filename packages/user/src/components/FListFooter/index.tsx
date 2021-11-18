import * as React from 'react';
import styles from './index.less';
import { FRectBtn } from '../FButton';
import { FLoading } from '../FIcons';
import { FTipText } from '../FText';

interface FListFooterProps {
  state: 'andMore' | 'loading' | 'noMore';

  onClickLoadMore?(): void;
}

function FListFooter({ state, onClickLoadMore }: FListFooterProps) {
  return (<div className={styles.styles}>
    {
      state === 'andMore' && (<FRectBtn
        type='primary'
        onClick={() => {
          onClickLoadMore && onClickLoadMore();
        }}
      >
        加载更多
      </FRectBtn>)
    }

    {
      state === 'loading' && (<FLoading style={{ fontSize: 24 }} />)
    }

    {
      state === 'noMore' && (<FTipText text={'没有更多~'} type='third' />)
    }

  </div>);
}

export default FListFooter;
