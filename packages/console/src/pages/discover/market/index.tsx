import * as React from 'react';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, DiscoverPageModelState } from '@/models/connect';
import styles from './index.less';
import {
  OnClickLoadMoreBtnAction,
  OnUnmountMarketPageAction,
  OnMountMarketPageAction,
  OnChange_SelectedOperationCategoryIDs_Action,
} from '@/models/discoverPage';
import FResourceCard from '@/components/FResourceCard';
import { Button } from 'antd';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import * as AHooks from 'ahooks';
import FOperationCategoryFilter from '@/components/FOperationCategoryFilter';

interface MarketProps {
  dispatch: Dispatch;
  discoverPage: DiscoverPageModelState;
}

function Market({ dispatch, discoverPage }: MarketProps) {

  AHooks.useMount(() => {
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
      <div>
        <FOperationCategoryFilter
          value={discoverPage.selectedOperationCategoryIDs}
          onChange={(value) => {
            console.log(value);
            dispatch<OnChange_SelectedOperationCategoryIDs_Action>({
              type: 'discoverPage/onChange_SelectedOperationCategoryIDs',
              payload: {
                value: value,
              },
            });
          }}
        />
      </div>
      {/*<div className={'flex-column ' + styles.filter}>*/}
      {/*  <div className='flex-row-center mt-30'>*/}
      {/*    <a*/}
      {/*      onClick={() => {*/}
      {/*        setCategory({*/}
      {/*          second: '',*/}
      {/*          first: -1,*/}
      {/*        });*/}
      {/*      }}*/}
      {/*      className={(category.first === -1 ? styles.allSelected : '') + ' ' + styles.first}*/}
      {/*    >*/}
      {/*      <span className={styles.left} />*/}
      {/*      <span className={styles.text}>全部</span>*/}
      {/*      <span className={styles.right} />*/}
      {/*    </a>*/}

      {/*    {*/}
      {/*      discoverPage.operationCategories*/}
      {/*        .filter((operationCategory) => {*/}
      {/*          return operationCategory.depth === 0;*/}
      {/*        })*/}
      {/*        .map((operationCategory) => {*/}
      {/*        if (operationCategory.depth === 0) {*/}
      {/*          return (<a*/}
      {/*            key={operationCategory.id}*/}
      {/*            className={*/}
      {/*              (category.first === index*/}
      {/*                ? [0, 1].includes(index)*/}
      {/*                  ? styles.allSelected*/}
      {/*                  : styles.firstSelected*/}
      {/*                : '') +*/}
      {/*              ' ' +*/}
      {/*              styles.first*/}
      {/*              // + (index === categoryData.first.length - 1 ? '' : ' mr-30')*/}
      {/*            }*/}
      {/*          >*/}
      {/*            <span className={styles.left} />*/}
      {/*            <span className={styles.text}>{item}</span>*/}
      {/*            <span className={styles.right} />*/}
      {/*          </a>)*/}
      {/*        }*/}
      {/*      })*/}
      {/*    }*/}

      {/*    {categoryData.first.map((item: string, index: number) => {*/}
      {/*      return (*/}
      {/*        <a*/}
      {/*          onClick={() => {*/}
      {/*            setCategory({*/}
      {/*              second: category.first === index ? category.second : '',*/}
      {/*              first: index,*/}
      {/*            });*/}
      {/*          }}*/}
      {/*          key={item}*/}
      {/*          className={*/}
      {/*            (category.first === index*/}
      {/*              ? [0, 1].includes(index)*/}
      {/*                ? styles.allSelected*/}
      {/*                : styles.firstSelected*/}
      {/*              : '') +*/}
      {/*            ' ' +*/}
      {/*            styles.first*/}
      {/*            // + (index === categoryData.first.length - 1 ? '' : ' mr-30')*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <span className={styles.left} />*/}
      {/*          <span className={styles.text}>{item}</span>*/}
      {/*          <span className={styles.right} />*/}
      {/*        </a>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*    <a*/}
      {/*      onClick={() => {*/}
      {/*        setCategory({*/}
      {/*          second: '',*/}
      {/*          first: -2,*/}
      {/*        });*/}
      {/*      }}*/}
      {/*      className={(category.first === -2 ? styles.allSelected : '') + ' ' + styles.first}*/}
      {/*    >*/}
      {/*      <span className={styles.left} />*/}
      {/*      <span className={styles.text}>#内测集结！漫画家召集令</span>*/}
      {/*      <span className={styles.right} />*/}
      {/*    </a>*/}
      {/*    <a*/}
      {/*      onClick={() => {*/}
      {/*        setCategory({*/}
      {/*          second: '',*/}
      {/*          first: -3,*/}
      {/*        });*/}
      {/*      }}*/}
      {/*      className={(category.first === -3 ? styles.allSelected : '') + ' ' + styles.first}*/}
      {/*    >*/}
      {/*      <span className={styles.left} />*/}
      {/*      <span className={styles.text}>#内测集结！小说家召集令</span>*/}
      {/*      <span className={styles.right} />*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*  {category.first > 1 ? (*/}
      {/*    <div className={'flex-row-center py-15 ' + styles.secondContainer}>*/}
      {/*      {category.first > 1 &&*/}
      {/*      // @ts-ignore*/}
      {/*      categoryData.second[category.first].map((item: string, index: number) => {*/}
      {/*        return (*/}
      {/*          <a*/}
      {/*            onClick={() => {*/}
      {/*              console.log(item);*/}
      {/*              setCategory({*/}
      {/*                ...category,*/}
      {/*                second: item === category.second ? '' : item,*/}
      {/*              });*/}
      {/*            }}*/}
      {/*            key={item}*/}
      {/*            className={*/}
      {/*              (category.second === item ? styles.secondSelected : '') +*/}
      {/*              ' ' +*/}
      {/*              styles.second +*/}
      {/*              // @ts-ignore*/}
      {/*              (index === categoryData.second[category.first].length - 1 ? '' : ' mr-20')*/}
      {/*            }*/}
      {/*          >*/}
      {/*            {item}*/}
      {/*          </a>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </div>*/}
      {/*  ) : null}*/}
      {/*</div>*/}

      {discoverPage.totalItem === -1 && <FLoadingTip height={'calc(100vh - 140px - 50px)'} />}

      {
        discoverPage.dataSource.length > 0 ? (<>
            <div style={{ height: 30 }} />
            <div className={styles.Content}>
              {
                discoverPage.dataSource.map((resource) => (
                  <FResourceCard
                    key={resource.id}
                    resource={resource}
                    // className={styles.FResourceCard}
                    onClick={() => {
                      window.open(
                        FUtil.LinkTo.resourceDetails({
                          resourceID: resource.id,
                        }),
                      );
                    }}
                  />
                ))
              }
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
          </>)
          : discoverPage.totalItem === 0
            ? (<FNoDataTip height={'calc(100vh - 275px)'} tipText={'没有符合条件的资源'} />)
            : null
      }
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
