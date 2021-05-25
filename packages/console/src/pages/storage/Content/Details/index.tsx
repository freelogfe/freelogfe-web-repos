import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FTextBtn, FRectBtn} from '@/components/FButton';
import {Space} from 'antd';
import SelectDeps from '@/pages/storage/Content/SelectDeps';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceVersionCreatorPageModelState, StorageObjectEditorModelState} from '@/models/connect';
import FAutoComplete from '@/components/FAutoComplete';
import FCopyToClipboard from '@/components/FCopyToClipboard';
import {
  ChangeAction,
  OnChangeTypeAction,
  UpdateObjectInfoAction
} from '@/models/storageObjectEditor';
import {UpdateAObjectAction} from '@/models/storageHomePage';
import DepsCards from './DepsCards';
import FBaseProperties from "@/components/FBaseProperties";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import {FDown, FInfo, FUp, FDownload} from "@/components/FIcons";
import FFormLayout from "@/components/FFormLayout";
import FDrawer from "@/components/FDrawer";
import FCustomOptionsEditorDrawer from "@/components/FCustomOptionsEditorDrawer";
import {router} from "umi";
import {FApiServer} from "@/services";
import FTooltip from "@/components/FTooltip";
import FUtil from "@/utils";
import FCustomOptionsCards from "@/components/FCustomOptionsCards";
import FBasePropEditorDrawer from "@/components/FBasePropEditorDrawer";
import FCustomOptionEditorDrawer from "@/components/FCustomOptionEditorDrawer";

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
      <FTextBtn
        onClick={() => {
          onChange({
            customOptionsDataVisible: false,
          });
          router.push(FUtil.LinkTo.storageSpace({bucketName: storageObjectEditor.bucketName}));
        }}
        type="default"
      >取消</FTextBtn>
      <FRectBtn
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
          router.push(FUtil.LinkTo.storageSpace({bucketName: storageObjectEditor.bucketName}));
        }}
      >保存</FRectBtn>
    </Space>}
    onClose={() => {
      onChange({
        customOptionsDataVisible: false,
      });
      router.push(FUtil.LinkTo.storageSpace({
        bucketName: storageObjectEditor.bucketName,
      }));
    }}
    // afterVisibleChange={async (visible) => {
    //   console.log(visible, 'visible@#$WEREREWr');
    //
    // }}
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
            </Space>
            <Space size={15}>
              <FCopyToClipboard
                iconStyle={{fontSize: 14}}
                text={`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`}
                title={FUtil.I18n.message('copy_object_name')}
              />
              <FTooltip title={FUtil.I18n.message('tip_download_object')}>
                <div>
                  <FTextBtn
                    type="primary"
                    onClick={() => {
                      FApiServer.Storage.downloadObject({
                        objectIdOrName: encodeURIComponent(`${storageObjectEditor.bucketName}/${storageObjectEditor.objectName}`)
                      });
                    }}
                  ><FDownload style={{fontSize: 14}}/></FTextBtn>
                </div>
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
            onClickEdit={(theKey: string) => {
              const index: number = storageObjectEditor.baseProperties.findIndex((bp) => {
                return bp.key === theKey;
              });
              onChange({
                basePropertyEditorIndex: index,
                basePropertyEditorData: {
                  ...storageObjectEditor.baseProperties[index],
                  keyError: '',
                  valueError: '',
                  descriptionError: '',
                },
              });
            }}
            rightTop={<Space size={20}>
              <FTextBtn
                style={{fontSize: 12, fontWeight: 600}}
                type="primary"
                onClick={() => {
                  onChange({
                    basePropertiesEditorVisible: true,
                    basePropertiesEditorData: [{
                      key: '',
                      keyError: '',
                      value: '',
                      valueError: '',
                      description: '',
                      descriptionError: '',
                    }],
                  });
                }}
              >补充属性</FTextBtn>
            </Space>}
          />

          <div style={{height: 20}}/>

          <Space>
            <FTextBtn
              onClick={() => {
                onChange({
                  customOptionsDataVisible: !storageObjectEditor.customOptionsDataVisible,
                });
              }}
              type="default"
              style={{fontSize: 12, fontWeight: 600}}
            >
              <span>自定义选项（高级）</span>
              {storageObjectEditor.customOptionsDataVisible ? (<FUp/>) : (<FDown/>)}
            </FTextBtn>
            <FTooltip title={'自定义选项'}>
              <div>
                <FInfo/>
              </div>
            </FTooltip>
          </Space>

          {
            storageObjectEditor.customOptionsDataVisible && (<>

              <div style={{height: 20}}/>

              <Space size={40}>
                <FTextBtn
                  onClick={() => {
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
                  }}
                  type="primary"
                  style={{fontSize: 12, fontWeight: 600}}
                >添加选项</FTextBtn>

              </Space>

              <div style={{height: 20}}/>
              {
                storageObjectEditor.customOptionsData.length > 0 ? (<FCustomOptionsCards
                    dataSource={storageObjectEditor.customOptionsData.map((cod) => {
                      return {
                        theKey: cod.key,
                        description: cod.description,
                        type: cod.custom,
                        value: cod.custom === 'select' ? cod.customOption : cod.defaultValue,
                      }
                    })}
                    onDelete={(theKey) => {
                      dispatch<ChangeAction>({
                        type: 'storageObjectEditor/change',
                        payload: {
                          customOptionsData: storageObjectEditor.customOptionsData.filter((cod) => {
                            return cod.key !== theKey;
                          }),
                        },
                      })
                    }}
                    onEdit={(theKey) => {
                      const index: number = storageObjectEditor.customOptionsData.findIndex((cod) => {
                        return cod.key === theKey;
                      });
                      const customOption = storageObjectEditor.customOptionsData[index];
                      onChange({
                        customOptionIndex: index,
                        customOptionEditorData: customOption ? {
                          key: customOption.key,
                          keyError: '',
                          description: customOption.description,
                          descriptionError: '',
                          custom: customOption.custom,
                          defaultValue: customOption.defaultValue,
                          defaultValueError: '',
                          customOption: customOption.customOption,
                          customOptionError: '',
                        } : null,
                      });
                    }}
                  />)
                  : (<FContentText text={'暂无自定义选项…'} type="negative"/>)
              }
            </>)
          }

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
            placeholder={FUtil.I18n.message('hint_choose_resource_type')}
            options={FUtil.Predefined.resourceTypes.map((i: string) => ({value: i}))}
          />
        </FFormLayout.FBlock>
        <FFormLayout.FBlock title={'依赖'}>
          <Space size={10}>
            <FRectBtn
              type="default"
              onClick={() => setDepInfoVisible(true)}
            >添加依赖</FRectBtn>
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
        destroyOnClose
      >
        <SelectDeps/>
      </FDrawer>
    </div>

    <FBasePropsEditorDrawer
      visible={storageObjectEditor.basePropertiesEditorVisible}
      dataSource={storageObjectEditor.basePropertiesEditorData}
      disabledKeys={[
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.baseProperties.map<string>((bp) => bp.key),
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
          baseProperties: [
            ...storageObjectEditor.baseProperties,
            ...storageObjectEditor.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
              return {
                key: bped.key,
                value: bped.value,
                description: bped.description,
              };
            }),
          ],
        });
      }}
    />

    <FBasePropEditorDrawer
      usedKeys={[
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.baseProperties.filter((bp, ind) => ind !== storageObjectEditor.basePropertyEditorIndex).map((bp) => {
          return bp.key;
        }),
        ...storageObjectEditor.customOptionsData.map<string>((pp) => pp.key),
      ]}
      visible={storageObjectEditor.basePropertyEditorIndex > -1}
      keyInput={storageObjectEditor.basePropertyEditorData?.key || ''}
      keyInputError={storageObjectEditor.basePropertyEditorData?.keyError || ''}
      valueInput={storageObjectEditor.basePropertyEditorData?.value || ''}
      valueInputError={storageObjectEditor.basePropertyEditorData?.valueError || ''}
      descriptionInput={storageObjectEditor.basePropertyEditorData?.description || ''}
      descriptionInputError={storageObjectEditor.basePropertyEditorData?.descriptionError || ''}
      onCancel={() => {
        onChange({
          basePropertyEditorIndex: -1,
          basePropertyEditorData: null,
        });
      }}
      onConfirm={() => {
        onChange({
          baseProperties: storageObjectEditor.baseProperties.map((bp, ind) => {
            if (ind !== storageObjectEditor.basePropertyEditorIndex) {
              return bp;
            }
            return {
              key: storageObjectEditor.basePropertyEditorData?.key || '',
              value: storageObjectEditor.basePropertyEditorData?.value || '',
              description: storageObjectEditor.basePropertyEditorData?.description || '',
            };
          }),
          basePropertyEditorIndex: -1,
          basePropertyEditorData: null,
        });
      }}
      onKeyInputChange={(value) => {
        onChange({
          basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {
            ...storageObjectEditor.basePropertyEditorData,
            key: value.value,
            keyError: value.errorText,
          } : null,
        });
      }}
      onValueInputChange={(value) => {
        onChange({
          basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {
            ...storageObjectEditor.basePropertyEditorData,
            value: value.value,
            valueError: value.errorText,
          } : null,
        });
      }}
      onDescriptionInputChange={(value) => {
        onChange({
          basePropertyEditorData: storageObjectEditor.basePropertyEditorData ? {
            ...storageObjectEditor.basePropertyEditorData,
            description: value.value,
            descriptionError: value.errorText,
          } : null,
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

    <FCustomOptionEditorDrawer
      visible={storageObjectEditor.customOptionIndex !== -1}
      keyInput={storageObjectEditor.customOptionEditorData?.key || ''}
      keyInputError={storageObjectEditor.customOptionEditorData?.keyError || ''}
      descriptionInput={storageObjectEditor.customOptionEditorData?.description || ''}
      descriptionInputError={storageObjectEditor.customOptionEditorData?.descriptionError || ''}
      typeSelect={storageObjectEditor.customOptionEditorData?.custom || 'input'}
      valueInput={storageObjectEditor.customOptionEditorData?.defaultValue || ''}
      valueInputError={storageObjectEditor.customOptionEditorData?.defaultValueError || ''}
      optionsInput={storageObjectEditor.customOptionEditorData?.customOption || ''}
      optionsInputError={storageObjectEditor.customOptionEditorData?.customOptionError || ''}
      usedKeys={[
        ...storageObjectEditor.rawProperties.map<string>((rp) => rp.key),
        ...storageObjectEditor.baseProperties.map<string>((pp) => pp.key),
        ...storageObjectEditor.customOptionsData.filter((cod, ind) => {
          return ind !== storageObjectEditor.customOptionIndex;
        }).map((cod) => {
          return cod.key;
        }),
      ]}
      onCancel={() => {
        onChange({
          customOptionIndex: -1,
          customOptionEditorData: null,
        });
      }}
      onKeyInputChange={(value) => {
        onChange({
          customOptionEditorData: storageObjectEditor.customOptionEditorData ? {
            ...storageObjectEditor.customOptionEditorData,
            key: value.value,
            keyError: value.errorText,
          } : null,
        });
      }}
      onDescriptionInputChange={(value) => {
        onChange({
          customOptionEditorData: storageObjectEditor.customOptionEditorData ? {
            ...storageObjectEditor.customOptionEditorData,
            description: value.value,
            descriptionError: value.errorText,
          } : null,
        });
      }}
      onSelectChange={(value) => {
        onChange({
          customOptionEditorData: storageObjectEditor.customOptionEditorData ? {
            ...storageObjectEditor.customOptionEditorData,
            custom: value.value,
          } : null,
        });
      }}
      onValueInputChange={(value) => {
        onChange({
          customOptionEditorData: storageObjectEditor.customOptionEditorData ? {
            ...storageObjectEditor.customOptionEditorData,
            defaultValue: value.value,
            defaultValueError: value.errorText,
          } : null,
        });
      }}
      onOptionsInputChange={(value) => {
        onChange({
          customOptionEditorData: storageObjectEditor.customOptionEditorData ? {
            ...storageObjectEditor.customOptionEditorData,
            customOption: value.value,
            customOptionError: value.errorText,
          } : null,
        });
      }}
    />
  </FDrawer>);
}

export default connect(({storageObjectEditor}: ConnectState) => ({
  storageObjectEditor: storageObjectEditor,
}))(Details);
