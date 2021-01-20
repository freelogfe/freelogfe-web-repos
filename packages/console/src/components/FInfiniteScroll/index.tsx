import * as React from 'react';
import styles from './index.less';
import InfiniteScroll from 'react-infinite-scroller';

interface FInfiniteScrollProps {
  children: React.ReactNodeArray | React.ReactNode;

  loadMore(): void;

  hasMore?: boolean;
  loader?: React.ReactElement;
}

function FInfiniteScroll({children, loadMore, ...props}: FInfiniteScrollProps) {
  return (<InfiniteScroll
    // pageStart={0}
    loadMore={() => {
      console.log('######@!@#$!@#$@');
    }}
    hasMore={true}
    // loader={<div className="loader" key={0}>Loading ...</div>}
    // loadMore={loadMore}
  >
    {children}
  </InfiniteScroll>);
}

export default FInfiniteScroll;
