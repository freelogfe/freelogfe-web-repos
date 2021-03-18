import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextButton, FCircleButton, FNormalButton} from '@/components/FButton';
import {Space} from 'antd';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {resourceTypes} from '@/utils/globals';
import {humanizeSize} from '@/utils/format';
import {i18nMessage} from '@/utils/i18n';
import FAutoComplete from '@/components/FAutoComplete';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {
  ChangeAction, FetchInfoAction,
  OnChangeTypeAction, storageObjectEditorInitData,
  UpdateObjectInfoAction
} from '@/models/storageObjectEditor';
import {UpdateAObjectAction} from '@/models/storageHomePage';
import DepsCards from './DepsCards';
import FBaseProperties from "@/components/FBaseProperties";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FUp from "@/components/FIcons/FUp";
import {FDown, FInfo} from "@/components/FIcons";
import FFormLayout from "@/layouts/FFormLayout";
import FDrawer from "@/components/FDrawer";
import FCustomOptionsEditorDrawer from "@/components/FCustomOptionsEditorDrawer";
import FCustomOptionsCard from "@/components/FCustomOptionsCard";
import FDownload from "@/components/FIcons/FDownload";
import {router} from "umi";
import FLinkTo from "@/utils/path-assembler";
import {FApiServer} from "@/services";
import FDivider from "@/components/FDivider";
import FTooltip from "@/components/FTooltip";

interface DetailsProps {
  dispatch: Dispatch;
  storageObjectEditor: StorageObjectEditorModelState;
}

function Details({storageObjectEditor, dispatch}: DetailsProps) {
  const [depInfoVisible, setDepInfoVisible] = React.useState<boolean>(false);

  const hasError: boolean = !!storageObjectEditor.typeError;

  function onChangeType(value: string) {
    if (value === storageObjectEditor.type) {
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
    visible={!!storageObjectEditor.objectId}
    width={720}
    topRight={<Space size={30}>
      <FTextButton onClick={() => {
        onChange({
          customOptionsDataVisible: false,
        });
        router.push(FLinkTo.storageSpace({bucketName: storageObjectEditor.bucketName}));
      }}>取消</FTextButton>
      <FNormalButton
        disabled={storageObjectEditor.typeVerify === 1 || hasError}
        onClick={async () => {
          await dispatch<UpdateObjectInfoAction>({
            type: 'storageObjectEditor/updateObjectInfo',
          });
          dispatch<UpdateAObjectAction>({
            type: 'storageHomePage/updateAObject',
            payload: {
              id: storageObjectEditor.objectId,
              type: storageObjectEditor.type,
            },
          });
          router.push(FLinkTo.storageSpace({bucketName: storageObjectEditor.bucketName}));
        }}
      >保存</FNormalButton>
    </Space>}
    onClose={() => {
      onChange({
        customOptionsDataVisible: false,
      });
      router.push(FLinkTo.storageSpace({
        bucketName: storageObjectEditor.bucketName,
      }));
    }}
    afterVisibleChange={async (visible) => {

      if (visible) {
        await dispatch<FetchInfoAction>({
          type: 'storageObjectEditor/fetchInfo',
          // payload: (history.location as any).query.objectID,
        });
      } else {
        dispatch<ChangeAction>({
          type: 'storageObjectEditor/change',
          payload: {
            ...storageObjectEditorInitData,
          }
        });
      }

    }}
  >
    <div className={styles.divContainer}>

      <FFormLayout>
        <FFormLayout.FBlock title={'对象'}>
          <div className={styles.Header}>
            <Space size={10}>
              <FContentText
                text={`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`}
                type="highlight"
                className={styles.objectName}
                singleRow
              />
              <FDivider/>
              <FContentText
                text={humanizeSize(storageObjectEditor.size)}
                type="highlight"
              />
            </Space>
            <Space size={15}>
              <FCopyToClipboard
                text={`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`}
                title={'复制对象名称'}
              />
              <FTooltip title={'下载'}>
                <FTextButton
                  theme="primary"
                  onClick={() => {
                    FApiServer.Storage.downloadObject({
                      objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`)
                    });
                  }}
                ><FDownload/></FTextButton>
              </FTooltip>
            </Space>
          </div>
          <div style={{height: 5}}/>
          <FBaseProperties
            basics={storageObjectEditor.rawProperties}
            additions={storageObjectEditor.baseProperties}
            onChangeAdditions={(value) => {
              onChange({baseProperties: value});
            }}
            rightTop={<Space size={20}>
              <FTextButton
                theme="primary"
                onClick={() => {
                  onChange({
                    basePropertiesEditorVisible: true,
                    basePropertiesEditorData: storageObjectEditor.baseProperties.map((bp) => {
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
                customOptionsDataVisible: !storageObjectEditor.customOptionsDataVisible,
              });
            }}>
              <span>自定义选项（高级）</span>
              {storageObjectEditor.customOptionsDataVisible ? (<FUp/>) : (<FDown/>)}
            </a>
            <FInfo/>
          </Space>

          {
            storageObjectEditor.customOptionsDataVisible && (<>

              <div style={{height: 20}}/>

              <Space size={40}>
                <a onClick={() => {
                  dispatch<ChangeAction>({
                    type: 'storageObjectEditor/change',
                    payload: {
                      customOptionsEditorVisible: true,
                      customOptionsEditorDataSource: storageObjectEditor.customOptionsData.map<StorageObjectEditorModelState['customOptionsEditorDataSource'][number]>((coeds) => {
                        return {
                          ...coeds,
                          customOptionError: '',
                          defaultValueError: '',
                          keyError: '',
                          descriptionError: '',
                        };
                      }),
                    },
                  });
                }}>添加选项</a>

              </Space>

              <div style={{height: 20}}/>
              {
                storageObjectEditor.customOptionsData.length > 0 ? (
                    <FCustomOptionsCard
                      dataSource={storageObjectEditor.customOptionsData.map((cod) => {
                        return {
                          key: cod.key,
                          type: cod.custom === 'input' ? '输入框' : '选择框',
                          description: cod.description,
                          value: cod.custom === 'input' ? cod.defaultValue : cod.customOption,
                        };
                      })}
                      onDeleteKey={(value) => {
                        dispatch<ChangeAction>({
                          type: 'storageObjectEditor/change',
                          payload: {
                            customOptionsData: storageObjectEditor.customOptionsData.filter((cod) => {
                              return cod.key !== value;
                            }),
                          },
                        })
                      }}
                    />
                  )
                  : (<FContentText text={'暂无自定义选项…'} type="negative"/>)
              }

            </>)
          }

          {/*<div style={{height: 25}}/>*/}
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'资源类型'}>
          <FAutoComplete
            errorText={storageObjectEditor.typeError}
            value={storageObjectEditor.type}
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
            <FContentText text={'添加依赖'}/>
          </Space>
          {
            storageObjectEditor.depRs.length > 0 && (<DepsCards
              title={'资源'}
              dataSource={storageObjectEditor.depRs}
              onChange={(value) => {
                // console.log(value, 'value2903jafdslkfa');
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
            storageObjectEditor.depOs.length > 0 && (<DepsCards
              title={'对象'}
              dataSource={storageObjectEditor.depOs}
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
      </FFormLayout>

      <FDrawer
        title="添加依赖"
        width={640}
        visible={depInfoVisible}
        onClose={() => setDepInfoVisible(false)}
        afterVisibleChange={(visible) => {

        }}
      >
        <SelectDeps/>
      </FDrawer>
    </div>

    <FBasePropsEditorDrawer
      visible={storageObjectEditor.basePropertiesEditorVisible}
      dataSource={storageObjectEditor.basePropertiesEditorData}
      disabledKeys={[
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),
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
          baseProperties: storageObjectEditor.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
            return {
              key: bped.key,
              value: bped.value,
              description: bped.description,
            };
          }),
        });
      }}
    />

    <FCustomOptionsEditorDrawer
      visible={storageObjectEditor.customOptionsEditorVisible}
      onCancel={() => {
        dispatch<ChangeAction>({
          type: 'storageObjectEditor/change',
          payload: {
            customOptionsEditorVisible: false,
            customOptionsEditorDataSource: [],
          },
        });
      }}
      dataSource={storageObjectEditor.customOptionsEditorDataSource}
      disabledKeys={[
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.baseProperties.map<string>((pp) => pp.key),
      ]}
      onChange={(value) => {
        dispatch<ChangeAction>({
          type: 'storageObjectEditor/change',
          payload: {customOptionsEditorDataSource: value},
        });
      }}
      onConfirm={() => {
        dispatch<ChangeAction>({
          type: 'storageObjectEditor/change',
          payload: {
            customOptionsData: storageObjectEditor.customOptionsEditorDataSource.map<StorageObjectEditorModelState['customOptionsData'][number]>((coeds) => {
              return {
                key: coeds.key,
                defaultValue: coeds.defaultValue,
                description: coeds.description,
                custom: coeds.custom,
                customOption: coeds.customOption,
              };
            }),
            customOptionsEditorDataSource: [],
            customOptionsEditorVisible: false,
          }
        })
      }}
    />
  </FDrawer>);
}

export default connect(({storageObjectEditor}: ConnectState) => ({
  storageObjectEditor: storageObjectEditor,
}))(Details);
