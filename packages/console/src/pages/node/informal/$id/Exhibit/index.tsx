import * as React from 'react';
import styles from './index.less';
import FNoDataTip from '@/components/FNoDataTip';
import { Space } from 'antd';
import FInput from '@/components/FInput';
import FDropdownMenu from '@/components/FDropdownMenu';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import FMenu from '@/components/FMenu';
import { DownOutlined } from '@ant-design/icons';
import categoryData from '@/utils/category';
import {
  FetchExhibitListAction,
  OnCancel_AddExhibitDrawer_Action,
  OnChangeExhibitKeywordsAction,
  OnChangeExhibitStatusAction,
  OnChangeExhibitTypeAction,
  OnClickExhibitsAddBtnAction,
  OnClickExhibitsReplaceBtnAction,
  OnConfirm_AddExhibitDrawer_Action,
  OnMountExhibitPageAction,
  OnUnmountExhibitPageAction,
} from '@/models/informalNodeManagerPage';
import ExhibitTable from './ExhibitTable';
import FLoadingTip from '@/components/FLoadingTip';
import * as AHooks from 'ahooks';
import FListFooter from '@/components/FListFooter';
import FAddInformExhibitDrawer from '@/pages/node/informal/$id/components/AddInformExhibitDrawer';
import { Helmet } from 'react-helmet';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface ExhibitProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Exhibit({ dispatch, informalNodeManagerPage }: ExhibitProps) {
  const [category, setCategory] = React.useState<any>({
    first: '-1',
    second: '',
  });

  AHooks.useMount(() => {
    dispatch<OnMountExhibitPageAction>({
      type: 'informalNodeManagerPage/onMountExhibitPage',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmountExhibitPageAction>({
      type: 'informalNodeManagerPage/onUnmountExhibitPage',
    });
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
    dispatch<OnChangeExhibitTypeAction>({
      type: 'informalNodeManagerPage/onChangeExhibitType',
      payload: {
        value: str,
      },
    });
  }, [category]);
  if (informalNodeManagerPage.exhibit_PageError) {
    return (
      <FNoDataTip
        height={'calc(100vh - 194px)'}
        tipText={informalNodeManagerPage.exhibit_PageError}
      />
    );
  }

  if (informalNodeManagerPage.exhibit_ListState === 'loading') {
    return <FLoadingTip height={'calc(100vh - 194px)'} />;
  }

  return (
    <>
      <Helmet>
        <title>{`测试展品管理 · ${informalNodeManagerPage.node_Name} - Freelog`}</title>
      </Helmet>

      {
        // informalNodeManagerPage.exhibitPageExhibitList.length === 0 && informalNodeManagerPage.exhibitPageSelectedType === '-1' && informalNodeManagerPage.exhibitPageSelectedStatus === '2' && informalNodeManagerPage.exhibitPageFilterKeywords === ''
        informalNodeManagerPage.exhibit_ListState === 'noData' ? (
          <FNoDataTip
            height={'calc(100vh - 94px)'}
            // tipText={'当前测试节点没有添加展品'}
            tipText={FI18n.i18nNext.t('testnode_exhibits_msg_empty')}
            btnText={FI18n.i18nNext.t('testnode_exhibits_btn')}
            onClick={() => {
              dispatch<OnClickExhibitsAddBtnAction>({
                type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
              });
            }}
          />
        ) : (
          <>
            <div className={styles.header}>
              <FComponentsLib.FTitleText text={`展品管理 (${informalNodeManagerPage.exhibit_ListTotal})`} />
              <Space size={30}>
                <FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    dispatch<OnClickExhibitsAddBtnAction>({
                      type: 'informalNodeManagerPage/onClickExhibitsAddBtn',
                    });
                  }}
                >
                  <Space size={5}>
                    <FComponentsLib.FIcons.FAdd />
                    {/*<FContentText text={}/>*/}
                    <span>{FI18n.i18nNext.t('title_add_test_exhibit')}</span>
                  </Space>
                </FComponentsLib.FTextBtn>

                <FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    // onChange({replaceModalVisible: true});
                    dispatch<OnClickExhibitsReplaceBtnAction>({
                      type: 'informalNodeManagerPage/onClickExhibitsReplaceBtn',
                    });
                  }}
                >
                  <Space size={5}>
                    <FComponentsLib.FIcons.FMappingRuleReplace />
                    {/*<FContentText text={FI18n.i18nNext.t('btn_replace_resource')}/>*/}
                    <span>{FI18n.i18nNext.t('btn_replace_resource')}</span>
                  </Space>
                </FComponentsLib.FTextBtn>

                <div>
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
                        <DownOutlined style={{ marginLeft: 8 }} />
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
                            <DownOutlined style={{ marginLeft: 8 }} />
                          </span>
                        </FComponentsLib.FDropdown>
                      </>
                    ) : null}
                  </div>
                  {/* <span>类型：</span>
                  <FDropdownMenu
                    options={informalNodeManagerPage.exhibit_TypeOptions}
                    onChange={(value) => {
                      dispatch<OnChangeExhibitTypeAction>({
                        type: 'informalNodeManagerPage/onChangeExhibitType',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      {informalNodeManagerPage.exhibit_TypeOptions.find(
                        (rto) => rto.value === informalNodeManagerPage.exhibit_SelectedType,
                      )?.text || ''}
                      <FDown style={{ marginLeft: 8 }} />
                    </span>
                  </FDropdownMenu> */}
                </div>
                <div>
                  <span>状态：</span>
                  <FDropdownMenu
                    options={informalNodeManagerPage.exhibit_StatusOptions}
                    onChange={(value) => {
                      dispatch<OnChangeExhibitStatusAction>({
                        type: 'informalNodeManagerPage/onChangeExhibitStatus',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      {
                        informalNodeManagerPage.exhibit_StatusOptions.find((rso) => {
                          return (
                            rso.value === informalNodeManagerPage.exhibit_SelectedStatus.toString()
                          );
                        })?.text
                      }
                      <FComponentsLib.FIcons.FDown style={{ marginLeft: 10 }} />
                    </span>
                  </FDropdownMenu>
                </div>
                <div>
                  <FInput
                    theme={'dark'}
                    value={informalNodeManagerPage.exhibit_FilterKeywords}
                    debounce={300}
                    onDebounceChange={async (value) => {
                      dispatch<OnChangeExhibitKeywordsAction>({
                        type: 'informalNodeManagerPage/onChangeExhibitKeywords',
                        payload: {
                          value: value,
                        },
                      });
                    }}
                  />
                </div>
              </Space>
            </div>
            {informalNodeManagerPage.exhibit_ListState === 'noSearchResult' ? (
              <FNoDataTip height={'calc(100vh - 294px)'} tipText={'无筛选结果'} />
            ) : (
              <div className={styles.body}>
                <div>
                  <ExhibitTable />
                  <FListFooter
                    state={informalNodeManagerPage.exhibit_ListMore}
                    onClickLoadMore={() => {
                      dispatch<FetchExhibitListAction>({
                        type: 'informalNodeManagerPage/fetchExhibitList',
                        payload: {
                          isRematch: false,
                          isRestart: false,
                        },
                      });
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )
      }

      <FAddInformExhibitDrawer
        nodeID={informalNodeManagerPage.node_ID}
        visible={informalNodeManagerPage.addExhibitDrawer_Visible}
        isTheme={false}
        onCancel={() => {
          dispatch<OnCancel_AddExhibitDrawer_Action>({
            type: 'informalNodeManagerPage/onCancel_AddExhibitDrawer',
          });
        }}
        onConfirmObjects={(values) => {
          // console.log(values, 'onConfirmObjects@#@#$@#$@#$@@@@@@@@@@@@');
          dispatch<OnConfirm_AddExhibitDrawer_Action>({
            type: 'informalNodeManagerPage/onConfirm_AddExhibitDrawer',
            payload: {
              identity: 'object',
              names: values,
            },
          });
        }}
        onConfirmResources={(values) => {
          // console.log(values, 'onConfirmResources@#@#$@#$@#$@@@@@@@@@@@@');
          // console.log(values, 'values9ijsdlfksdjlk');
          dispatch<OnConfirm_AddExhibitDrawer_Action>({
            type: 'informalNodeManagerPage/onConfirm_AddExhibitDrawer',
            payload: {
              identity: 'resource',
              names: values,
            },
          });
        }}
      />
    </>
  );
}

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(Exhibit);
