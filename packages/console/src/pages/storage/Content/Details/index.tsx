import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {CopyOutlined, DownloadOutlined, ArrowUpOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton, FNormalButton} from '@/components/FButton';
import {Space, Divider, Popover, Drawer, Row, Col} from 'antd';
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
import {
  ChangeAction,
  DeleteObjectDepAction,
  OnChangeTypeAction,
  UpdateObjectInfoAction
} from "@/models/storageObjectEditor";
import {FetchObjectsAction} from "@/models/storageHomePage";
import DepsCards from './DepsCards';

interface DetailsProps {
  dispatch: Dispatch;
  editor: StorageObjectEditorModelState;
}

// let autoComplete: any = null;

function Details({editor, dispatch}: DetailsProps) {
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  return (<Drawer
    title={'编辑对象信息'}
    // onClose={() => setModalVisible(false)}
    visible={editor.visible}
    // visible={true}
    width={720}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    onClose={() => {
      // dispatch<FetchObjectsAction>({
      //   type: 'storageHomePage/fetchObjects',
      // });
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
        <FAutoComplete
          errorText={editor.typeError}
          // autoRef={(r: any) => {
          //   autoComplete = r;
          // }}
          value={editor.type}
          onChange={(value) => {
            dispatch<OnChangeTypeAction>({
              type: 'storageObjectEditor/onChangeType',
              payload: value,
            });
          }}
          onSelect={(value) => {
            if (value === editor.type) {
              return;
            }
            dispatch<OnChangeTypeAction>({
              type: 'storageObjectEditor/onChangeType',
              payload: value,
            });
            // autoComplete.blur();
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
        {
          editor.depRs.length > 0 && (<DepsCards
            title={'资源'}
            dataSource={editor.depRs}
            onDelete={(name) => {
              dispatch<DeleteObjectDepAction>({
                type: 'storageObjectEditor/deleteObjectDep',
                payload: {
                  resourceName: name,
                }
              });
            }}
          />)
        }

        {
          editor.depOs.length > 0 && (<DepsCards
            title={'对象'}
            dataSource={editor.depOs}
            onDelete={(name) => {
              dispatch<DeleteObjectDepAction>({
                type: 'storageObjectEditor/deleteObjectDep',
                payload: {
                  objectName: name,
                }
              });
            }}
          />)
        }

      </FEditorCard>
      <FEditorCard title={'自定义属性'}>
        <Space size={10}>
          <FCircleButton
            theme="weaken"
            onClick={() => {
              dispatch<ChangeAction>({
                type: 'storageObjectEditor/change',
                payload: {
                  properties: [
                    ...editor.properties,
                    {
                      key: '',
                      keyError: '',
                      value: '',
                      valueError: '',
                      description: '',
                      descriptionError: '',
                      allowCustom: false,
                      custom: 'input',
                      customOption: '',
                      customOptionError: '',
                    },
                  ],
                },
              });
            }}
          />
          <FContentText text={'添加'}/>
        </Space>
        <div style={{height: 20}}/>
        <FCustomProperties
          // noHeaderButton={true}
          // colNum={2}
          // stubborn={false}
          // dataSource={version.properties}
          dataSource={editor.properties}
          onChange={(value) => {
            // console.log(value, 'value2309uwfd');
            // onChange({properties: value});
            dispatch<ChangeAction>({
              type: 'storageObjectEditor/change',
              payload: {
                properties: value,
              },
            });

          }}
          // onImport={() => dispatch<ImportPreVersionAction>({
          //   type: 'resourceVersionCreatorPage/importPreVersion',
          // })}
        />
      </FEditorCard>

      <div style={{height: 120}}/>
      <div className={styles.footer}>
        <Space size={30}>
          <FTextButton>取消</FTextButton>
          <FNormalButton
            onClick={() => {
             dispatch<UpdateObjectInfoAction>({
               type: 'storageObjectEditor/updateObjectInfo',
             });
            }}
          >保存</FNormalButton>
        </Space>
      </div>

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
