import * as React from 'react';
import styles from './index.less';
import { Button, Space } from 'antd';
import FMenu from '@/components/FMenu';
import FInput from '@/components/FInput';
import { history } from 'umi';
import FResourceCard, { FResourceCardProps } from '@/components/FResourceCard';
import FNoDataTip from '@/components/FNoDataTip';
import { FUtil, FI18n } from '@freelog/tools-lib';
import categoryData from '@/utils/category';
import FComponentsLib from '@freelog/components-lib';
import FResourceTypeFilter from '@/components/FResourceTypeFilter';

const resourceStatusOptions = [
  { text: FI18n.i18nNext.t('filter_resource_status_all'), value: '#' },
  // { text: '上架', value: 1 },
  { text: FI18n.i18nNext.t('filter_resource_status_availableforauth'), value: 1 },
  // { text: '下架', value: 4 },
  { text: FI18n.i18nNext.t('filter_resource_status_pendingauth'), value: 4 },
  // { text: '待发行', value: 0 },
  { text: FI18n.i18nNext.t('filter_resource_status_prepareforrelease'), value: 0 },
  // { text: '冻结', value: 2 },
  { text: FI18n.i18nNext.t('filter_resource_status_removedbyfreelog'), value: 2 },
];

type EventFunc = (id: string | number, record: any, index: number) => void;

interface FResourceCardsListProps {
  resourceTypeCodes: Array<string | number>;
  resourceStatus: 0 | 1 | 2 | 4 | '#';
  inputText: string;

  dataSource: FResourceCardProps['resource'][];
  totalNum: number;

  onChangeResourceTypeCodes?: (value: FResourceCardsListProps['resourceTypeCodes']) => void;
  onChangeResourceStatus?: (value: FResourceCardsListProps['resourceStatus']) => void;
  onChangeInputText?: (value: FResourceCardsListProps['inputText']) => void;

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
                              resourceTypeCodes,
                              resourceStatus,
                              inputText,
                              dataSource,
                              totalNum,
                              onChangeResourceTypeCodes,
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
  // const [category, setCategory] = React.useState<any>({
  //   first: -1,
  //   second: '',
  // });

  // React.useEffect(() => {
  //   // 初始化前-1，后面选全部为字符串‘-1’
  //   if (category.first === -1) {
  //     return;
  //   }
  //   let str = categoryData.first[category.first] || '';
  //   // @ts-ignore
  //   if (categoryData.second[category.first] && category.second !== '-1') {
  //     // @ts-ignore
  //     str = categoryData.second[category.first][category.second];
  //   }
  //   // console.log(str, '09i8owejklsdjflaskdjflksdj')
  //   onChangeResourceType && onChangeResourceType(str);
  // }, [category]);

  return (
    <>
      <div style={{ height: 40 }} />
      <div className={styles.filter}>
        <div className={styles.filterLeft}>
          <div>
            <span>{FI18n.i18nNext.t('resource_type')}：</span>

            <FResourceTypeFilter
              value={resourceTypeCodes}
              onChange={(value) => {
                if (!value) {
                  return;
                }
                onChangeResourceTypeCodes && onChangeResourceTypeCodes(value);
              }}
            />

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
        <FNoDataTip
          height={'calc(100vh - 220px)'}
          tipText={'没有符合条件的资源'}
          btnText={'创建资源'}
          onClick={() => {
            self.open(FUtil.LinkTo.resourceCreator());
          }}
        />
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
