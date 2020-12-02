import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {DownloadOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton, FNormalButton} from '@/components/FButton';
import {Space, Divider, Popover, Drawer, Row, Col} from 'antd';
import FEditorCard from '@/components/FEditorCard';
import FSelect from '@/components/FSelect';
import FCustomProperties from '@/components/FCustomProperties';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageObjectEditorModelState} from '@/models/connect';
import {resourceTypes} from '@/utils/globals';
import {humanizeSize} from '@/utils/format';
import {i18nMessage} from '@/utils/i18n';
import FAutoComplete from '@/components/FAutoComplete';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {downloadObject} from '@/services/storages';
import {
  ChangeAction,
  DeleteObjectDepAction,
  OnChangeTypeAction,
  UpdateObjectInfoAction
} from '@/models/storageObjectEditor';
import {FetchObjectsAction, UpdateAObjectAction} from '@/models/storageHomePage';
import DepsCards from './DepsCards';

interface DetailsProps {
  dispatch: Dispatch;
  editor: StorageObjectEditorModelState;
}

function Details({editor, dispatch}: DetailsProps) {
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  const hasError: boolean = !!editor.typeError || !!editor.properties.find((ep) => {
    return ep.key === '' || !!ep.keyError
      || ep.value === '' || !!ep.valueError
      || !!ep.descriptionError
      || (ep.allowCustom && ep.custom === 'select' && (ep.customOption === '' || !!ep.customOptionError))
  });

  function onChangeType(value: string) {
    if (value === editor.type) {
      return;
    }
    dispatch<OnChangeTypeAction>({
      type: 'storageObjectEditor/onChangeType',
      payload: value,
    });
  }

  return (<Drawer
    title={'编辑对象信息'}
    visible={editor.visible}
    width={720}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
    onClose={() => {
      dispatch<ChangeAction>({
        type: 'storageObjectEditor/change',
        payload: {
          visible: false,
        },
      });
    }}>
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
          value={editor.type}
          debounce={300}
          onDebounceChange={(value) => {
            onChangeType(value);
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
          dataSource={editor.properties}
          onChange={(value) => {
            dispatch<ChangeAction>({
              type: 'storageObjectEditor/change',
              payload: {
                properties: value,
              },
            });
          }}
        />
      </FEditorCard>

      <div style={{height: 120}}/>
      <div className={styles.footer}>
        <Space size={30}>
          <FTextButton>取消</FTextButton>
          <FNormalButton
            disabled={editor.typeVerify === 1 || hasError}
            onClick={async () => {
              await dispatch<UpdateObjectInfoAction>({
                type: 'storageObjectEditor/updateObjectInfo',
              });
              dispatch<UpdateAObjectAction>({
                type: 'storageHomePage/updateAObject',
                payload: {
                  id: editor.objectId,
                  type: editor.type,
                },
              });
              dispatch<ChangeAction>({
                type: 'storageObjectEditor/change',
                payload: {
                  visible: false,
                }
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
