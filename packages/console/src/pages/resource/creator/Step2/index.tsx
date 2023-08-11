import * as React from 'react';
import styles from './index.less';
import img from '@/assets/file-object.svg';
import img_markdown from '@/assets/createVersion_markdown.png';
import FComponentsLib from '@freelog/components-lib';
import { connect } from 'dva';
import { ConnectState, ResourceCreatorPageModelState } from '@/models/connect';
import { Dispatch } from 'redux';
import { FI18n } from '@freelog/tools-lib';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import { OnChange_CustomProperties_Action } from '@/models/resourceVersionCreatorPage';
import FTooltip from '@/components/FTooltip';

interface Step2Props {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
}

function Step2({ dispatch, resourceCreatorPage }: Step2Props) {

  if (!resourceCreatorPage.step2_fileInfo) {
    return (<>
      <div style={{ height: 40 }} />
      <div className={styles.styles}>
        <div className={styles.localUpload}>
          <FComponentsLib.FIcons.FLocalUpload style={{ fontSize: 60 }} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FContentText text={'选择本地文件作为发行对象'} type={'additional2'} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn
            type={'primary'}
            onClick={() => {

            }}
          >本地上传</FComponentsLib.FRectBtn>
        </div>

        <div className={styles.storageSpace}>
          <FComponentsLib.FIcons.FStorageSpace style={{ fontSize: 60 }} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FContentText text={'选择存储空间对象作为发行对象'} type={'additional2'} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn type={'primary'}>存储空间导入</FComponentsLib.FRectBtn>
        </div>

        <div className={styles.markdownEditor}>
          <img
            src={img_markdown}
            alt={''}
            style={{ width: 56, height: 64 }}
          />
          <div style={{ height: 40 }} />
          <FComponentsLib.FContentText text={'markdown编辑器'} type={'additional2'} />
          <div style={{ height: 40 }} />
          <FComponentsLib.FRectBtn type={'primary'}>立即体验</FComponentsLib.FRectBtn>
        </div>

      </div>
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
          onClick={() => {
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
              <FComponentsLib.FIcons.FProperty style={{fontSize: 14}} />
              <span>补充属性</span>
            </FComponentsLib.FTextBtn>
          </div>
        </FTooltip>
      </div>
      <div style={{ height: 20 }} />


    </div>
  </>);
}

export default connect(({ resourceCreatorPage }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
}))(Step2);
