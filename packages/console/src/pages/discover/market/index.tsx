import * as React from 'react';
import { connect, Dispatch } from 'dva';
import { ConnectState, DiscoverPageModelState } from '@/models/connect';
import categoryData from '@/utils/category';
import styles from './index.less';
import useUrlState from '@ahooksjs/use-url-state';
// import { router } from 'umi';
import {
  OnChangeKeywordsAction,
  // OnChangeResourceTypeAction,
  OnClickLoadMoreBtnAction,
  OnMountMarketPageAction,
  // OnMountPageAction,
  OnUnmountMarketPageAction,
  // OnUnmountPageAction,
} from '@/models/discoverPage';
import FInput from '@/components/FInput';
import FResourceCard from '@/components/FResourceCard';
import { Button } from 'antd';
// import { router } from 'umi';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import * as AHooks from 'ahooks';

interface MarketProps {
  dispatch: Dispatch;
  discoverPage: DiscoverPageModelState;
}

function Market({ dispatch, discoverPage }: MarketProps) {
  const [urlState] = useUrlState<any>();
  const [category, setCategory] = React.useState<any>({
    first: -1,
    second: '',
  });
  console.log(urlState);

  AHooks.useMount(() => {
    if (urlState.query) {
      const data: any = urlState.query.split('%');
      let first = -1,
        second = '';
      categoryData.first.some((item: string, index: number) => {
        if (item === data[0]) {
          first = index;
          return true;
        }
      });
      // @ts-ignore
      first > -1 &&
      // @ts-ignore
        categoryData.second[first].some((item: string, index: number) => {
          if (item === data[1]) {
            second = item;
            return true;
          }
        });
      setCategory({
        first,
        second,
      });
      console.log(first, second)
    }
    dispatch<OnMountMarketPageAction>({
      type: 'discoverPage/onMountMarketPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountMarketPageAction>({
      type: 'discoverPage/onUnmountMarketPage',
    });
  });

  return (
    <>
      <div className={'mb-30 flex-column ' + styles.filter}>
        <div className="flex-row-center mt-30">
          <a
            onClick={() => {
              setCategory({
                ...category,
                first: -1,
              });
            }}
            className={(category.first === -1 ? styles.allSelected : '') + ' ' + styles.first}
          >
            <span className={styles.left}></span>
            <span className={styles.text}>全部</span>
            <span className={styles.right}></span>
          </a>
          {categoryData.first.map((item: string, index: number) => {
            return (
              <a
                onClick={() => {
                  setCategory({
                    ...category,
                    first: index,
                  });
                }}
                key={item}
                className={
                  (category.first === index
                    ? [0, 1].includes(index)
                      ? styles.allSelected
                      : styles.firstSelected
                    : '') +
                  ' ' +
                  styles.first
                  // + (index === categoryData.first.length - 1 ? '' : ' mr-30')
                }
              >
                <span className={styles.left}></span>
                <span className={styles.text}>{item}</span>
                <span className={styles.right}></span>
              </a>
            );
          })}
        </div>
        {category.first > 1 ? (
          <div className={'flex-row-center py-15 ' + styles.secondContainer}>
            {category.first > 1 &&
              // @ts-ignore
              categoryData.second[category.first].map((item: string, index: number) => {
                return (
                  <a
                    onClick={() => {
                      setCategory({
                        ...category,
                        second: item,
                      });
                    }}
                    key={item}
                    className={
                      (category.second === item ? styles.secondSelected : '') +
                      ' ' +
                      styles.second +
                      // @ts-ignore
                      (index === categoryData.second[category.first].length - 1 ? '' : ' mr-20')
                    }
                  >
                    {item}
                  </a>
                );
              })}
          </div>
        ) : null}
        <FInput
          value={discoverPage.inputText}
          debounce={300}
          onDebounceChange={(value) => {
            dispatch<OnChangeKeywordsAction>({
              type: 'discoverPage/onChangeKeywords',
              payload: {
                value: value,
              },
            });
          }}
          wrapClassName="self-end mt-45"
          theme="dark"
          size="small"
          className={styles.filterInput}
        />
      </div>
      {/* <Labels
        options={discoverPage.resourceTypeOptions}
        value={discoverPage.resourceType}
        onChange={(value) => {
          dispatch<OnChangeResourceTypeAction>({
            type: 'discoverPage/onChangeResourceType',
            payload: {
              value: value,
            },
          });
        }}
      /> */}

      {discoverPage.totalItem === -1 && <FLoadingTip height={'calc(100vh - 140px - 50px)'} />}

      {discoverPage.dataSource.length > 0 ? (
        <>
          <div style={{ height: 30 }} />
          <div className={styles.Content}>
            {discoverPage.dataSource.map((resource: any) => (
              <FResourceCard
                key={resource.id}
                resource={resource}
                className={styles.FResourceCard}
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.resourceDetails({
                      resourceID: resource.id,
                    }),
                  );
                }}
              />
            ))}
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
          </div>

          {discoverPage.totalItem > discoverPage.dataSource.length && (
            <>
              <div style={{ height: 100 }} />
              <div className={styles.bottom}>
                <Button
                  className={styles.loadMore}
                  onClick={() => {
                    dispatch<OnClickLoadMoreBtnAction>({
                      type: 'discoverPage/onClickLoadMoreBtn',
                    });
                  }}
                >
                  加载更多
                </Button>
              </div>
            </>
          )}
          <div style={{ height: 200 }} />
        </>
      ) : discoverPage.totalItem === 0 ? (
        <FNoDataTip height={'calc(100vh - 275px)'} tipText={'没有符合条件的资源'} />
      ) : null}
    </>
  );
}

export default connect(({ discoverPage }: ConnectState) => ({
  discoverPage: discoverPage,
}))(Market);

interface Labels {
  options: {
    value: string;
    text?: string;
  }[];
  value: string;
  onChange?: (value: string) => void;
}

function Labels({ options, value, onChange }: Labels) {
  return (
    <div>
      {options.map((i, j) => (
        <a
          key={i.value}
          className={styles.filterTag + ' ' + (i.value === value ? styles.filterTagActive : '')}
          onClick={() => onChange && onChange(i.value)}
        >
          {i.text || i.value}
        </a>
      ))}
    </div>
  );
}
