import * as React from 'react';
import styles from './index.less';
import { Popover, Space, Switch } from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import {
  ChangeAction,
  ChangeVersionAction,
  FetchInfoAction,
  // OnChange_Side_InputTitle_Action,
  OnMountPageAction,
  OnUnmountPageAction,
  UpdateBaseInfoAction,
  OnSave_Side_ExhibitIntroduction_Action,
  OnClick_Side_InheritOptions_ResetBtn_Action,
  OnChange_Side_InheritOptions_ValueInput_Action,
  OnBlur_Side_InheritOptions_ValueInput_Action,
  OnConfirm_CustomOptionDrawer_Action,
  OnClick_Side_CustomOptions_DeleteBtn_Action,
  OnChange_Side_CustomOptions_ValueInput_Action,
  OnBlur_Side_CustomOptions_ValueInput_Action,
  OnConfirm_AddCustomOptionsDrawer_Action,
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { RouteComponentProps } from 'react-router';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { onlineExhibit } from '@/pages/node/utils/tools';
import { fOnOffFeedback } from '@/components/fOnOffFeedback';
import FCoverImage from '@/components/FCoverImage';
import FResourceLabelEditor2 from '@/components/FResourceLabelEditor2';
import FResourceProperties from '@/components/FResourceProperties';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FDropdownMenu from '@/components/FDropdownMenu';
import fMessage from '@/components/fMessage';
import FUploadCover from '@/components/FUploadCover';
import FResourcePropertyAndOptionTipPopover from '@/components/FResourcePropertyAndOptionTipPopover';
import FSelect from '@/components/FSelect';
import FResourceCard from '@/components/FResourceCard';
import FPopover from '@/components/FPopover';

interface PresentableProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Presentable({ dispatch, exhibitInfoPage, match }: PresentableProps) {

  AHooks.useMount(() => {
    dispatch<OnMountPageAction>({
      type: 'exhibitInfoPage/onMountPage',
      payload: {
        exhibitID: match.params.id,
      },
    });
  });

  async function activateTheme() {
    const res1: boolean = await fPromiseModalConfirm({
      title: '提示',
      // icon: <div />,
      description: FI18n.i18nNext.t('msg_change_theme_confirm', { ThemeName: exhibitInfoPage.exhibit_Name }),
      okText: FI18n.i18nNext.t('btn_activate_theme'),
      cancelText: FI18n.i18nNext.t('keep_current_theme'),
    });

    if (!res1) {
      return;
    }

    await onlineExhibit(exhibitInfoPage.exhibit_ID);

    FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
      value: false,
      effectiveImmediately: true,
      onlyNullish: false,
    });

    dispatch<FetchInfoAction>({
      type: 'exhibitInfoPage/fetchInfo',
    });
  }

  // function onChangePInputTitle(value: string | null) {
  //   dispatch<OnChange_Side_InputTitle_Action>({
  //     type: 'exhibitInfoPage/onChange_Side_InputTitle',
  //     payload: {
  //       value: value,
  //     },
  //   });
  // }

  return <div className={styles.Presentable}>
    <div className={styles.content}>
      <div style={{ height: 40 }} />
      <Space size={5}>
        <FComponentsLib.FTextBtn
          onClick={() => {
            window.open(
              FUtil.LinkTo.nodeManagement({ nodeID: exhibitInfoPage.exhibit_BelongNode_ID }),
            );
          }}
          style={{ fontWeight: 600 }}
          type='default'
        >
          <FComponentsLib.FContentText
            type={'negative'}
            text={exhibitInfoPage.exhibit_BelongNode_Name}
            style={{ fontWeight: 600, maxWidth: 200 }}
            singleRow
          />
        </FComponentsLib.FTextBtn>
        <FComponentsLib.FContentText type={'negative'} text={'>'} style={{ fontWeight: 600 }} />
        <FComponentsLib.FContentText
          type={'highlight'}
          text={exhibitInfoPage.exhibit_Name}
          style={{
            maxWidth: 600,
          }}
          singleRow
        />
      </Space>
      <div style={{ height: 40 }} />

      <div className={styles.onlineSwitch}>
        <FComponentsLib.FHotspotTooltip
          id={'exhibitDetailPage.onlineSwitch'}
          style={{ left: -42, top: -4 }}
          text={FI18n.i18nNext.t('hotpots_exhibit_toggle_exhibit')}
        >
          <Space size={20}>
            {
              exhibitInfoPage.exhibit_ResourceInfo?.type.includes('主题') && (<>
                {
                  exhibitInfoPage.exhibit_Online && (<div style={{
                    backgroundColor: '#42C28C',
                    borderRadius: 12,
                    lineHeight: '18px',
                    color: 'white',
                    fontSize: 12,
                    padding: '3px 10px',
                  }}>{FI18n.i18nNext.t('theme_state_active')}</div>)
                }
                {
                  !exhibitInfoPage.exhibit_Online && (<>
                    <FComponentsLib.FContentText
                      type={'highlight'}
                      text={FI18n.i18nNext.t('toggle_activate_theme')}
                    />
                    <Switch
                      disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                      checked={exhibitInfoPage.exhibit_Online}
                      className={styles.CustomSwitch}
                      onChange={async () => {
                        activateTheme();
                      }}
                    />
                  </>)
                }
              </>)
            }

            {
              !exhibitInfoPage.exhibit_ResourceInfo?.type.includes('主题') && (<>

                <FComponentsLib.FContentText
                  type={'highlight'}
                  text={FI18n.i18nNext.t('switch_set_exhibit_avaliable')}
                />
                <Switch
                  disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}
                  checked={exhibitInfoPage.exhibit_Online}
                  className={styles.CustomSwitch}
                  onChange={async (checked) => {
                    if (checked) {
                      await onlineExhibit(exhibitInfoPage.exhibit_ID);
                    } else {

                      const confirm: boolean = await fPromiseModalConfirm({
                        // title: '下架展品',
                        // description: '下架后，其它用户将无法签约该展品，确认要下架吗？',
                        title: '提示',
                        description: FI18n.i18nNext.t('confirm_msg_remove_exhibits_from_auth'),
                        okText: FI18n.i18nNext.t('btn_remove_exhibits_from_auth'),
                        promptKey_localStorage: 'offlineExhibit',
                      });

                      if (confirm) {
                        const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
                          presentableId: exhibitInfoPage.exhibit_ID,
                          onlineStatus: 0,
                        };
                        await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);
                        fOnOffFeedback({
                          state: 'off',
                          message: FI18n.i18nNext.t('remove_resource_from_auth_msg_done'),
                        });
                      }

                    }
                    FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
                      value: false,
                      effectiveImmediately: true,
                      onlyNullish: false,
                    });
                    dispatch<FetchInfoAction>({
                      type: 'exhibitInfoPage/fetchInfo',
                    });
                  }}
                />
              </>)
            }

          </Space>
        </FComponentsLib.FHotspotTooltip>
        {
          !exhibitInfoPage.exhibit_IsAuth && (<Space size={5}>
            <FComponentsLib.FIcons.FWarning style={{ fontSize: 16 }} />
            <FComponentsLib.FContentText
              type={'additional2'}
              style={{ color: '#222' }}>{exhibitInfoPage.exhibit_AuthErrorText}</FComponentsLib.FContentText>
          </Space>)
        }

        {
          exhibitInfoPage.exhibit_IsAuth && (<>
            {
              exhibitInfoPage.exhibit_ResourceInfo?.type.includes('主题') && (<>
                <FComponentsLib.FContentText
                  text={exhibitInfoPage.exhibit_Online ? '主题已激活' : '主题未激活'}
                  type={'additional2'}
                  style={{ color: '#222' }}
                />
              </>)
            }

            {
              !exhibitInfoPage.exhibit_ResourceInfo?.type.includes('主题') && (<>
                <FComponentsLib.FContentText
                  text={exhibitInfoPage.exhibit_Online ? '展品已上架' : '展品未上架'}
                  type={'additional2'}
                  style={{ color: '#222' }}
                />
              </>)
            }
          </>)
        }

      </div>

      <div style={{ height: 40 }} />
      <Space size={20} style={{ alignItems: 'flex-start' }}>
        <FUploadCover
          style={{ height: 195 }}
          use={'exhibit'}
          onError={(err) => {
            fMessage(err, 'error');
          }}
          onUploadSuccess={(url: string) => {
            // console.log(url, 'url@#$!@#$@#@#$@#');
            dispatch<UpdateBaseInfoAction>({
              type: 'exhibitInfoPage/updateBaseInfo',
              payload: {
                exhibit_Cover: url,
              },
            });
          }}>
          <div className={styles.cover}>
            <FCoverImage
              src={exhibitInfoPage.exhibit_Cover || ''}
              // src={''}
              width={260}
              style={{ borderRadius: 6 }}
            />
            <div className={styles.coverEdit}>
              <FComponentsLib.FIcons.FEdit style={{ fontSize: 32 }} />
              <div style={{ height: 10 }} />
              <div>{FI18n.i18nNext.t('btn_edit_cover')}</div>
            </div>
          </div>
        </FUploadCover>

        <div>
          <TitleInput
            value={exhibitInfoPage.side_ExhibitTitle}
            onOK={(value) => {
              dispatch<UpdateBaseInfoAction>({
                type: 'exhibitInfoPage/updateBaseInfo',
                payload: {
                  side_ExhibitTitle: value,
                },
              });
            }}
          />
          <div style={{ height: 10 }} />
          {
            exhibitInfoPage.exhibit_ResourceInfo && (<Popover
              // open={true}
              content={<FResourceCard
                key={exhibitInfoPage.exhibit_ResourceInfo.id}
                resource={exhibitInfoPage.exhibit_ResourceInfo}
                // className={styles.FResourceCard}
                onClick={() => {
                  window.open(
                    FUtil.LinkTo.resourceDetails({
                      resourceID: exhibitInfoPage.exhibit_ResourceInfo?.id || '',
                    }),
                  );
                }}
              />}
              title={null}
              // placement={'bottomLeft'}
              placement={'bottom'}
              // style={{ padding: 0 }}
              // overlayInnerStyle={{ padding: 0 }}
              // overlayStyle={{ padding: 0 }}
              // className={styles.resourceCardPopover}
              overlayClassName={styles.resourceCardPopover}
            >
              <div style={{ width: 'fit-content' }}>
                <FComponentsLib.FTextBtn
                  type='default'
                  onClick={() => {
                    window.open(FUtil.LinkTo.resourceDetails({ resourceID: exhibitInfoPage.exhibit_ResourceInfo?.id || '' }));
                  }}
                >
                  <FComponentsLib.FContentText
                    type={'additional2'}
                    text={'来自于'}
                    style={{ color: 'inherit' }}
                  />
                  <FComponentsLib.FContentText
                    type={'additional2'}
                    style={{ width: 220, color: 'inherit' }}
                    singleRow
                    text={exhibitInfoPage.exhibit_ResourceInfo?.name || ''}
                  />

                </FComponentsLib.FTextBtn>
              </div>
            </Popover>)
          }

          <div style={{ height: 15 }} />
          <div style={{ borderRadius: 4, border: '1px solid #D4D4D4', minHeight: 114, backgroundColor: 'white' }}>
            <FResourceLabelEditor2
              // style={{ minHeight: 114, width: 640, backgroundColor: '#fff', alignItems: 'flex-start' }}
              style={{ border: 'none' }}
              value={exhibitInfoPage.side_ExhibitTags}
              onChange={(value) => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'exhibitInfoPage/updateBaseInfo',
                  payload: {
                    side_ExhibitTags: value,
                  },
                });
              }}
            />
          </div>
        </div>
      </Space>
      <div style={{ height: 15 }} />
      <Space size={10}>
        <FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          onClick={() => {
            // set$showMore(!get$showMore());
            // set$auth(get$auth() === 'block' ? 'none' : 'block');
            dispatch<ChangeAction>({
              type: 'exhibitInfoPage/change',
              payload: {
                side_SettingUnfold: !exhibitInfoPage.side_SettingUnfold,
              },
            });
          }}
        >{
          exhibitInfoPage.side_SettingUnfold
            ? FI18n.i18nNext.t('brr_resourcelisting_item_btn_showlesssetting')
            : FI18n.i18nNext.t('brr_resourcelisting_item_btn_moresetting')
        }</FComponentsLib.FTextBtn>
        <FComponentsLib.FContentText
          text={'可以为资源文件添加可选配置，或进行依赖资源的声明'}
          type={'negative'}
          style={{ fontSize: 12 }}
        />
      </Space>
      <div style={{ height: 10 }} />

      {
        exhibitInfoPage.side_SettingUnfold && (<>
          <div className={styles.block} style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FComponentsLib.FContentText
                text={'展示版本'}
                type={'highlight'}
              />
            </div>
            <div style={{ height: 20 }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FComponentsLib.FContentText
                type={'highlight'}
                text={exhibitInfoPage.side_Version}
                style={{ fontSize: 12 }}
              />
              <div style={{ width: 20 }} />
              <FDropdownMenu
                options={[...exhibitInfoPage.side_AllVersions].reverse().map((av: string) => ({ value: av, text: av }))}
                onChange={(value) => {
                  dispatch<ChangeVersionAction>({
                    type: 'exhibitInfoPage/changeVersion',
                    payload: value,
                  });
                }}
              >
                <Space style={{ cursor: 'pointer' }} size={2}>
                  <FComponentsLib.FTextBtn><FComponentsLib.FIcons.FSwap
                    style={{ fontSize: 12 }} /></FComponentsLib.FTextBtn>
                  <FComponentsLib.FTextBtn style={{ fontSize: 12 }}>切换展示版本</FComponentsLib.FTextBtn>
                </Space>
              </FDropdownMenu>

              {/*<div style={{ width: 60 }} />*/}
              {/*<FComponentsLib.FContentText*/}
              {/*  type={'highlight'}*/}
              {/*  text={'自动更新到最新版本'}*/}
              {/*  style={{ fontSize: 12 }}*/}
              {/*/>*/}
              {/*<div style={{ width: 20 }} />*/}
              {/*<Switch*/}
              {/*  size='small'*/}
              {/*  defaultChecked*/}
              {/*  className={styles.smallSwitch}*/}
              {/*/>*/}
            </div>

          </div>

          <div style={{ height: 5 }} />
          <div className={styles.block} style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
            </div>
            <div style={{ height: 20 }} />

            <FResourceProperties
              immutableData={exhibitInfoPage.side_RawProperties}
              onlyEditValueData={[]}
              alterableData={[]}
            />
          </div>

          {
            exhibitInfoPage.resourceTypeConfig.isSupportOptionalConfig && (<>
              <div style={{ height: 5 }} />
              <div className={styles.block} style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FComponentsLib.FContentText
                    text={'可选配置'}
                    type={'highlight'}
                  />
                </div>

                {
                  // info.customConfigurations.length === 0 && (<>
                  exhibitInfoPage.side_InheritOptions.length === 0 && (<>
                    <div style={{ height: 10 }} />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
                      <FComponentsLib.FContentText
                        text={FI18n.i18nNext.t('resourceoptions_list_empty')}
                        type={'additional2'}
                      />
                    </div>
                    <div style={{ height: 20 }} />
                  </>)
                }

                {
                  exhibitInfoPage.side_InheritOptions.length > 0 && (<>
                    <div style={{ height: 10 }} />
                    <Space direction={'vertical'} size={10} className={styles.InheritOptions}>
                      {
                        exhibitInfoPage.side_InheritOptions.map((io, index) => {
                          return (<div key={io.key}>
                            <div className={styles.optionTitle}>
                              <FResourcePropertyAndOptionTipPopover
                                info={{
                                  key: io.key,
                                  name: io.name,
                                  description: io.description,
                                }}
                                type={'option'}
                              >
                                <div>
                                  <FComponentsLib.FContentText
                                    text={io.name}
                                    singleRow
                                    style={{ maxWidth: 160 }}
                                  />
                                </div>
                              </FResourcePropertyAndOptionTipPopover>

                              <FTooltip title={FI18n.i18nNext.t('tip_reset_value')}>
                                <div>
                                  <FComponentsLib.FTextBtn
                                    onClick={() => {
                                      // onChangeCustomAttrs({ key: pc.key, value: pc.defaultValue || '' }, true);
                                      dispatch<OnClick_Side_InheritOptions_ResetBtn_Action>({
                                        type: 'exhibitInfoPage/onClick_Side_InheritOptions_ResetBtn',
                                        payload: {
                                          index: index,
                                        },
                                      });
                                    }}
                                  >
                                    <FComponentsLib.FIcons.FRedo style={{ fontSize: 12 }} />
                                  </FComponentsLib.FTextBtn>
                                </div>
                              </FTooltip>
                            </div>
                            <div style={{ height: 5 }} />
                            {
                              io.type === 'select'
                                ? (<FSelect
                                  className={styles.FSelect}
                                  // getPopupContainer={() => {
                                  //   // console.log(ref.current, 'ref.currentiosdjflksdjflksjdklf sdaoifj;sldkfjlkj');
                                  //   return ref.current;
                                  // }}
                                  value={io.valueInput}
                                  dataSource={io.options.map((d) => ({ value: d, title: d }))}
                                  onChange={(value: string) => {
                                    // onChangeCustomAttrs({ key: pc.key, value: value }, true);
                                    dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                                      type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                                      payload: {
                                        index: index,
                                        value: value,
                                      },
                                    });
                                  }}
                                  onBlur={() => {
                                    dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                                      type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                                      payload: {
                                        index: index,
                                      },
                                    });
                                  }}
                                />)
                                : (<div>
                                  <FComponentsLib.FInput.FSingleLine
                                    lengthLimit={-1}
                                    className={styles.FInput}
                                    value={io.valueInput}
                                    // errorText={io.valueInputError}
                                    placeholder={'输入自定义选项'}
                                    onChange={(e) => {
                                      // onChangeCustomAttrs({ key: pc.key, value: e.target.value });
                                      dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                                        type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                                        payload: {
                                          index: index,
                                          value: e.target.value,
                                        },
                                      });
                                    }}
                                    onBlur={() => {
                                      dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                                        type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                                        payload: {
                                          index: index,
                                        },
                                      });
                                    }}
                                  />
                                  {
                                    io.valueInputError !== '' && (
                                      <div style={{ color: '#EE4040' }}>{io.valueInputError}</div>)
                                  }

                                </div>)
                            }
                          </div>);
                        })
                      }
                    </Space>
                  </>)
                }

              </div>
            </>)
          }

          <div style={{ height: 5 }} />
          <div className={styles.block} style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FComponentsLib.FContentText
                text={'自定义信息'}
                type={'highlight'}
              />
              {
                exhibitInfoPage.side_CustomOptions.length < 30 && (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                  type='primary'
                  onClick={async () => {
                    const dataSource: {
                      key: string;
                      name: string;
                      type: 'input' | 'select';
                      input: string;
                      select: string[];
                      description: string;
                    } | null = await fResourceOptionEditor({
                      disabledKeys: [
                        ...exhibitInfoPage.side_RawProperties.map((ba) => ba.key),
                        ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.key),
                        ...exhibitInfoPage.side_InheritOptions.map((io) => io.key),
                        ...exhibitInfoPage.side_CustomOptions.map((co) => co.key),
                      ],
                      disabledNames: [
                        // ...exhibitInfoPage.side_RawProperties.map((ba) => ba.name),
                        ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.name),
                        ...exhibitInfoPage.side_InheritOptions.map((io) => io.name),
                        ...exhibitInfoPage.side_CustomOptions.map((co) => co.name),
                      ],
                      hideTypeSelect: true,
                    });

                    if (!dataSource) {
                      return;
                    }

                    dispatch<OnConfirm_AddCustomOptionsDrawer_Action>({
                      type: 'exhibitInfoPage/onConfirm_AddCustomOptionsDrawer',
                      payload: {
                        value: {
                          key: dataSource.key,
                          name: dataSource.name,
                          // type: 'input' | 'select';
                          input: dataSource.input,
                          // select: string[];
                          description: dataSource.description,
                        },
                      },
                    });
                  }}
                >
                  <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                  <span>添加自定义信息</span>
                </FComponentsLib.FTextBtn>)
              }

            </div>

            {
              // info.customConfigurations.length === 0 && (<>
              exhibitInfoPage.side_CustomOptions.length === 0 && (<>
                <div style={{ height: 10 }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
                  <FComponentsLib.FContentText
                    text={FI18n.i18nNext.t('resourceoptions_list_empty')}
                    type={'additional2'}
                  />
                </div>
                <div style={{ height: 20 }} />
              </>)
            }

            {
              exhibitInfoPage.side_CustomOptions.length > 0 && (<>
                <div style={{ height: 20 }} />
                <Space direction={'vertical'} size={10} className={styles.CustomOptions}>
                  {
                    exhibitInfoPage.side_CustomOptions.map((co, index) => {
                      return (<div key={co.key}>
                        <div className={styles.optionTitle}>
                          <FResourcePropertyAndOptionTipPopover
                            info={{
                              key: co.key,
                              name: co.name,
                              description: co.description,
                            }}
                            type={'option'}
                          >
                            <div>
                              <FComponentsLib.FContentText
                                text={co.name}
                                singleRow
                                style={{ maxWidth: 160 }}
                              />
                            </div>
                          </FResourcePropertyAndOptionTipPopover>
                          <Space size={10}>
                            <FTooltip title={FI18n.i18nNext.t('tips_edit')}>
                              <div>
                                <FComponentsLib.FTextBtn
                                  // theme="primary"
                                  onClick={async () => {

                                    const dataSource: {
                                      key: string;
                                      name: string;
                                      type: 'input' | 'select';
                                      input: string;
                                      select: string[];
                                      description: string;
                                    } | null = await fResourceOptionEditor({
                                      disabledKeys: [
                                        ...exhibitInfoPage.side_RawProperties.map((ba) => ba.key),
                                        ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.key),
                                        ...exhibitInfoPage.side_InheritOptions.map((io) => io.key),
                                        ...exhibitInfoPage.side_CustomOptions.map((co) => co.key),
                                      ],
                                      disabledNames: [
                                        // ...exhibitInfoPage.side_RawProperties.map((ba) => ba.name),
                                        ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.name),
                                        ...exhibitInfoPage.side_InheritOptions.map((io) => io.name),
                                        ...exhibitInfoPage.side_CustomOptions.map((co) => co.name),
                                      ],
                                      //co
                                      defaultData: {
                                        key: co.key,
                                        name: co.name,
                                        type: 'input',
                                        input: co.value,
                                        select: [],
                                        description: co.description,
                                      },
                                      hideTypeSelect: true,
                                    });

                                    if (!dataSource) {
                                      return;
                                    }

                                    dispatch<OnConfirm_CustomOptionDrawer_Action>({
                                      type: 'exhibitInfoPage/onConfirm_CustomOptionDrawer',
                                      payload: {
                                        value: {
                                          key: dataSource.key,
                                          name: dataSource.name,
                                          value: dataSource.input,
                                          description: dataSource.description,
                                          valueType: 'input',
                                        },
                                      },
                                    });
                                  }}
                                >
                                  <FComponentsLib.FIcons.FEdit style={{ fontSize: 14 }} />
                                </FComponentsLib.FTextBtn>
                              </div>
                            </FTooltip>
                            <FTooltip title={FI18n.i18nNext.t('tip_delete_custom_option')}>
                              <div>
                                <FComponentsLib.FIcons.FDelete
                                  style={{ color: '#EE4040', cursor: 'pointer', fontSize: 14 }}
                                  onClick={async () => {
                                    const bool: boolean = await fPromiseModalConfirm({
                                      title: '提示',
                                      description: '一旦删除则无法恢复，确认删除吗？',
                                    });
                                    if (bool) {
                                      dispatch<OnClick_Side_CustomOptions_DeleteBtn_Action>({
                                        type: 'exhibitInfoPage/onClick_Side_CustomOptions_DeleteBtn',
                                        payload: {
                                          index: index,
                                        },
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </FTooltip>
                          </Space>
                        </div>
                        <div style={{ height: 5 }} />
                        <FComponentsLib.FInput.FSingleLine
                          lengthLimit={-1}
                          placeholder={FI18n.i18nNext.t('hint_value_null')}
                          className={styles.FInput}
                          value={co.valueInput}
                          // errorText={co.valueInputError}
                          onChange={(e) => {
                            // console.log(e, 'eEEEEeeeeeEEE');
                            dispatch<OnChange_Side_CustomOptions_ValueInput_Action>({
                              type: 'exhibitInfoPage/onChange_Side_CustomOptions_ValueInput',
                              payload: {
                                index: index,
                                value: e.target.value,
                              },
                            });
                          }}
                          onBlur={() => {
                            dispatch<OnBlur_Side_CustomOptions_ValueInput_Action>({
                              type: 'exhibitInfoPage/onBlur_Side_CustomOptions_ValueInput',
                              payload: {
                                index: index,
                              },
                            });
                          }}
                        />
                        {
                          co.valueInputError !== '' && (<div style={{ color: '#EE4040' }}>{co.valueInputError}</div>)
                        }
                      </div>);
                    })
                  }

                </Space>
              </>)
            }
          </div>
          <div style={{ height: 5 }} />
        </>)
      }

      <IntroductionInput
        value={exhibitInfoPage.side_ExhibitIntroduction}
        onOK={(value) => {
          dispatch<OnSave_Side_ExhibitIntroduction_Action>({
            type: 'exhibitInfoPage/onSave_Side_ExhibitIntroduction',
            payload: {
              value,
            },
          });
        }}
      />

      <div style={{ height: 5 }} />
      <Policies />

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText text={'相关合约'} type={'highlight'} />
        </div>
        <div style={{ height: 20 }} />
        <Contracts />
      </div>

      {
        exhibitInfoPage.graphShow && (<>
          <div style={{ height: 5 }} />
          <div className={styles.block}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FComponentsLib.FContentText text={'相关视图'} type={'highlight'} />
            </div>
            <div style={{ height: 10 }} />
            <Viewports />
          </div>
        </>)
      }

      <div style={{ height: 100 }} />
    </div>
  </div>;
}


export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Presentable);

interface TitleInputProps {
  value: string;

  onOK(value: string): void;

  // onCancel(): void;
}

function TitleInput({ value, onOK }: TitleInputProps) {

  const [$isEdit, set$isEdit, get$isEdit] = FUtil.Hook.useGetState<boolean>(false);
  const [$value, set$value, get$value] = FUtil.Hook.useGetState<string>(value);
  const [$valueError, set$valueError, get$valueError] = FUtil.Hook.useGetState<string>('');

  function onEdit() {
    set$isEdit(true);
    set$value(value);
  }

  if (!$isEdit) {
    return (<Space size={10}>
      {
        value === '' && (<>
          <FComponentsLib.FTextBtn
            onClick={() => {
              onEdit();
            }}>
            <FComponentsLib.FIcons.FAdd />
          </FComponentsLib.FTextBtn>
          <FComponentsLib.FTextBtn
            onClick={() => {
              onEdit();
            }}>添加标题</FComponentsLib.FTextBtn>
        </>)
      }

      {
        value !== '' && (<>
          <FComponentsLib.FTitleText
            type={'h2'}
            text={value}
            style={{ overflowWrap: 'anywhere', fontWeight: 600 }}
          />
          <FTooltip title={'编辑'}>
            <div>
              <FComponentsLib.FTextBtn
                onClick={() => {
                  onEdit();
                }}>
                <FComponentsLib.FIcons.FEdit style={{ fontSize: 12 }} />
              </FComponentsLib.FTextBtn>
            </div>
          </FTooltip>
        </>)
      }
    </Space>);
  }


  return (<div>
    <Space size={10}>
      <FComponentsLib.FInput.FSingleLine
        lengthLimit={-1}
        className={styles.FInput}
        style={{ width: 480 }}
        // wrapClassName={styles.FInput}
        value={$value}
        onChange={(e) => {
          set$value(e.target.value);
          set$valueError(e.target.value.length > 100 ? '不能超过100个字符' : '');
        }}
      />
      <FComponentsLib.FRectBtn
        type={'primary'}
        disabled={$valueError !== ''}
        // size='small'
        onClick={() => {
          // dispatch<UpdateBaseInfoAction>({
          //   type: 'exhibitInfoPage/updateBaseInfo',
          //   payload: {
          //     side_ExhibitTitle: exhibitInfoPage.side_ExhibitInputTitle || '',
          //   },
          // });
          // onChangePInputTitle(null);
          onOK(get$value());
          set$isEdit(false);
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
      <FComponentsLib.FRectBtn
        type='default'
        // size="small"
        // onClick={() => onChangePInputTitle(null)}
        onClick={() => {
          set$isEdit(false);
        }}
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FRectBtn>
    </Space>

    {
      $valueError !== '' && (<>
        <div style={{ height: 5 }} />
        <div style={{ color: '#EE4040' }}>{$valueError}</div>
      </>)
    }
  </div>);
}

interface IntroductionInputProps {
  value: string;

  onOK(value: string): void;
}

function IntroductionInput({ value, onOK }: IntroductionInputProps) {
  const [$isEdit, set$isEdit, get$isEdit] = FUtil.Hook.useGetState<boolean>(false);
  const [$value, set$value, get$value] = FUtil.Hook.useGetState<string>(value);
  const [$valueError, set$valueError, get$valueError] = FUtil.Hook.useGetState<string>('');

  function onEdit() {
    set$isEdit(true);
    set$value(value);
  }

  return (<div className={styles.block}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <FComponentsLib.FContentText text={FI18n.i18nNext.t('resource_short_description')} type={'highlight'} />

      <Space size={10}>
        {
          !$isEdit && value !== '' && (<FComponentsLib.FTextBtn
            style={{ fontSize: 12 }}
            onClick={() => {
              onEdit();
            }}
          >{FI18n.i18nNext.t('edit')}</FComponentsLib.FTextBtn>)
        }
        {
          $isEdit && (<>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12 }}
              type='default'
              onClick={() => {
                set$isEdit(false);
              }}
            >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12 }}
              onClick={() => {
                onOK(get$value());
                set$isEdit(false);
              }}
              disabled={$value.length > 200}
            >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
          </>)
        }
      </Space>
    </div>

    <div style={{ height: 20 }} />
    {
      $isEdit && (<div>
        <FComponentsLib.FInput.FMultiLine
          value={$value}
          lengthLimit={200}
          onChange={(e) => {
            set$value(e.target.value);
          }}
        />

        {
          $valueError !== '' && (<>
            <div style={{ height: 5 }} />
            <div style={{ color: '#EE4040' }}>{$valueError}</div>
          </>)
        }

      </div>)
    }

    {
      !$isEdit && (<>
        {
          value !== ''
            ? (<div className={styles.aboutPanel}>
              <pre>{value}</pre>
            </div>)
            : (<div>

              <div style={{ height: 10 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <FComponentsLib.FContentText
                  text={FI18n.i18nNext.t('标题直接影响商品的搜索曝光机会，建议在标题中加入品牌/内容主旨，')}
                  type={'additional2'}
                />
                <FComponentsLib.FContentText
                  text={FI18n.i18nNext.t('例如，《大明风华：明朝人的城市生活》；标题长度不超过100个字符。')}
                  type={'additional2'}
                />
                <div style={{ height: 20 }} />
                <FComponentsLib.FRectBtn
                  type='primary'
                  onClick={() => {
                    onEdit();
                  }}
                >
                  添加展品简介
                </FComponentsLib.FRectBtn>
              </div>
              <div style={{ height: 20 }} />

            </div>)
        }
      </>)
    }
  </div>);
}
