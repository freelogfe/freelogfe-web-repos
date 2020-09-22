import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {CopyOutlined, DownloadOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton} from '@/components/FButton';
import {Space, Divider, Popover, Drawer} from 'antd';
import FEditorCard from '@/components/FEditorCard';
import FSelect from '@/components/FSelect';
import FCustomProperties from '@/components/FCustomProperties';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageObjectEditorModelState} from "@/models/connect";
import {resourceTypes} from "@/utils/globals";
import {humanizeSize} from "@/utils/format";
import {i18nMessage} from "@/utils/i18n";
import FAutoComplete from "@/components/FAutoComplete";
import FCopyToClipboard from "@/components/FCopyToClipboard";
import {downloadObject} from "@/services/storages";
import {ChangeAction, UpdateObjectInfoAction} from "@/models/storageObjectEditor";
import {FetchObjectsAction} from "@/models/storageHomePage";

interface DetailsProps {
  dispatch: Dispatch;
  editor: StorageObjectEditorModelState;
}

let autoComplete: any = null;

function Details({editor, dispatch}: DetailsProps) {
  // const divContainer = React.useRef<HTMLDivElement>(null);
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  // const textInput = React.useRef<any>(null);

  return (<Drawer
    title={'编辑对象信息'}
    // onClose={() => setModalVisible(false)}
    visible={editor.visible}
    width={720}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    onClose={() => {
      dispatch<FetchObjectsAction>({
        type: 'storageHomePage/fetchObjects',
      });
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          visible: false,
        },
      });
    }}
  >
    <div className={styles.divContainer}>
      <div style={{height: 10}}/>
      <Space size={15}>
        <FTitleText
          text={`${editor.bucketName}/${editor.objectName}`}
          type="h3"
        />
        <FCopyToClipboard
          text={`${editor.bucketName}/${editor.objectName}`}
          title={'复制对象名称'}
        />
        {/*<FTextButton theme="primary"><CopyOutlined/></FTextButton>*/}
        <FTextButton
          theme="primary"
          onClick={() => {
            downloadObject({
              objectIdOrName: encodeURIComponent(`${editor.bucketName}/${editor.objectName}`)
            });
          }}
        ><DownloadOutlined/></FTextButton>
      </Space>
      <div style={{height: 17}}/>
      <div className={styles.size}>{humanizeSize(editor.size)}</div>
      <div style={{height: 25}}/>
      <FEditorCard title={'资源类型'}>
        {/*<FSelect*/}
        {/*  placeholder={'请选择类型'}*/}
        {/*  className={styles.FSelect}*/}
        {/*  value={editor.type}*/}
        {/*  // dataSource={[{value: 'image', title: 'image'}]}*/}
        {/*  dataSource={resourceTypes.map((t) => ({value: t, title: t}))}*/}
        {/*/>*/}
        <FAutoComplete
          // errorText={resource.resourceTypeErrorText}
          autoRef={(r: any) => {
            console.log(r, 'rRRRRR');
            autoComplete = r;
          }}
          value={editor.type}
          onChange={(value) => {
            dispatch<ChangeAction>({
              type: 'storageObjectEditor/change',
              payload: {
                type: value,
              },
            });
          }}
          onBlur={() => {
            dispatch<UpdateObjectInfoAction>({
              type: 'storageObjectEditor/updateObjectInfo',
              // payload: {
              //   type: value,
              // },
            });
          }}
          onSelect={(value) => {
            dispatch<ChangeAction>({
              type: 'storageObjectEditor/change',
              payload: {
                type: value,
              },
            });
            autoComplete.blur();
            // dispatch<UpdateObjectInfoAction>({
            //   type: 'storageObjectEditor/updateObjectInfo',
            //   // payload: {
            //   //   type: value,
            //   // },
            // });
          }}
          className={styles.FAutoComplete}
          placeholder={i18nMessage('hint_choose_resource_type')}
          options={resourceTypes.map((i: string) => ({value: i}))}
        />
      </FEditorCard>
      <FEditorCard title={'依赖'}>
        <Space size={10}>
          <FCircleButton
            onClick={() => setDepInfoVisible(true)}
            theme="weaken"
          />
          <FContentText text={'添加'}/>
        </Space>
        <DepsCards/>
        <DepsCards/>
      </FEditorCard>
      {/*<FEditorCard title={'自定义属性'}>*/}
      {/*  <Space size={10}>*/}
      {/*    <FCircleButton theme="weaken"/>*/}
      {/*    <FContentText text={'添加'}/>*/}
      {/*  </Space>*/}
      {/*  <FCustomProperties*/}
      {/*    noHeaderButton={true}*/}
      {/*    colNum={2}*/}
      {/*    stubborn={false}*/}
      {/*    // dataSource={version.properties}*/}
      {/*    dataSource={[*/}
      {/*      //   {*/}
      {/*      //   key: '',*/}
      {/*      //   value: '',*/}
      {/*      //   description: '',*/}
      {/*      //   allowCustom: true,*/}
      {/*      //   custom: 'select',*/}
      {/*      //   customOption: ''*/}
      {/*      // }*/}
      {/*    ]}*/}
      {/*    // onChange={(value) => onChange({properties: value})}*/}
      {/*    // onImport={() => dispatch<ImportPreVersionAction>({*/}
      {/*    //   type: 'resourceVersionCreatorPage/importPreVersion',*/}
      {/*    // })}*/}
      {/*  />*/}
      {/*</FEditorCard>*/}

      <Drawer
        title="添加依赖"
        width={640}
        visible={depInfoVisible}
        onClose={() => setDepInfoVisible(false)}
      >
        <SelectDeps/>
      </Drawer>
    </div>
  </Drawer>);
}

export default connect(({storageObjectEditor}: ConnectState) => ({
  editor: storageObjectEditor,
}))(Details);

function BasisUpthrows() {
  return (
    <Space direction="vertical" size={10}>
      <div>
        <Space size={10}>
          <ArrowUpOutlined style={{color: '#EA7171'}}/>
          <span>stefan/image9</span>
        </Space>
      </div>
      <div>
        <Space size={10}>
          <ArrowUpOutlined style={{color: '#EA7171'}}/>
          <span>stefan/image9</span>
        </Space>
      </div>
    </Space>
  );
}

interface Interface {

}

function DepsCards() {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  return (<div
    className={styles.DepsCards}
    ref={(div) => setRef(div)}
  >
    <div style={{height: 30}}/>
    <FContentText text={'添加'}/>
    <div style={{height: 15}}/>
    <div className={styles.resources}>
      <div className={styles.resource}>
        <div className={styles.resourceLeft}>
          <div className={styles.resourceTitle}>
            <FContentText
              singleRow={true}
              text={'stefan/image2image2image2image2image2'}
              className={styles.resourceName}
            />
            <span className={styles.notOnline}>未上线</span>
          </div>
          <div style={{height: 9}}/>
          <div className={styles.resourceInfo}>
            <FContentText type="additional2">image</FContentText>
            <Divider type="vertical"/>
            <FContentText type="additional2">版本范围：xxx</FContentText>
            <Divider type="vertical"/>
            {ref && <Popover
              getPopupContainer={(triggerNode) => {
                return ref || document.body;
              }}
              content={<BasisUpthrows/>}
            >
              <div><FContentText type="additional2">3个基础上抛</FContentText></div>
            </Popover>
            }
          </div>
        </div>
      </div>
    </div>
  </div>);
}
