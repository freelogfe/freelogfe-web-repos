import * as React from 'react';
import styles from './index.less';
import { Button, Space } from 'antd';
import FMenu from '@/components/FMenu';
import FInput from '@/components/FInput';
import { history } from 'umi';
import FResourceCard, { FResourceCardProps } from '@/components/FResourceCard';
// import { DownOutlined } from '@ant-design/icons';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil, FI18n } from '@freelog/tools-lib';
import categoryData from '@/utils/category';
import FComponentsLib from '@freelog/components-lib';

// const resourceTypeOptions = [
//   { text: '全部', value: '-1' },
//   ...FUtil.Predefined.resourceTypes.map((i) => ({ value: i })),
// ];

const resourceStatusOptions = [
  { text: FI18n.i18nNext.t('filter_resource_status_all'), value: '#' },
  // { text: '上架', value: 1 },
  { text: FI18n.i18nNext.t('filter_resource_status_pendingauth'), value: 1 },
  // { text: '下架', value: 4 },
  { text: FI18n.i18nNext.t('filter_resource_status_availableforauth'), value: 4 },
  // { text: '待发行', value: 0 },
  { text: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'), value: 0 },
  // { text: '冻结', value: 2 },
  { text: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'), value: 2 },
];

type EventFunc = (id: string | number, record: any, index: number) => void;

interface FResourceCardsListProps {
  resourceType: string;
  resourceStatus: 0 | 1 | 2 | 4 | '#';
  inputText: string;

  dataSource: FResourceCardProps['resource'][];
  totalNum: number;

  onChangeResourceType?: (value: string) => void;
  onChangeResourceStatus?: (value: 0 | 1 | 2 | 4 | '#') => void;
  onChangeInputText?: (value: string) => void;

  onloadMore?(): void;

  showGotoCreateBtn?: boolean;
  isCollect?: boolean;

  onBoomJuice?: EventFunc;
  onClickDetails?: EventFunc;
  onClickEditing?: EventFunc;
  onClickRevision?: EventFunc;
  onClickMore?: EventFunc;
}

function FResourceCardsList({
                              resourceType,
                              resourceStatus,
                              inputText,
                              dataSource,
                              totalNum,
                              onChangeResourceType,
                              onChangeResourceStatus,
                              onChangeInputText,
                              onloadMore,
                              showGotoCreateBtn = false,
                              isCollect = false,
                              onBoomJuice,
                              onClickDetails,
                              onClickEditing,
                              onClickRevision,
                              onClickMore,
                            }: FResourceCardsListProps) {
  // const [typeText, setTypeText] = React.useState('');
  // const [statusText, setStatusText] = React.useState('');
  const [category, setCategory] = React.useState<any>({
    first: -1,
    second: '',
  });

  React.useEffect(() => {
    // 初始化前-1，后面选全部为字符串‘-1’
    if (category.first === -1) {
      return;
    }
    let str = categoryData.first[category.first] || '';
    // @ts-ignore
    if (categoryData.second[category.first] && category.second !== '-1') {
      // @ts-ignore
      str = categoryData.second[category.first][category.second];
    }
    // console.log(str, '09i8owejklsdjflaskdjflksdj')
    onChangeResourceType && onChangeResourceType(str);
  }, [category]);

  // React.useEffect(() => {
  //   const selectedType: any = resourceTypeOptions.find((i) => i.value === resourceType);
  //   setTypeText(selectedType?.text || selectedType?.value);
  // }, [resourceType]);

  // React.useEffect(() => {
  //   const selectedStatus: any = resourceStatusOptions.find((i) => i.value === resourceStatus);
  //   setStatusText(selectedStatus?.text || selectedStatus?.value);
  // }, [resourceStatus]);

  // console.log(resourceStatus, 'resourceStatus resourceStatussdefopjksdmlk');
  // console.log(resourceStatusOptions.find((rs) => {
  //   return rs.value === resourceStatus;
  // }), 'resourceStatus ###09sdfujlsdkjf');

  return (
    <>
      <div style={{ height: 40 }} />
      <div className={styles.filter}>
        <div className={styles.filterLeft}>
          <div>
            <span>{FI18n.i18nNext.t('resource_type')}：</span>
            <FComponentsLib.FDropdown
              overlay={
                <FMenu
                  options={[
                    {
                      value: '-1',
                      text: '全部',
                    },
                    ...categoryData.first.map((i, index) => {
                      return {
                        value: index + '',
                        text: i,
                      };
                    }),
                  ]}
                  value={category.first}
                  onClick={(value) => {
                    setCategory({
                      ...category,
                      first: value,
                      second: category.first === value ? category.second : '-1',
                    });
                    //onChangeResourceType && onChangeResourceType(value)
                  }}
                />
              }
            >
              <span style={{ cursor: 'pointer' }}>
                {categoryData.first[category.first] || '全部'}
                {/*<DownOutlined style={{ marginLeft: 8 }} />*/}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
              </span>
            </FComponentsLib.FDropdown>

            {category.first > 1 ? (
              <>
                <span className='ml-30'>子类型：</span>
                <FComponentsLib.FDropdown
                  overlay={
                    <FMenu
                      // @ts-ignore
                      options={[
                        {
                          value: '-1',
                          text: '全部',
                        },
                        // @ts-ignore
                        ...categoryData.second[category.first].map((i, index) => {
                          return {
                            value: index + '',
                            text: i,
                          };
                        }),
                      ]}
                      onClick={(value) => {
                        setCategory({
                          ...category,
                          second: value,
                        });
                        // onChangeResourceType && onChangeResourceType(value)
                      }}
                    />
                  }
                >
                  <span style={{ cursor: 'pointer' }}>
                    {
                      // @ts-ignore
                      categoryData.second[category.first][category.second] || '全部'
                    }
                    {/*<DownOutlined style={{ marginLeft: 8 }} />*/}
                    <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
                  </span>
                </FComponentsLib.FDropdown>
              </>
            ) : null}
          </div>
          <div style={{ marginLeft: 60 }}>
            <span>{FI18n.i18nNext.t('resource_state')}：</span>

            <FComponentsLib.FDropdown
              overlay={
                <FMenu
                  options={resourceStatusOptions as any}
                  onClick={(value) =>
                    onChangeResourceStatus && onChangeResourceStatus(value === '#' ? value : Number(value) as 0)
                  }
                />
              }
            >

              <span style={{ cursor: 'pointer' }}>

                {resourceStatusOptions.find((rs) => {
                  return rs.value === resourceStatus;
                })?.text}
                {/*{statusText}*/}
                {/*<DownOutlined style={{ marginLeft: 10 }} />*/}
                <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} />
              </span>
            </FComponentsLib.FDropdown>
          </div>
        </div>
        <Space size={20}>
          <FInput
            value={inputText}
            debounce={300}
            allowClear={true}
            // onChange={(e) => onChangeInputText && onChangeInputText(e.target.value)}
            onDebounceChange={(value) => {
              onChangeInputText && onChangeInputText(value);
            }}
            theme='dark'
            className={styles.FInput}
            // placeholder={FI18n.i18nNext.t('search_resource')}
            placeholder={FI18n.i18nNext.t('myresourses_search_hint')}
          />
          {/* {showGotoCreateBtn && (
            <FComponentsLib.FRectBtn onClick={() => router.push(FUtil.LinkTo.resourceCreator())} type="primary">
              {FI18n.i18nNext.t('create_resource')}
            </FComponentsLib.FRectBtn>
          )} */}
        </Space>
      </div>

      {dataSource.length > 0 ? (
        <>
          <div style={{ height: 40 }} />
          <div className={styles.Content}>
            {showGotoCreateBtn && (
              <div
                className={'flex-column-center mb-20 m-10 ' + styles.createCard}
                onClick={() => history.push(FUtil.LinkTo.resourceCreator())}
              >
                <div className={'flex-column-center ' + styles.createButton}>
                  <i className={['freelog', 'fl-icon-tianjia'].join(' ')} />
                </div>
                <span className={'mt-20 ' + styles.createText}>创建资源</span>
              </div>
            )}
            {dataSource.map((i: any, j: number) => (
              <FResourceCard
                key={i.id}
                resource={i}
                type={isCollect ? 'favorite' : 'resource'}
                className={styles.FResourceCard}
                onBoomJuice={() => onBoomJuice && onBoomJuice(i.id, i, j)}
                onClickDetails={() => onClickDetails && onClickDetails(i.id, i, j)}
                onClickEditing={() => onClickEditing && onClickEditing(i.id, i, j)}
                onClickRevision={() => onClickRevision && onClickRevision(i.id, i, j)}
                onClickMore={() => onClickMore && onClickMore(i.id, i, j)}
              />
            ))}
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
            <div className={styles.bottomPadding} />
          </div>
          <div style={{ height: 100 }} />
        </>
      ) : (
        <FNoDataTip height={'calc(100vh - 220px)'} tipText={'没有符合条件的资源'} />
      )}

      {totalNum > dataSource.length && (
        <>
          <div className={styles.bottom}>
            <Button className={styles.loadMore} onClick={() => onloadMore && onloadMore()}>
              加载更多
            </Button>
          </div>
          <div style={{ height: 100 }} />
        </>
      )}
      <div style={{ height: 100 }} />
    </>
  );
}

export default FResourceCardsList;
