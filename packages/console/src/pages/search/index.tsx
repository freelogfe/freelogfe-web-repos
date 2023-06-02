import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import styles from './index.less';
import { FServiceAPI, FI18n } from '@freelog/tools-lib';
import FInput from '@/components/FInput';
import * as AHooks from 'ahooks';
import useUrlState from '@ahooksjs/use-url-state';
import ResourceList from './_components/resource';
import UserList from './_components/user';
import Drawer from './_components/drawer';
import fMessage from '@/components/fMessage';
import FOperationCategoryFilter from '@/components/FOperationCategoryFilter';
// import {
//   OnChangeResourceTypeAction,
//   OnClickLoadMoreBtnAction,
//   OnChangeTagsAction,
//   OnUnmountMarketPageAction,
//   OnMountMarketPageAction,
//   OnChange_SelectedOperationCategoryIDs_Action,
// } from '@/models/discoverPage';
interface SearchProps {}

function Search({}: SearchProps) {
  const [urlParams] = useUrlState<{
    search: string;
  }>();
  const [keywords, setKeywords] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
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
  const [selectedOperationCategoryIDs, setSelectedOperationCategoryIDs] =
    useState<any[]>(['#all']);
  const [pageData, setPageData] = useState({
    skip: 0,
    limit: 40,
    totalItem: -1,
  });
  const [userPageData, setUserPageData] = useState({
    skip: 0,
    limit: 40,
    totalItem: -1,
  });
  const [userResourcePageData, setUserResourcePageData] = useState({
    skip: 0,
    limit: 40,
    totalItem: -1,
  });
  const getResources = () => {
    console.log(selectedOperationCategoryIDs);
    return FServiceAPI.Resource.list({
      keywords: keywords,
      // resourceType: selectedTags[0],
      status: 1,
      limit: pageData.limit,
      skip: pageData.skip,
      operationCategoryCode: selectedOperationCategoryIDs
        .filter((c) => c !== '#all')
        .pop(),
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
      userId: selectedUser.userId,
      limit: userResourcePageData.limit,
      skip: userResourcePageData.skip,
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
    if (keywords) run();
  }, [keywords]);
  useEffect(() => {
    run();
  }, [selectedOperationCategoryIDs]);
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
    if (tab === 'resource' && keywords) {
      run();
    }
    if (tab === 'user' && keywords) {
      run();
    }
  }, [tab]);
  useEffect(() => {
    if (selectedUser) {
      run();
    }
  }, [selectedUser]);
  const resolveResources = (res: any) => {
    let dataList: any = res.dataList;
    let supplyArray: any = [];
    if (container.current) {
      const maxCount = Math.floor((container.current.clientWidth || 0) / 300);
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
        supplyArray = dataList
          .slice(0, supply)
          .map((item: any, index: number) => {
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
  const resolveUsers = async (res: any) => {
    const ids = res.dataList.map((item: any) => item.userId).join(',');
    const data = await FServiceAPI.Resource.resourcesCount({
      userIds: ids,
      status: 1,
    });
    res.dataList.forEach((item: any) => {
      data.data.some((i: any) => {
        if (i.userId === item.userId) {
          item.createdResourceCount = i.createdResourceCount;
          return true;
        }
        return false;
      });
    });

    setUserPageData({ ...userPageData, totalItem: res.totalItem });
    setUserList(res.dataList);
  };
  const resolveUserResources = (res: any) => {
    let dataList: any = res.dataList;
    let supplyArray: any = [];
    if (userResourceContainer) {
      const maxCount = Math.floor(
        userResourceContainer.current.clientWidth / 300,
      );
      let supply = 0;
      if (userResourcePageData.skip > 0) {
        dataList = [...userResourcesListPure, ...dataList];
      } else {
        userResourceContainer.current.scrollTop = 0;
      }
      if (dataList.length > maxCount) {
        supply = dataList.length % maxCount;
        supply = supply > 0 ? Math.abs(maxCount - supply) : supply;
      }

      if (supply) {
        supplyArray = dataList
          .slice(0, supply)
          .map((item: any, index: number) => {
            return {
              ...item,
              resourceId: item.resourceId + Math.random() + index,
              _fake: true,
            };
          });
      }
    }
    setUserResourcePageData({
      ...userResourcePageData,
      totalItem: res.totalItem,
    });
    setUserResourcesListPure(dataList);
    setUserResourcesList([...dataList, ...supplyArray]);
  };
  useEffect(() => {
    if (!data) return;
    console.log(data);

    if (data.errCode) {
      fMessage(data.msg, 'error');
      return;
    }
    // @ts-ignore
    const res: any = data.data;
    if (tab === 'resource') {
      setPageData({
        skip: 0,
        limit: 40,
        totalItem: -1,
      });
      setResourcesListPure([]);
      setResourcesList([]);
      resolveResources(res);
    }
    if (tab === 'user') {
      if (showUserResource) {
        setUserResourcePageData({
          skip: 0,
          limit: 40,
          totalItem: -1,
        });
        setUserResourcesListPure([]);
        setUserResourcesList([]);
        resolveUserResources(res);
      } else {
        setUserPageData({
          skip: 0,
          limit: 40,
          totalItem: -1,
        });
        setUserList([]);
        resolveUsers(res);
      }
    }
  }, [data]);

  return (
    <div className={styles.container + '  flex-column '}>
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
            onClick={() => {
              setTab('resource');
              setShowUserResource(false);
            }}
            className={
              (tab === 'resource' ? styles.active : styles.inactive) +
              ' mr-20  ' +
              styles.tab
            }
          >
            资源
          </span>
          <span
            onClick={() => setTab('user')}
            className={
              (tab === 'user' ? styles.active : styles.inactive) +
              ' ml-20  ' +
              styles.tab
            }
          >
            用户
          </span>
        </div>
      </div>
      <div className={styles.list + ' flex-1 w-100x '}>
        {tab === 'user' ? (
          <div className="w-100x h-100x    flex-column align-center">
            {showUserResource && (
              <div className="w-100x h-100x   px-115 flex-column-center">
                <div
                  className={
                    'flex-row flex-wrap h-100x   pt-40 w-100x' +
                    (userResourcesList.length > 3 ? ' space-between' : '')
                  }
                >
                  <Drawer
                    close={() => {
                      setShowUserResource(false);
                    }}
                  >
                    <div
                      className={styles.closeContainer + ' flex-column-center'}
                      onClick={() => setShowUserResource(false)}
                    >
                      <i className={styles.close + ' freelog fl-icon-guanbi'} />
                    </div>
                    <div className={'h-100x ' + styles.cContainer}>
                      <div className="flex-row align-center mb-20 mt-6 ml-10">
                        <div className={styles.userimg + ' over-h shrink-0'}>
                          <img
                            src={selectedUser.headImage}
                            className="w-100x"
                          />
                        </div>
                        <span className={styles.userName}>
                          {selectedUser.username}
                        </span>
                        <span className={styles.userResource}>
                          {/*上架的资源（{selectedUser.createdResourceCount}）*/}
                          {FI18n.i18nNext.t(
                            'search_result_user_resource_qty02',
                            {
                              ResourceQty: selectedUser.createdResourceCount,
                            },
                          )}
                        </span>
                      </div>
                      <div
                        className={
                          'flex-row flex-wrap h-100x   w-100x ' +
                          (userResourcesListPure.length > 3
                            ? ' space-between'
                            : '')
                        }
                        ref={userResourceContainer}
                      >
                        <ResourceList
                          resourcesList={userResourcesList}
                          keywords={keywords}
                          resourcesListPure={userResourcesListPure}
                          pageData={userResourcePageData}
                          setPageData={setUserResourcePageData}
                        />
                      </div>
                    </div>
                  </Drawer>
                </div>
              </div>
            )}
            <div className={'flex-column h-100x   pt-40 w-920 '}>
              <UserList
                setShowUserResource={(user: any) => {
                  setSelectedUser(user);
                  setShowUserResource(true);
                }}
                userList={userList}
                keywords={keywords}
                userPageData={userPageData}
                setUserPageData={setUserPageData}
              />
            </div>
          </div>
        ) : (
          <div className="w-100x h-100x   px-115 flex-column-center">
            <div
              className={
                'h-100x   pt-40  flex-column-center ' + styles.rContainer
              }
            >
              <div>
                <FOperationCategoryFilter
                  value={selectedOperationCategoryIDs}
                  onChange={(value) => {
                    setSelectedOperationCategoryIDs(value);
                  }}
                />
              </div>
              {!resourcesListPure.length ? (
                <div className="flex-column-center w-100x h-100x">
                  {/*<div className="flex-2" />*/}
                  <span className={styles.none}>
                    抱歉，没有找到与{' ' + keywords + ' '}相关的结果
                  </span>
                  {/*<div className="flex-3" />*/}
                </div>
              ) : (
                <>
                  <div className={styles.tip + ' mb-20 w-100x ml-18'}>
                    以下是{' ' + keywords + ' '}相关结果（{pageData.totalItem}）
                  </div>

                  <div
                    className={
                      'flex-row flex-wrap h-100x w-100x   ' +
                      (resourcesListPure.length > 3 ? ' space-between' : '')
                    }
                    ref={container}
                  >
                    <ResourceList
                      resourcesList={resourcesList}
                      keywords={keywords}
                      resourcesListPure={resourcesListPure}
                      pageData={pageData}
                      setPageData={setPageData}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
