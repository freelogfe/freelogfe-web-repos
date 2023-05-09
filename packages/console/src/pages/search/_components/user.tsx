import * as React from 'react';
import styles from './index.less';
import { FI18n } from '@freelog/tools-lib';

interface ResourceListProps {
  onClick?: any;
  diabled?: boolean;
  className?: string;
  children?: any;
  userList: any;
  keywords: any;
  userPageData: any;
  setUserPageData: any;
  setShowUserResource: any;
}

export default function ResourceList({
                                       userList,
                                       keywords,
                                       userPageData,
                                       setUserPageData,
                                       setShowUserResource,
                                     }: ResourceListProps) {
  return (
    <>
      {!userList.length ? (
        <div className='flex-column-center w-100x h-100x'>
          <div className='flex-2' />
          <span className={styles.none}>抱歉，没有找到与{' ' + keywords + ' '}相关的结果</span>
          <div className='flex-3' />
        </div>
      ) : (
        <div className={styles.tip + ' mb-40 w-100x'}>
          以下是{' ' + keywords + ' '}相关的结果（{userPageData.totalItem}）
        </div>
      )}
      <div className='flex-row flex-wrap space-between'>
        {userList.map((item: any, index: number) => (
          <div
            onClick={() => setShowUserResource(item)}
            key={item.userId}
            className={styles.userContainer + ' mb-20 flex-row align-center'}
          >
            <div className={styles.userimg + ' over-h shrink-0'}>
              <img src={item.headImage} className='w-100x' alt={''} />
            </div>
            <div className=' flex-column ml-20 h-100x flex-1 justify-center'>
              <span className={styles.userName}>{item.username}</span>
              <span className={styles.userResource + ' mt-10'}>
                {/*已上架{item.createdResourceCount}个资源*/}
                {FI18n.i18nNext.t('search_result_user_resource_qty', {
                  ResourceQty: item.createdResourceCount,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      {userPageData.totalItem > userList.length ? (
        <div className='flex-column-center w-100x py-50 cur-pointer'>
          <div
            onClick={() => {
              setUserPageData({
                ...userPageData,
                skip: userList.length,
              });
            }}
            className={styles.getMore}
          >
            加载更多
          </div>
        </div>
      ) : (
        <div className='h-50 w-100x'></div>
      )}
    </>
  );
}
