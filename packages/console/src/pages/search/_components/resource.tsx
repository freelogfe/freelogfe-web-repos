import * as React from 'react';
import styles from './index.less';
import CardContainer from './resource/cardContainer';
import ResourceInfo from './resource/info';
import PolicyTag from './resource/policyTag';
import { FServiceAPI, FI18n, FUtil } from '@freelog/tools-lib';
import FNoDataTip from '@/components/FNoDataTip';
import FCoverImage from '@/components/FCoverImage';
import FResourceCard from '@/components/FResourceCard';
import moment from 'moment';

interface ResourceListProps {
  onClick?: any;
  diabled?: boolean;
  className?: string;
  children?: any;
  resourcesList: {
    resourceId: string;
    resourceName: string;
    resourceTitle: string;
    resourceType: string[];
    latestVersion: string;
    coverImages: string[];
    status: 0 | 1;
    policies: {
      policyId: string;
      policyName: string;
      status: 0 | 1;
    }[];
    updateDate: string;
    username: string;
    userId: number;
  }[];
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
        resourcesList.map((i, index) => {
          // console.log(i, 'resource');
          // return null;
          return (<FResourceCard
            resource={{
              id: i.resourceId,
              cover: i.coverImages.length > 0 ? i.coverImages[0] : '',
              name: i.resourceName,
              title: i.resourceTitle,
              version: i.latestVersion,
              policy: i.policies
                .filter((l) => {
                  return l.status === 1;
                })
                .map((l: any) => l.policyName),
              type: i.resourceType,
              status: i.status,
              // authProblem: !!res && !res.isAuth,
              authProblem: true,
              updateDate: moment(i.updateDate).format('YYYY-MM-DD'),
              username: i.username,
              useAvatar: `https://image.freelog.com/avatar/${i.userId}`,
              isChoice: true,
            }}
            key={i.resourceId}
          />);
          // return !item._fake
          //   ? (
          //     <CardContainer
          //       key={item.resourceId + index}
          //       onClick={() => {
          //         window.open(
          //           FUtil.LinkTo.resourceDetails({
          //             resourceID: String(item.resourceId),
          //           }),
          //         );
          //       }}
          //     >
          //       <FCoverImage src={item.coverImages[0]} width={280} />
          //       <ResourceInfo
          //         name={item.resourceTitle || item.resourceName}
          //         type={item.resourceType.join(' / ')}
          //         version={item.latestVersion}
          //       />
          //       <div className='flex-row over-h'>
          //         {item.policies.filter((p: any) => {
          //           return p.status === 1;
          //         }).map((policy: any) => (
          //           <PolicyTag name={policy.policyName} key={policy.policyId} />
          //         ))}
          //       </div>
          //     </CardContainer>
          //   )
          //   : (
          //     <CardContainer
          //       className='d-none'
          //       diabled
          //       key={item.resourceId + index}
          //     />
          //   );
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
