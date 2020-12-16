import * as React from 'react';
import styles from './index.less';
import {FTitleText, FContentText} from '@/components/FText';
import {DownloadOutlined} from '@ant-design/icons';
import {FTextButton, FCircleButton, FNormalButton} from '@/components/FButton';
import {Space, Drawer} from 'antd';
import FEditorCard from '@/components/FEditorCard';
import FCustomProperties from '@/components/FCustomProperties';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {resourceTypes} from '@/utils/globals';
import {humanizeSize} from '@/utils/format';
import {i18nMessage} from '@/utils/i18n';
import FAutoComplete from '@/components/FAutoComplete';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {downloadObject} from '@/services/storages';
import {
  ChangeAction,
  // DeleteObjectDepAction,
  OnChangeTypeAction,
  UpdateObjectInfoAction
} from '@/models/storageObjectEditor';
import {FetchObjectsAction, UpdateAObjectAction} from '@/models/storageHomePage';
import DepsCards from './DepsCards';
import {ImportLastVersionDataAction} from "@/models/resourceVersionCreatorPage";
import FBaseProperties from "@/components/FBaseProperties";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FUp from "@/components/FIcons/FUp";
import {FDown, FInfo} from "@/components/FIcons";
import FFormLayout from "@/layouts/FFormLayout";
import FBlock from "@/layouts/FFormLayout/FBlock";
import FDrawer from "@/components/FDrawer";

interface DetailsProps {
  dispatch: Dispatch;
  editor: StorageObjectEditorModelState;
}

function Details({editor, dispatch}: DetailsProps) {
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  const hasError: boolean = !!editor.typeError || !!editor.properties.find((ep) => {
    return ep.key === '' || !!ep.keyError
      // || ep.value === '' || !!ep.valueError
      || !!ep.descriptionError
      || (ep.custom === 'select' ? (ep.customOption === '' || !!ep.customOptionError) : (ep.defaultValue === '' || !!ep.defaultValueError))
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

  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'storageObjectEditor/change',
      payload,
    });
  }

  return (<FDrawer
    title={'编辑对象信息'}
    visible={editor.visible}
    // visible={true}
    width={720}
    onClose={() => {
      onChange({
        visible: false,
        propertiesDataVisible: false,
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
      <div style={{height: 10}}/>
      <FBaseProperties
        basics={editor.rawProperties}
        additions={editor.baseProperties}
        onChangeAdditions={(value) => {
          onChange({baseProperties: value});
        }}
        rightTop={<Space size={20}>
          <FTextButton
            theme="primary"
            onClick={() => {
              onChange({
                basePropertiesEditorVisible: true,
                basePropertiesEditorData: editor.baseProperties.map((bp) => {
                  return {
                    ...bp,
                    keyError: '',
                    valueError: '',
                    descriptionError: '',
                  };
                }),
              });
            }}
          >补充属性</FTextButton>
        </Space>}
      />

      <div style={{height: 20}}/>

      <Space>
        <a onClick={() => {
          onChange({
            propertiesDataVisible: !editor.propertiesDataVisible,
          });
        }}>
          <span>自定义选项（高级）</span>
          {editor.propertiesDataVisible ? (<FUp/>) : (<FDown/>)}
        </a>
        <FInfo/>
      </Space>

      {
        editor.propertiesDataVisible && (<>

          <div style={{height: 20}}/>

          <Space size={40}>
            <a
              onClick={() => {
                onChange({
                  properties: [
                    ...editor.properties,
                    {
                      key: '',
                      keyError: '',
                      description: '',
                      descriptionError: '',
                      custom: 'input',
                      customOption: '',
                      customOptionError: '',
                      defaultValue: '',
                      defaultValueError: '',
                    },
                  ],
                });
              }}
            >添加选项</a>

          </Space>

          <div style={{height: 30}}/>

          <FCustomProperties
            dataSource={editor.properties}
            disabledKeys={[
              ...editor.rawProperties.map<string>((rp) => rp.key),
              ...editor.baseProperties.map<string>((pp) => pp.key),
            ]}
            onChange={(value) => onChange({properties: value})}
          />
        </>)
      }

      <div style={{height: 25}}/>
      <FFormLayout>
        <FFormLayout.FBlock title={'资源类型'}>
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
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'依赖'}>
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
              onChange={(value) => {
                console.log(value, 'value2903jafdslkfa');
                dispatch<ChangeAction>({
                  type: 'storageObjectEditor/change',
                  payload: {
                    depRs: value as StorageObjectEditorModelState['depRs'],
                  },
                });
              }}
            />)
          }

          {
            editor.depOs.length > 0 && (<DepsCards
              title={'对象'}
              dataSource={editor.depOs}
              onChange={(value) => {
                dispatch<ChangeAction>({
                  type: 'storageObjectEditor/change',
                  payload: {
                    depOs: value as StorageObjectEditorModelState['depOs'],
                  },
                });
              }}
            />)
          }

        </FFormLayout.FBlock>
        {/*  <FFormLayout.FBlock title={'自定义属性'}>*/}
        {/*    <Space size={10}>*/}
        {/*      <FCircleButton*/}
        {/*        theme="weaken"*/}
        {/*        onClick={() => {*/}
        {/*          dispatch<ChangeAction>({*/}
        {/*            type: 'storageObjectEditor/change',*/}
        {/*            payload: {*/}
        {/*              properties: [*/}
        {/*                ...editor.properties,*/}
        {/*                {*/}
        {/*                  key: '',*/}
        {/*                  keyError: '',*/}
        {/*                  description: '',*/}
        {/*                  descriptionError: '',*/}
        {/*                  custom: 'input',*/}
        {/*                  defaultValue: '',*/}
        {/*                  defaultValueError: '',*/}
        {/*                  customOption: '',*/}
        {/*                  customOptionError: '',*/}
        {/*                },*/}
        {/*              ],*/}
        {/*            },*/}
        {/*          });*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <FContentText text={'添加'}/>*/}
        {/*    </Space>*/}
        {/*    <div style={{height: 20}}/>*/}
        {/*  </FFormLayout.FBlock>*/}
      </FFormLayout>

      <div style={{height: 120}}/>
      <div className={styles.footer}>
        <Space size={30}>
          <FTextButton onClick={() => {
            onChange({
              visible: false,
              propertiesDataVisible: false,
            });
          }}>取消</FTextButton>
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

    <FBasePropsEditorDrawer
      visible={editor.basePropertiesEditorVisible}
      dataSource={editor.basePropertiesEditorData}
      disabledKeys={[
        ...editor.rawProperties.map<string>((rp) => rp.key),
        ...editor.properties.map<string>((pp) => pp.key),
      ]}
      onChange={(value) => {
        onChange({
          basePropertiesEditorData: value,
        });
      }}
      onCancel={() => {
        onChange({
          basePropertiesEditorData: [],
          basePropertiesEditorVisible: false,
        });
      }}
      onConfirm={() => {
        onChange({
          basePropertiesEditorData: [],
          basePropertiesEditorVisible: false,
          baseProperties: editor.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
            return {
              key: bped.key,
              value: bped.value,
              description: bped.description,
            };
          }),
        });
      }}
    />
  </FDrawer>);
}

export default connect(({storageObjectEditor}: ConnectState) => ({
  editor: storageObjectEditor,
}))(Details);
