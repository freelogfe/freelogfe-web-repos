import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import img_markdown from '@/assets/createVersion_markdown.png';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import {
  OnChange_AdditionalProperties_Action,
  OnChange_CustomProperties_Action,
} from '@/models/resourceVersionCreatorPage';
import FTooltip from '@/components/FTooltip';
// import fReadLocalFiles from '@/components/fReadLocalFiles';
// import { RcFile } from 'antd/lib/upload/interface';
import {
  // OnClick_step2_skipBtn_Action,
  OnClick_step2_submitBtn_Action,
  OnSucceed_step2_localUpload_Action, OnSucceed_step2_storageSpace_Action,
} from '@/models/resourceCreatorPage';
import FResourceProperties from '@/components/FResourceProperties';
import { history } from 'umi';
import * as AHooks from 'ahooks';
// import { useGetState } from '@/utils/hooks';
// import fMessage from '@/components/fMessage';
// import FModal from '@/components/FModal';
// import FTable from '@/components/FTable';
import LocalUpload from './LocalUpload';
import StorageSpace from './StorageSpace';
import { Space } from 'antd';

interface Step2Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step2({ dispatch, resourceCreatorPage }: Step2Props) {

  const isCartoon = resourceCreatorPage.step1_createdResourceInfo?.resourceType[0] === '阅读'
    && resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '漫画'
    && (resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '条漫'
      || resourceCreatorPage.step1_createdResourceInfo?.resourceType[2] === '页漫');

  if (!resourceCreatorPage.step2_fileInfo) {
    return (<>
      <div style={{ height: 40 }} />
      <div className={styles.styles}>
        {
          !isCartoon && (<LocalUpload
            resourceTypeCode={resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_localUpload_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_localUpload',
                payload: {
                  fileName: value.fileName,
                  sha1: value.sha1,
                },
              });
            }}
          />)
        }

        {
          !isCartoon && (<StorageSpace
            resourceTypeCode={resourceCreatorPage.step1_createdResourceInfo?.resourceTypeCode || ''}
            onSucceed={(value) => {
              dispatch<OnSucceed_step2_storageSpace_Action>({
                type: 'resourceCreatorPage/onSucceed_step2_storageSpace',
                payload: value,
              });
            }}
          />)
        }


        {
          !isCartoon && resourceCreatorPage.step1_createdResourceInfo?.resourceType[0] === '阅读'
          && resourceCreatorPage.step1_createdResourceInfo?.resourceType[1] === '文章'
          && (<div className={styles.markdownEditor}>
            <img
              src={img_markdown}
              alt={''}
              style={{ width: 56, height: 64 }}
            />
            <div style={{ height: 40 }} />
            <FComponentsLib.FContentText text={'markdown编辑器'} type={'additional2'} />
            <div style={{ height: 40 }} />
            <FComponentsLib.FRectBtn type={'primary'}>立即体验</FComponentsLib.FRectBtn>
          </div>)
        }

        {
          isCartoon && (<div className={styles.markdownEditor}>
            <img
              src={img_markdown}
              alt={''}
              style={{ width: 56, height: 64 }}
            />
            <div style={{ height: 40 }} />
            <FComponentsLib.FContentText text={'漫画编辑器'} type={'additional2'} />
            <div style={{ height: 40 }} />
            <FComponentsLib.FRectBtn type={'primary'}>立即体验</FComponentsLib.FRectBtn>
          </div>)
        }

      </div>

      {/*{*/}
      {/*  resourceCreatorPage.step2_fileInfo_errorTip !== '' && (<>*/}
      {/*    <div style={{ height: 5 }} />*/}
      {/*    <div style={{ color: '#EE4040' }}>{resourceCreatorPage.step2_fileInfo_errorTip}</div>*/}
      {/*  </>)*/}
      {/*}*/}

      <div style={{ height: 30 }} />

      <div className={styles.btn}>

        {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
        <FComponentsLib.FTextBtn
          type={'default'}
          onClick={() => {
            // history.push(FUtil.LinkTo.resourceVersion({
            //   resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
            //   version: '1.0.0',
            // }));
            history.push(FUtil.LinkTo.myResources());
          }}
        >稍后处理</FComponentsLib.FTextBtn>

        {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
        <FComponentsLib.FRectBtn
          disabled={!resourceCreatorPage.step2_fileInfo}
          type={'primary'}
          onClick={() => {
            dispatch<OnClick_step2_submitBtn_Action>({
              type: 'resourceCreatorPage/onClick_step2_submitBtn',
            });
          }}
        >提交</FComponentsLib.FRectBtn>
      </div>

      <div style={{ height: 100 }} />
    </>);
  }

  return (<>
    <div style={{ height: 40 }} />

    <div className={styles.fileInfo}>
      <div className={styles.card}>
        <img src={img} className={styles.img} alt='' />
        <div style={{ width: 20 }} />
        <div>
          <FComponentsLib.FContentText
            type='highlight'
            text={resourceCreatorPage.step2_fileInfo.name}
            style={{ maxWidth: 600 }}
            singleRow
          />
          <div style={{ height: 18 }} />
          <div className={styles.info}>
            <FComponentsLib.FContentText
              className={styles.infoSize}
              type='additional1'
              text={resourceCreatorPage.step2_fileInfo.from}
            />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/*{*/}
        {/*  $prop.showEditBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
        {/*    disabled={$prop.disabledOperations?.includes('edit')}*/}
        {/*    type='primary'*/}
        {/*    onClick={() => {*/}
        {/*      $prop.onClick_EditBtn && $prop.onClick_EditBtn();*/}
        {/*    }}*/}
        {/*    // className={styles.delete}*/}
        {/*  >编辑</FComponentsLib.FTextBtn>)*/}
        {/*}*/}

        {/*{*/}
        {/*  $prop.showDownloadBtnAfterSucceed && (<FComponentsLib.FTextBtn*/}
        {/*    type='primary'*/}
        {/*    disabled={$prop.disabledOperations?.includes('download')}*/}
        {/*    onClick={() => {*/}
        {/*      // self.location.href = FUtil.Format.completeUrlByDomain('qi')*/}
        {/*      //   + `/v2/storages/files/${$prop.fileInfo?.sha1}/download?attachmentName=${$prop.fileInfo?.name}`;*/}
        {/*      $prop.onClick_DownloadBtn && $prop.onClick_DownloadBtn();*/}
        {/*    }}*/}
        {/*  >下载</FComponentsLib.FTextBtn>)*/}
        {/*}*/}


        <FComponentsLib.FTextBtn
          type='danger'
          // disabled={$prop.disabledOperations?.includes('remove')}
          onClick={async () => {
            // $prop.onClick_DeleteBtn && $prop.onClick_DeleteBtn();

          }}
          // className={styles.delete}
        >{FI18n.i18nNext.t('remove')}</FComponentsLib.FTextBtn>
      </div>
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
        {/*<FComponentsLib.FContentText text={''} type={'highlight'}/>*/}

        <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
          <div>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
              type='primary'
              onClick={async () => {
                const dataSource: {
                  key: string;
                  name: string;
                  value: string;
                  description: string;
                } | null = await fResourcePropertyEditor({
                  disabledKeys: [
                    // ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
                    // ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.key),
                    // ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
                    // ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
                  ],
                  disabledNames: [
                    // ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.name),
                    // ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.name),
                    // ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
                    // ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
                  ],
                });
                // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                if (!dataSource) {
                  return;
                }

                await dispatch<OnChange_CustomProperties_Action>({
                  type: 'resourceVersionCreatorPage/onChange_CustomProperties',
                  payload: {
                    value: [
                      // ...resourceVersionCreatorPage.customProperties,
                      // dataSource,
                    ],
                  },
                });
              }}
            >
              <FComponentsLib.FIcons.FProperty style={{ fontSize: 14 }} />
              <span>补充属性</span>
            </FComponentsLib.FTextBtn>
          </div>
        </FTooltip>
      </div>
      <div style={{ height: 20 }} />

      <FResourceProperties
        immutableData={resourceCreatorPage.step2_rawProperties}
        onlyEditValueData={resourceCreatorPage.step2_additionalProperties}
        alterableData={resourceCreatorPage.step2_customProperties}
        onEdit_onlyEditValueData={async (value) => {
          // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
          // const index: number = resourceVersionCreatorPage.additionalProperties.findIndex((p) => {
          //   return p === value;
          // });
          // const dataSource: {
          //   key: string;
          //   name: string;
          //   value: string;
          //   description: string;
          // } | null = await fResourcePropertyEditor({
          //   disabledKeys: [
          //     ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          //     ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
          //     ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
          //     ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
          //   ],
          //   disabledNames: [
          //     ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
          //   ],
          //   defaultData: value,
          //   noneEditableFields: ['key', 'description', 'name'],
          //   valueAcceptNull: true,
          // });
          // if (!dataSource) {
          //   return;
          // }
          //
          // await dispatch<OnChange_AdditionalProperties_Action>({
          //   type: 'resourceVersionCreatorPage/onChange_AdditionalProperties',
          //   payload: {
          //     value: resourceVersionCreatorPage.additionalProperties.map((v, i) => {
          //       if (i !== index) {
          //         return v;
          //       }
          //       return dataSource;
          //     }),
          //   },
          // });
        }}
        onEdit_alterableData={async (value) => {
          // const index: number = resourceVersionCreatorPage.customProperties.findIndex((p) => {
          //   return p === value;
          // });
          // const dataSource: {
          //   key: string;
          //   name: string;
          //   value: string;
          //   description: string;
          // } | null = await fResourcePropertyEditor({
          //   disabledKeys: [
          //     ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
          //     ...resourceVersionCreatorPage.additionalProperties.map<string>((rp) => rp.key),
          //     ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.key),
          //     ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.key),
          //   ],
          //   disabledNames: [
          //     ...resourceVersionCreatorPage.rawProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.additionalProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.customProperties.map<string>((bp) => bp.name),
          //     ...resourceVersionCreatorPage.customConfigurations.map<string>((pp) => pp.name),
          //   ],
          //   defaultData: value,
          // });
          // if (!dataSource) {
          //   return;
          // }
          //
          // await dispatch<OnChange_CustomProperties_Action>({
          //   type: 'resourceVersionCreatorPage/onChange_CustomProperties',
          //   payload: {
          //     value: resourceVersionCreatorPage.customProperties.map((v, i) => {
          //       if (i !== index) {
          //         return v;
          //       }
          //       return dataSource;
          //     }),
          //   },
          // });
        }}
        onDelete_alterableData={async (value) => {
          // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
          // await dispatch<OnChange_CustomProperties_Action>({
          //   type: 'resourceVersionCreatorPage/onChange_CustomProperties',
          //   payload: {
          //     value: resourceVersionCreatorPage.customProperties.filter((v, i) => {
          //       return v.key !== value.key && v.name !== value.name;
          //     }),
          //   },
          // });
        }}
      />
    </div>

    <div style={{ height: 15 }} />

    <Space size={10}>
      {/*{FI18n.i18nNext.t('create_new_version_btn_moresetting')}*/}
      <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'primary'}>更多设置</FComponentsLib.FTextBtn>
      {/*{FI18n.i18nNext.t('create_new_version_btn_moresetting_help')}*/}
      <FComponentsLib.FContentText text={'可以为资源文件添加可选配置，或进行依赖资源的声明'} type={'additional2'} />
    </Space>

    {/*{FI18n.i18nNext.t('create_new_version_btn_showless')}*/}
    <FComponentsLib.FTextBtn style={{ fontSize: 12 }} type={'primary'}>收起更多设置</FComponentsLib.FTextBtn>

    <div style={{ height: 10 }} />

    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/*{FI18n.i18nNext.t('resourceoptions_title')}*/}
        <FComponentsLib.FContentText text={'可选配置'} type={'highlight'} />

        <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
          <div>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
              type='primary'
              onClick={async () => {

              }}
            >
              <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
              <span>{FI18n.i18nNext.t('resourceoptions_add_btn')}</span>
            </FComponentsLib.FTextBtn>
          </div>
        </FTooltip>
      </div>
      <>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
          <FComponentsLib.FContentText text={'可选配置是资源在消费端展示时所需的配置信息，您可以根据需要添加。'} type={'additional2'} />
        </div>
        <div style={{ height: 20 }} />
      </>

      <>
        {/*<div style={{ height: 20 }} />*/}
      </>
    </div>

    <div style={{ height: 5 }} />

    <div className={styles.block}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/*{FI18n.i18nNext.t('claim_rely_title')}*/}
        <FComponentsLib.FContentText text={'依赖声明'} type={'highlight'} />

        <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
          <div>
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
              type='primary'
              onClick={async () => {

              }}
            >
              <FComponentsLib.FIcons.FConfiguration style={{ fontSize: 14 }} />
              <span>{FI18n.i18nNext.t('claim_rely_add_btn')}</span>
            </FComponentsLib.FTextBtn>
          </div>
        </FTooltip>
      </div>
      <>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          {/*<span>{FI18n.i18nNext.t('resourceoptions_list_empty')}</span>*/}
          <FComponentsLib.FContentText text={'依赖是当前作品创作过程中使用到的素材、引用或再创作的基础。'} type={'additional2'} />
          <FComponentsLib.FContentText text={'如果这些内容在Freelog中发行并且开放授权，您可以在此模块进行申明，并获取授权。'} type={'additional2'} />
        </div>
        <div style={{ height: 20 }} />
      </>

      <>
        {/*<div style={{ height: 20 }} />*/}
      </>
    </div>

    <div style={{ height: 30 }} />

    <div className={styles.btn}>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_later')}*/}
      <FComponentsLib.FTextBtn
        type={'default'}
        onClick={() => {
          // history.push(FUtil.LinkTo.resourceVersion({
          //   resourceID: resourceCreatorPage.step1_createdResourceInfo?.resourceID || '',
          //   version: '1.0.0',
          // }));
          history.push(FUtil.LinkTo.myResources());

        }}
      >稍后处理</FComponentsLib.FTextBtn>

      {/*{FI18n.i18nNext.t('rqr_step3_btn_next')}*/}
      <FComponentsLib.FRectBtn
        disabled={!resourceCreatorPage.step2_fileInfo}
        type={'primary'}
        onClick={() => {
          dispatch<OnClick_step2_submitBtn_Action>({
            type: 'resourceCreatorPage/onClick_step2_submitBtn',
          });
        }}
      >提交</FComponentsLib.FRectBtn>
    </div>

    <div style={{ height: 100 }} />
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step2);


