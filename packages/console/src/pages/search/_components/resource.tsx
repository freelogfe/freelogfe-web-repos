import * as React from 'react';
import styles from './index.less';
import CardContainer from './resource/cardContainer';
// import ResourceImage from './resource/image';
import ResourceInfo from './resource/info';
import PolicyTag from './resource/policyTag';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';
import FNoDataTip from '@/components/FNoDataTip';
import FCoverImage from '@/components/FCoverImage';

interface ResourceListProps {
  onClick?: any;
  diabled?: boolean;
  className?: string;
  children?: any;
  resourcesList: any;
  keywords: any;
  resourcesListPure: any;
  pageData: any;
  setPageData: any;
}

export default function ResourceList({
                                       resourcesList,
                                       keywords,
                                       resourcesListPure,
                                       pageData,
                                       setPageData,
                                     }: ResourceListProps) {
  // console.log(resourcesList, 'sdoifjsdl;kfjl;ksdjflksdjflkjl');
  return (
    <>
      {
        resourcesList.map((item: any, index: number) => {
          return !item._fake
            ? (
              <CardContainer
                key={item.resourceId + index}
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.resourceDetails({
                      resourceID: String(item.resourceId),
                    }),
                  );
                }}
              >
                <FCoverImage src={item.coverImages[0]} width={280}/>
                {/*<ResourceImage*/}
                {/*  imgSrc={*/}
                {/*    item.coverImages[0]*/}
                {/*      ? item.coverImages[0]*/}
                {/*      : '//static.freelog.com/static/default_cover.png'*/}
                {/*  }*/}
                {/*/>*/}
                <ResourceInfo
                  name={item.resourceTitle || item.resourceName}
                  type={item.resourceType.join(' / ')}
                  version={item.latestVersion}
                />
                <div className='flex-row over-h'>
                  {item.policies.map((policy: any) => (
                    <PolicyTag name={policy.policyName} key={policy.policyId} />
                  ))}
                </div>
              </CardContainer>
            )
            : (
              <CardContainer className='d-none' diabled key={item.resourceId + index} />
            );
        })}
      <div style={{ width: 300 }} />
      <div style={{ width: 300 }} />
      <div style={{ width: 300 }} />
      {
        pageData.totalItem > resourcesListPure.length
          ? (
            <div className='flex-column-center w-100x py-50 cur-pointer'>
              <div
                onClick={() => {
                  // console.log(pageData, pageData.totalItem, resourcesListPure.length);
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
          )
          : (
            <div className='h-50 w-100x'>
              {
                pageData.totalItem === 0 && (<FNoDataTip height={600} tipText={'暂无上架资源'} />)
              }
            </div>
          )
      }


    </>
  );
}
