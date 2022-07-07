import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import styles from './index.less';
import FNavTabs from '@/components/FNavTabs';
import { FServiceAPI, FI18n } from '@freelog/tools-lib';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import { resolveResources } from '../../../../@freelog/tools-lib/src/service-API/resources';
import { Divider } from 'antd';
import FResourceCard, { FResourceCardProps } from '@/components/FResourceCard';
import CardContainer from './_components/resource/cardContainer';
import ResourceImage from './_components/resource/image';
import ResourceInfo from './_components/resource/info';
import PolicyTag from './_components/resource/policyTag';
interface SearchProps {}

function Search({}: SearchProps) {
  const [urlParams] = useUrlState<{
    search: string;
  }>();
  const [keywords, setKeywords] = useState<string>('');
  const [showUserResource, setShowUserResource] = useState(false);
  const [tab, setTab] = useState<'resource' | 'user'>('resource');
  const container: any = useRef(null);
  const userResourceContainer: any = useRef(null);
  AHooks.useMount(() => {
    setKeywords(urlParams.search || '');
  });
  const [userList, setUserList] = useState<any[]>([]);
  const [resourcesList, setResourcesList] = useState<any[]>([]);
  const [resourcesListPure, setResourcesListPure] = useState<any[]>([]);
  const [userResourcesList, setUserResourcesList] = useState<any[]>([]);
  const [userResourcesListPure, setUserResourcesListPure] = useState<any[]>([]);
  const [pageData, setPageData] = useState({
    skip: 0,
    limit: 30,
    totalItem: -1,
  });
  const [userPageData, setUserPageData] = useState({
    skip: 0,
    limit: 100,
    totalItem: -1,
  });
  const [userResourcePageData, setUserResourcePageData] = useState({
    skip: 0,
    limit: 100,
    totalItem: -1,
  });
  const getResources = () => {
    return FServiceAPI.Resource.list({
      keywords: keywords,
      // resourceType: selectedTags[0],
      status: 1,
      limit: pageData.limit,
      skip: pageData.skip,
    });
  };
  const getUsers = () => {
    return FServiceAPI.User.users({
      keywords: keywords,
      // resourceType: selectedTags[0],
      limit: userPageData.limit,
      skip: userPageData.skip,
    });
  };
  const getUserResources = () => {
    return FServiceAPI.Resource.list({
      keywords: keywords,
      // resourceType: selectedTags[0],
      status: 1,
      userId: '',
      limit: pageData.limit,
      skip: pageData.skip,
    });
  };
  const getData = () => {
    if (tab === 'resource') {
      return getResources();
    } else {
      if (showUserResource) {
        return getUserResources();
      }
      return getUsers();
    }
  };
  const { loading, data, error, refresh, run } = AHooks.useRequest(getData, {
    loadingDelay: 400,
    manual: true,
    refreshDeps: [keywords, pageData.skip, userPageData.skip],
  });
  useEffect(() => {
    run();
  }, [keywords]);
  useEffect(() => {
    if (userPageData.skip > 0) {
      run();
    }
  }, [userPageData.skip]);
  useEffect(() => {
    if (pageData.skip > 0) {
      run();
    }
  }, [pageData.skip]);
  useEffect(() => {
    if (userResourcePageData.skip > 0) {
      run();
    }
  }, [userResourcePageData.skip]);
  useEffect(() => {
    if (tab === 'resource' && !resourcesListPure.length) {
      run();
    }
    if (tab === 'user' && !userList.length) {
      run();
    }
  }, [tab]);
  const resolveResources = (res: any) => {
    let dataList: any = res.dataList;
    let supplyArray: any = [];
    if (container) {
      const maxCount = Math.floor(container.current.clientWidth / 300);
      let supply = 0;
      if (pageData.skip > 0) {
        dataList = [...resourcesListPure, ...dataList];
      } else {
        container.current.scrollTop = 0;
      }
      if (dataList.length > maxCount) {
        supply = dataList.length % maxCount;
        supply = supply > 0 ? Math.abs(maxCount - supply) : supply;
      }

      if (supply) {
        supplyArray = dataList.slice(0, supply).map((item: any, index: number) => {
          return {
            ...item,
            resourceId: item.resourceId + Math.random() + index,
            _fake: true,
          };
        });
      }
    }
    setPageData({ ...pageData, totalItem: res.totalItem });
    setResourcesListPure(dataList);
    setResourcesList([...dataList, ...supplyArray]);
  };
  const resolveUsers = (res: any) => {
    setUserPageData({ ...pageData, totalItem: res.totalItem });
    setUserList(res.dataList);
    console.log(res.dataList)
  };
  const resolveUserResources = (res: any) => {
    let dataList: any = res.dataList;
    let supplyArray: any = [];
    if (userResourceContainer) {
      const maxCount = Math.floor(userResourceContainer.current.clientWidth / 300);
      let supply = 0;
      if (userPageData.skip > 0) {
        dataList = [...userResourcesListPure, ...dataList];
      } else {
        userResourceContainer.current.scrollTop = 0;
      }
      if (dataList.length > maxCount) {
        supply = dataList.length % maxCount;
        supply = supply > 0 ? Math.abs(maxCount - supply) : supply;
      }

      if (supply) {
        supplyArray = dataList.slice(0, supply).map((item: any, index: number) => {
          return {
            ...item,
            resourceId: item.resourceId + Math.random() + index,
            _fake: true,
          };
        });
      }
    }
    setUserResourcePageData({ ...userPageData, totalItem: res.totalItem });
    setUserResourcesListPure(dataList);
    setUserResourcesList([...dataList, ...supplyArray]);
  };
  useEffect(() => {
    if (!data) return;
    console.log(data);
    // @ts-ignore
    const res: any = data.data;
    if (tab === 'resource') {
      resolveResources(res);
    }
    if (tab === 'user') {
      if (showUserResource) {
        resolveUserResources(res);
      } else {
        resolveUsers(res);
      }
    }
  }, [data]);

  return (
    <div className={styles.container + '  w-100x flex-column'}>
      <div className={styles.operation + ' flex-column align-center w-100x'}>
        <FInput
          value={keywords}
          debounce={300}
          allowClear={true}
          // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}
          onDebounceChange={(value) => {
            setPageData({
              ...pageData,
              skip: 0,
            });
            setKeywords(value);
          }}
          theme="dark"
          className={styles.input}
          placeholder={FI18n.i18nNext.t('输入关键词')}
        />
        <div className="flex-row ">
          <span
            onClick={() => setTab('resource')}
            className={
              (tab === 'resource' ? styles.active : styles.inactive) + ' mr-20  ' + styles.tab
            }
          >
            资源
          </span>
          <span
            onClick={() => setTab('user')}
            className={(tab === 'user' ? styles.active : styles.inactive) + ' ml-20  ' + styles.tab}
          >
            用户
          </span>
        </div>
      </div>
      <div className={styles.list + ' flex-1 w-100x over-h'}>
        {tab === 'user' && showUserResource ? <div ref={userResourceContainer}></div> : null}
        <div className="w-100x h-100x y-auto  px-115 flex-column-center">
          <div
            className={
              'flex-row flex-wrap h-100x   pt-40 h-100x' +
              (resourcesList.length > 3 ? ' space-between' : '')
            }
            ref={container}
          >
            {(!resourcesList.length && tab === 'resource') ||
            (tab === 'user' && !userResourcesList.length) ? (
              <div className="flex-column-center w-100x h-100x">
                <div className="flex-2"></div>
                <span className={styles.none}>
                  抱歉，没有找到与{' ' + keywords + ' '}相关的结果
                </span>
                <div className="flex-3"></div>
              </div>
            ) : (
              <div className={styles.tip + ' mb-40 w-100x'}>
                以下是{' ' + keywords + ' '}相关的结果（{resourcesListPure.length}）
              </div>
            )}
            {resourcesList.map((item: any, index: number) => {
              return !item._fake ? (
                <CardContainer
                  key={item.resourceId + index}
                  // onClick={() => goDetail(item.resourceId)}
                >
                  <ResourceImage
                    imgSrc={
                      item.coverImages[0]
                        ? item.coverImages[0]
                        : 'http://static.testfreelog.com/static/default_cover.png'
                    }
                  />
                  <ResourceInfo
                    name={item.resourceName}
                    type={item.resourceType}
                    version={item.latestVersion}
                  />
                  <div className="flex-row over-h">
                    {item.policies.map((policy: any) => (
                      <PolicyTag name={policy.policyName} key={policy.policyId} />
                    ))}
                  </div>
                </CardContainer>
              ) : (
                <CardContainer className="d-none" diabled key={item.resourceId + index} />
              );
            })}
            {pageData.totalItem > resourcesListPure.length ? (
              <div className="flex-column-center w-100x py-50 cur-pointer">
                <div
                  onClick={() => {
                    console.log(pageData, pageData.totalItem, resourcesListPure.length);
                    setPageData({
                      ...pageData,
                      skip: resourcesListPure.length,
                    });
                  }}
                  className={styles.getMore}
                >
                  加载更多
                </div>
              </div>
            ) : (
              <div className="h-50 w-100x"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
