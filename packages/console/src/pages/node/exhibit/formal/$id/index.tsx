import * as React from 'react';
import styles from './index.less';
import FSwitch from '@/components/FSwitch';
import { message, Space, Switch } from 'antd';
import Policies from './Policies';
import Contracts from './Contracts';
import Viewports from './Viewports';
import Side from './Side';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import {
  ChangeAction, ChangeVersionAction,
  FetchInfoAction, OnChange_Side_InputTitle_Action,
  OnMountPageAction,
  OnUnmountPageAction, UpdateBaseInfoAction,
} from '@/models/exhibitInfoPage';
import FTooltip from '@/components/FTooltip';
import { RouteComponentProps } from 'react-router';
import { FUtil, FI18n, FServiceAPI } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FLoadingTip from '@/components/FLoadingTip';
import { Helmet } from 'react-helmet';
import FComponentsLib from '@freelog/components-lib';
import useUrlState from '@ahooksjs/use-url-state';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';
import { onlineExhibit } from '@/pages/node/utils/tools';
import { fOnOffFeedback } from '@/components/fOnOffFeedback';
import FCoverImage from '@/components/FCoverImage';
import FResourceLabelEditor2 from '@/components/FResourceLabelEditor2';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourceOptions from '@/components/FResourceOptions';
import {
  OnChange_IntroductionEditor_Action, OnClick_AddIntroductionBtn_Action,
  OnClick_CancelEditIntroductionBtn_Action,
  OnClick_EditIntroductionBtn_Action, OnClick_SaveIntroductionBtn_Action,
} from '@/models/resourceInfoPage';
import FDropdownMenu from '@/components/FDropdownMenu';
import fMessage from '@/components/fMessage';
import FUploadCover from '@/components/FUploadCover';

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

  function onChangePInputTitle(value: string | null) {
    dispatch<OnChange_Side_InputTitle_Action>({
      type: 'exhibitInfoPage/onChange_Side_InputTitle',
      payload: {
        value: value,
      },
    });
  }

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
              exhibitInfoPage.side_ResourceType.includes('主题') && (<>
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
                    {/*<span*/}
                    {/*  style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>{FI18n.i18nNext.t('toggle_activate_theme')}</span>*/}

                    {/*<FSwitch*/}
                    {/*  disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}*/}
                    {/*  checked={exhibitInfoPage.exhibit_Online}*/}
                    {/*  // loading={loading}*/}
                    {/*  onChange={async () => {*/}
                    {/*    activateTheme();*/}
                    {/*  }}*/}
                    {/*/>*/}

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
              !exhibitInfoPage.side_ResourceType.includes('主题') && (<>

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
                {/*<span*/}
                {/*  style={{ color: exhibitInfoPage.exhibit_Online ? '#42C28C' : '#666' }}>{FI18n.i18nNext.t('switch_set_exhibit_avaliable')}</span>*/}

                {/*<FSwitch*/}
                {/*  disabled={!exhibitInfoPage.exhibit_IsAuth && !exhibitInfoPage.exhibit_Online}*/}
                {/*  checked={exhibitInfoPage.exhibit_Online}*/}
                {/*  // loading={loading}*/}
                {/*  onChange={async (checked) => {*/}
                {/*    if (checked) {*/}
                {/*      await onlineExhibit(exhibitInfoPage.exhibit_ID);*/}
                {/*    } else {*/}

                {/*      const confirm: boolean = await fPromiseModalConfirm({*/}
                {/*        // title: '下架展品',*/}
                {/*        // description: '下架后，其它用户将无法签约该展品，确认要下架吗？',*/}
                {/*        title: '提示',*/}
                {/*        description: FI18n.i18nNext.t('confirm_msg_remove_exhibits_from_auth'),*/}
                {/*        okText: FI18n.i18nNext.t('btn_remove_exhibits_from_auth'),*/}
                {/*        promptKey_localStorage: 'offlineExhibit',*/}
                {/*      });*/}

                {/*      if (confirm) {*/}
                {/*        const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {*/}
                {/*          presentableId: exhibitInfoPage.exhibit_ID,*/}
                {/*          onlineStatus: 0,*/}
                {/*        };*/}
                {/*        await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);*/}
                {/*        fOnOffFeedback({*/}
                {/*          state: 'off',*/}
                {/*          message: FI18n.i18nNext.t('remove_resource_from_auth_msg_done'),*/}
                {/*        });*/}
                {/*      }*/}

                {/*    }*/}
                {/*    FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {*/}
                {/*      value: false,*/}
                {/*      effectiveImmediately: true,*/}
                {/*      onlyNullish: false,*/}
                {/*    });*/}
                {/*    dispatch<FetchInfoAction>({*/}
                {/*      type: 'exhibitInfoPage/fetchInfo',*/}
                {/*    });*/}
                {/*  }}*/}
                {/*/>*/}
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

      </div>

      <div style={{ height: 40 }} />
      <Space size={20} style={{ alignItems: 'flex-start' }}>
        <FUploadCover
          use={'exhibit'}
          onError={(err) => {
            fMessage(err, 'error');
          }}
          onUploadSuccess={(url: string) => {
            // console.log(url, 'url@#$!@#$@#@#$@#');
            dispatch<UpdateBaseInfoAction>({
              type: 'exhibitInfoPage/updateBaseInfo',
              payload: {
                side_ExhibitCover: url,
              },
            });
          }}>
          <div className={styles.cover}>
            <FCoverImage
              src={exhibitInfoPage.side_ExhibitCover || ''}
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
          {
            exhibitInfoPage.side_ExhibitInputTitle === null && (<Space size={10} style={{ height: 38 }}>
              {
                exhibitInfoPage.side_ExhibitTitle === '' && (<>
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                    }}>
                    <FComponentsLib.FIcons.FAdd />
                  </FComponentsLib.FTextBtn>
                  <FComponentsLib.FTextBtn
                    onClick={() => {
                      onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                    }}>添加标题</FComponentsLib.FTextBtn>
                </>)
              }

              {
                exhibitInfoPage.side_ExhibitTitle !== '' && (<>
                  <FComponentsLib.FContentText
                    text={exhibitInfoPage.side_ExhibitTitle}
                    style={{ overflowWrap: 'anywhere' }}
                  />
                  <FTooltip title={'编辑'}>
                    <div>
                      <FComponentsLib.FTextBtn
                        onClick={() => {
                          onChangePInputTitle(exhibitInfoPage.side_ExhibitTitle);
                        }}>
                        <FComponentsLib.FIcons.FEdit />
                      </FComponentsLib.FTextBtn>
                    </div>
                  </FTooltip>
                </>)
              }
            </Space>)
          }

          {
            exhibitInfoPage.side_ExhibitInputTitle !== null && (<TitleInput
              value={exhibitInfoPage.side_ExhibitTitle}
              onOK={(value) => {
                dispatch<UpdateBaseInfoAction>({
                  type: 'exhibitInfoPage/updateBaseInfo',
                  payload: {
                    // side_ExhibitTitle: exhibitInfoPage.side_ExhibitInputTitle || '',
                    side_ExhibitTitle: value,
                  },
                });
                onChangePInputTitle(null);
              }}
              onCancel={() => {
                onChangePInputTitle(null);
              }}
            />)
          }
          <div style={{ height: 10 }} />
          <FComponentsLib.FTextBtn
            type='default'
            onClick={() => {
              window.open(FUtil.LinkTo.resourceDetails({ resourceID: exhibitInfoPage.side_ResourceID }));
            }}
          >
            <Space size={5}>
              <FComponentsLib.FContentText
                type={'additional2'}
                text={'来自于'}
              />
              <FComponentsLib.FContentText
                type={'additional2'}
                style={{ width: 220 }}
                singleRow
                text={exhibitInfoPage.side_ResourceName}
              />
            </Space>
          </FComponentsLib.FTextBtn>
          <div style={{ height: 15 }} />
          <FResourceLabelEditor2
            style={{ minHeight: 70, width: 640, backgroundColor: '#fff', alignItems: 'flex-start' }}
            // value={[]}
            // onChange={(value) => {
            //   // onChange && onChange({
            //   //   ...info,
            //   //   resourceLabels: value,
            //   // });
            // }}
            value={exhibitInfoPage.side_ExhibitTags}
            onChange={(value) => {
              dispatch<UpdateBaseInfoAction>({
                type: 'exhibitInfoPage/updateBaseInfo',
                payload: {
                  side_ExhibitTags: value,
                },
              });
            }}
            // onClickApply={onClickApplyLabels}
          />
        </div>
      </Space>
      <div style={{ height: 20 }} />
      <Space size={10}>
        <FComponentsLib.FTextBtn
          style={{ fontSize: 12 }}
          onClick={() => {
            // set$showMore(!get$showMore());
            // set$auth(get$auth() === 'block' ? 'none' : 'block');
          }}
        >{0 === 0
          ? FI18n.i18nNext.t('brr_resourcelisting_item_btn_showlesssetting')
          : FI18n.i18nNext.t('brr_resourcelisting_item_btn_moresetting')}</FComponentsLib.FTextBtn>
        <FComponentsLib.FContentText
          text={'可以为资源文件添加可选配置，或进行依赖资源的声明'}
          type={'negative'}
          style={{ fontSize: 12 }}
        />
      </Space>
      <div style={{ height: 10 }} />

      <div className={styles.block}>
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

          <div style={{ width: 60 }} />
          <FComponentsLib.FContentText
            type={'highlight'}
            text={'自动更新到最新版本'}
            style={{ fontSize: 12 }}
          />
          <div style={{ width: 20 }} />
          <Switch
            size='small'
            defaultChecked
            className={styles.smallSwitch}
          />
        </div>

      </div>

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
          {/*{*/}
          {/*  info.customProperties.length < 30 && (*/}
          {/*    <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>*/}
          {/*      <div>*/}
          {/*        <FComponentsLib.FTextBtn*/}
          {/*          style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}*/}
          {/*          type='primary'*/}
          {/*          onClick={async () => {*/}
          {/*            const dataSource: {*/}
          {/*              key: string;*/}
          {/*              name: string;*/}
          {/*              value: string;*/}
          {/*              description: string;*/}
          {/*            } | null = await fResourcePropertyEditor({*/}
          {/*              disabledKeys: [*/}
          {/*                ...info.rawProperties.map<string>((rp) => rp.key),*/}
          {/*                ...info.additionalProperties.map<string>((rp) => rp.key),*/}
          {/*                ...info.customProperties.map<string>((bp) => bp.key),*/}
          {/*                ...info.customConfigurations.map<string>((pp) => pp.key),*/}
          {/*              ],*/}
          {/*              disabledNames: [*/}
          {/*                ...info.rawProperties.map<string>((rp) => rp.name),*/}
          {/*                ...info.additionalProperties.map<string>((rp) => rp.name),*/}
          {/*                ...info.customProperties.map<string>((bp) => bp.name),*/}
          {/*                ...info.customConfigurations.map<string>((pp) => pp.name),*/}
          {/*              ],*/}
          {/*            });*/}
          {/*            if (!dataSource) {*/}
          {/*              return;*/}
          {/*            }*/}
          {/*            onChange && onChange({*/}
          {/*              ...info,*/}
          {/*              customProperties: [*/}
          {/*                ...info.customProperties,*/}
          {/*                dataSource,*/}
          {/*              ],*/}
          {/*            });*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <FComponentsLib.FIcons.FProperty style={{ fontSize: 14 }} />*/}
          {/*          <span>补充属性</span>*/}
          {/*        </FComponentsLib.FTextBtn>*/}
          {/*      </div>*/}
          {/*    </FTooltip>)*/}
          {/*}*/}

        </div>
        <div style={{ height: 20 }} />

        <FResourceProperties
          // immutableData={info.rawProperties}
          immutableData={exhibitInfoPage.side_RawProperties}
          // onlyEditValueData={info.additionalProperties}
          onlyEditValueData={[]}
          // alterableData={info.customProperties}
          alterableData={[]}
          onEdit_onlyEditValueData={async (value) => {
            // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
            // const index: number = info.additionalProperties.findIndex((p) => {
            //   return p === value;
            // });
            // const dataSource: {
            //   key: string;
            //   name: string;
            //   value: string;
            //   description: string;
            // } | null = await fResourcePropertyEditor({
            //   disabledKeys: [
            //     ...info.rawProperties.map<string>((rp) => rp.key),
            //     ...info.additionalProperties.map<string>((rp) => rp.key),
            //     ...info.customProperties.map<string>((bp) => bp.key),
            //     ...info.customConfigurations.map<string>((pp) => pp.key),
            //   ],
            //   disabledNames: [
            //     ...info.rawProperties.map<string>((rp) => rp.name),
            //     ...info.additionalProperties.map<string>((rp) => rp.name),
            //     ...info.customProperties.map<string>((bp) => bp.name),
            //     ...info.customConfigurations.map<string>((pp) => pp.name),
            //   ],
            //   defaultData: value,
            //   noneEditableFields: ['key', 'description', 'name'],
            //   valueAcceptNull: true,
            // });
            // if (!dataSource) {
            //   return;
            // }
            // onChange && onChange({
            //   ...info,
            //   additionalProperties: info.additionalProperties.map((v, i) => {
            //     if (i !== index) {
            //       return v;
            //     }
            //     return dataSource;
            //   }),
            // });
          }}
          onEdit_alterableData={async (value) => {
            // const index: number = info.customProperties.findIndex((p) => {
            //   return p === value;
            // });
            // const dataSource: {
            //   key: string;
            //   name: string;
            //   value: string;
            //   description: string;
            // } | null = await fResourcePropertyEditor({
            //   disabledKeys: [
            //     ...info.rawProperties.map<string>((rp) => rp.key),
            //     ...info.additionalProperties.map<string>((rp) => rp.key),
            //     ...info.customProperties.map<string>((bp) => bp.key),
            //     ...info.customConfigurations.map<string>((pp) => pp.key),
            //   ],
            //   disabledNames: [
            //     ...info.rawProperties.map<string>((rp) => rp.name),
            //     ...info.additionalProperties.map<string>((rp) => rp.name),
            //     ...info.customProperties.map<string>((bp) => bp.name),
            //     ...info.customConfigurations.map<string>((pp) => pp.name),
            //   ],
            //   defaultData: value,
            // });
            // if (!dataSource) {
            //   return;
            // }
            //
            // onChange && onChange({
            //   ...info,
            //   customProperties: info.customProperties.map((v, i) => {
            //     if (i !== index) {
            //       return v;
            //     }
            //     return dataSource;
            //   }),
            // });
          }}
          onDelete_alterableData={async (value) => {
            // onChange && onChange({
            //   ...info,
            //   customProperties: info.customProperties.filter((v, i) => {
            //     return v.key !== value.key && v.name !== value.name;
            //   }),
            // });
          }}
        />
      </div>

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText
            text={'可选配置'}
            type={'highlight'}
          />
          {/*{*/}
          {/*  info.customConfigurations.length < 30 && (*/}
          {/*    // <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>*/}
          {/*    <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>*/}
          {/*      <div>*/}
          {/*        <FComponentsLib.FTextBtn*/}
          {/*          style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}*/}
          {/*          type='primary'*/}
          {/*          onClick={async () => {*/}
          {/*            const dataSource: {*/}
          {/*              key: string;*/}
          {/*              name: string;*/}
          {/*              type: 'input' | 'select';*/}
          {/*              input: string;*/}
          {/*              select: string[];*/}
          {/*              description: string;*/}
          {/*            } | null = await fResourceOptionEditor({*/}
          {/*              disabledKeys: [*/}
          {/*                ...info.rawProperties.map<string>((rp) => rp.key),*/}
          {/*                ...info.additionalProperties.map<string>((rp) => rp.key),*/}
          {/*                ...info.customProperties.map<string>((bp) => bp.key),*/}
          {/*                ...info.customConfigurations.map<string>((pp) => pp.key),*/}
          {/*              ],*/}
          {/*              disabledNames: [*/}
          {/*                ...info.rawProperties.map<string>((rp) => rp.name),*/}
          {/*                ...info.additionalProperties.map<string>((rp) => rp.name),*/}
          {/*                ...info.customProperties.map<string>((bp) => bp.name),*/}
          {/*                ...info.customConfigurations.map<string>((pp) => pp.name),*/}
          {/*              ],*/}
          {/*            });*/}

          {/*            if (!dataSource) {*/}
          {/*              return;*/}
          {/*            }*/}

          {/*            onChange && onChange({*/}
          {/*              ...info,*/}
          {/*              customConfigurations: [*/}
          {/*                ...info.customConfigurations,*/}
          {/*                dataSource,*/}
          {/*              ],*/}
          {/*            });*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />*/}
          {/*          <span>{FI18n.i18nNext.t('resourceoptions_add_btn')}</span>*/}
          {/*        </FComponentsLib.FTextBtn>*/}
          {/*      </div>*/}
          {/*    </FTooltip>)*/}
          {/*}*/}

        </div>

        {
          // info.customConfigurations.length === 0 && (<>
          0 === 0 && (<>
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
          // info.customConfigurations.length > 0 && (<>
          0 > 0 && (<>
            <div style={{ height: 20 }} />
            <FResourceOptions
              theme={'dark'}
              // dataSource={resourceVersionCreatorPage.customOptionsData}
              dataSource={[]}
              onEdit={async (value) => {
                // const index: number = info.customConfigurations.findIndex((p) => {
                //   return p === value;
                // });
                //
                // const dataSource: {
                //   key: string;
                //   name: string;
                //   type: 'input' | 'select';
                //   input: string;
                //   select: string[];
                //   description: string;
                // } | null = await fResourceOptionEditor({
                //   disabledKeys: [
                //     ...info.rawProperties.map<string>((rp) => rp.key),
                //     ...info.additionalProperties.map<string>((rp) => rp.key),
                //     ...info.customProperties.map<string>((bp) => bp.key),
                //     ...info.customConfigurations.map<string>((pp) => pp.key),
                //   ],
                //   disabledNames: [
                //     ...info.rawProperties.map<string>((rp) => rp.name),
                //     ...info.additionalProperties.map<string>((rp) => rp.name),
                //     ...info.customProperties.map<string>((bp) => bp.name),
                //     ...info.customConfigurations.map<string>((pp) => pp.name),
                //   ],
                //   defaultData: value,
                // });
                //
                // if (!dataSource) {
                //   return;
                // }
                //
                // onChange && onChange({
                //   ...info,
                //   customConfigurations: info.customConfigurations.map((a, b) => {
                //     if (b !== index) {
                //       return a;
                //     }
                //     return dataSource;
                //   }),
                // });
              }}
              onDelete={async (value) => {
                // onChange && onChange({
                //   ...info,
                //   customConfigurations: info.customConfigurations.filter((a) => {
                //     return a.key !== value.key && a.name !== value.name;
                //   }),
                // });
              }}
            />
          </>)
        }
      </div>

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText
            text={'自定义信息'}
            type={'highlight'}
          />
          {
            // info.customConfigurations.length < 30 && (
            0 < 30 && (
              // <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
              // <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
              //   <div>
              <FComponentsLib.FTextBtn
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                type='primary'
                onClick={async () => {
                  // const dataSource: {
                  //   key: string;
                  //   name: string;
                  //   type: 'input' | 'select';
                  //   input: string;
                  //   select: string[];
                  //   description: string;
                  // } | null = await fResourceOptionEditor({
                  //   disabledKeys: [
                  //     ...info.rawProperties.map<string>((rp) => rp.key),
                  //     ...info.additionalProperties.map<string>((rp) => rp.key),
                  //     ...info.customProperties.map<string>((bp) => bp.key),
                  //     ...info.customConfigurations.map<string>((pp) => pp.key),
                  //   ],
                  //   disabledNames: [
                  //     ...info.rawProperties.map<string>((rp) => rp.name),
                  //     ...info.additionalProperties.map<string>((rp) => rp.name),
                  //     ...info.customProperties.map<string>((bp) => bp.name),
                  //     ...info.customConfigurations.map<string>((pp) => pp.name),
                  //   ],
                  // });
                  //
                  // if (!dataSource) {
                  //   return;
                  // }
                  //
                  // onChange && onChange({
                  //   ...info,
                  //   customConfigurations: [
                  //     ...info.customConfigurations,
                  //     dataSource,
                  //   ],
                  // });
                }}
              >
                <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
                <span>添加自定义信息</span>
              </FComponentsLib.FTextBtn>
              // </div>
              // </FTooltip>
            )
          }

        </div>

        {
          // info.customConfigurations.length === 0 && (<>
          0 === 0 && (<>
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
          // info.customConfigurations.length > 0 && (<>
          0 > 0 && (<>
            <div style={{ height: 20 }} />
            <FResourceOptions
              theme={'dark'}
              // dataSource={resourceVersionCreatorPage.customOptionsData}
              dataSource={[]}
              onEdit={async (value) => {
                // const index: number = info.customConfigurations.findIndex((p) => {
                //   return p === value;
                // });
                //
                // const dataSource: {
                //   key: string;
                //   name: string;
                //   type: 'input' | 'select';
                //   input: string;
                //   select: string[];
                //   description: string;
                // } | null = await fResourceOptionEditor({
                //   disabledKeys: [
                //     ...info.rawProperties.map<string>((rp) => rp.key),
                //     ...info.additionalProperties.map<string>((rp) => rp.key),
                //     ...info.customProperties.map<string>((bp) => bp.key),
                //     ...info.customConfigurations.map<string>((pp) => pp.key),
                //   ],
                //   disabledNames: [
                //     ...info.rawProperties.map<string>((rp) => rp.name),
                //     ...info.additionalProperties.map<string>((rp) => rp.name),
                //     ...info.customProperties.map<string>((bp) => bp.name),
                //     ...info.customConfigurations.map<string>((pp) => pp.name),
                //   ],
                //   defaultData: value,
                // });
                //
                // if (!dataSource) {
                //   return;
                // }
                //
                // onChange && onChange({
                //   ...info,
                //   customConfigurations: info.customConfigurations.map((a, b) => {
                //     if (b !== index) {
                //       return a;
                //     }
                //     return dataSource;
                //   }),
                // });
              }}
              onDelete={async (value) => {
                // onChange && onChange({
                //   ...info,
                //   customConfigurations: info.customConfigurations.filter((a) => {
                //     return a.key !== value.key && a.name !== value.name;
                //   }),
                // });
              }}
            />
          </>)
        }
      </div>

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText text={FI18n.i18nNext.t('resource_short_description')} type={'highlight'} />

          <Space size={10}>
            {
              // resourceInfoPage.resourceInfo.intro !== '' && !resourceInfoPage.introduction_IsEditing
              0 === 0
              && (<FComponentsLib.FTextBtn
                style={{ fontSize: 12 }}
                onClick={() => {
                  // onChangeIsEditing(true);
                  dispatch<OnClick_EditIntroductionBtn_Action>({
                    type: 'resourceInfoPage/onClick_EditIntroductionBtn',
                  });
                }}
              >{FI18n.i18nNext.t('edit')}</FComponentsLib.FTextBtn>)
            }
            {
              // resourceInfoPage.introduction_IsEditing && (<>
              0 === 0 && (<>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12 }}
                  type='default'
                  onClick={() => {
                    // onChangeIsEditing(false);
                    dispatch<OnClick_CancelEditIntroductionBtn_Action>({
                      type: 'resourceInfoPage/onClick_CancelEditIntroductionBtn',
                    });
                  }}
                >{FI18n.i18nNext.t('cancel')}</FComponentsLib.FTextBtn>
                <FComponentsLib.FTextBtn
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    dispatch<OnClick_SaveIntroductionBtn_Action>({
                      type: 'resourceInfoPage/onClick_SaveIntroductionBtn',
                    });
                  }}
                  // disabled={resourceInfoPage.introduction_EditorText_Error !== ''}
                >{FI18n.i18nNext.t('save')}</FComponentsLib.FTextBtn>
              </>)
            }
          </Space>
        </div>

        <div style={{ height: 20 }} />
        {
          0 === 0 && (<div>
            <FComponentsLib.FInput.FMultiLine
              // value={resourceInfoPage.introduction_EditorText}
              value={''}
              lengthLimit={200}
              onChange={(e) => {
                dispatch<OnChange_IntroductionEditor_Action>({
                  type: 'resourceInfoPage/onChange_IntroductionEditor',
                  payload: {
                    value: e.target.value,
                  },
                });
              }}
            />

            {/*{*/}
            {/*  resourceInfoPage.introduction_EditorText_Error !== '' && (<>*/}
            {/*    <div style={{ height: 5 }} />*/}
            {/*    <div style={{ color: '#EE4040' }}>{resourceInfoPage.introduction_EditorText_Error}</div>*/}
            {/*  </>)*/}
            {/*}*/}

          </div>)
        }

        {
          // resourceInfoPage.resourceInfo.intro !== ''
          0 !== 0
            ? (<div className={styles.aboutPanel}>
              {/*<pre>{resourceInfoPage.resourceInfo.intro}</pre>*/}
              <pre>{'12345'}</pre>
            </div>)
            : (<FComponentsLib.FRectBtn
              type='default'
              onClick={() => {
                dispatch<OnClick_AddIntroductionBtn_Action>({
                  type: 'resourceInfoPage/onClick_AddIntroductionBtn',
                });
                // onChangeIsEditing(true);
              }}
            >
              添加简介
            </FComponentsLib.FRectBtn>)
        }
      </div>

      <div style={{ height: 5 }} />
      <div className={styles.block}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FComponentsLib.FContentText text={'相关合约'} type={'highlight'} />
        </div>
        <div style={{ height: 10 }} />
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

  onCancel(): void;
}

function TitleInput({ value, onOK, onCancel }: TitleInputProps) {

  const [$value, set$value, get$value] = FUtil.Hook.useGetState<string>(value);
  const [$valueError, set$valueError, get$valueError] = FUtil.Hook.useGetState<string>('');

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
        type='default'
        // size="small"
        // onClick={() => onChangePInputTitle(null)}
        onClick={() => {
          onCancel();
        }}
      >{FI18n.i18nNext.t('btn_cancel')}</FComponentsLib.FRectBtn>
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
        }}
      >{FI18n.i18nNext.t('btn_save')}</FComponentsLib.FRectBtn>
    </Space>

    {
      $valueError !== '' && (<>
        <div style={{ height: 5 }} />
        <div style={{ color: '#EE4040' }}>{$valueError}</div>
      </>)
    }
  </div>);
}
