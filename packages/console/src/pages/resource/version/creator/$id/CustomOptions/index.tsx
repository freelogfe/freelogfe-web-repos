import * as React from 'react';
import styles from './index.less';
import {connect, Dispatch} from 'dva';
import FBaseProperties from "@/components/FBaseProperties";
import {Space} from "antd";
import {FTextBtn} from "@/components/FButton";
import {
  ChangeAction,
  ImportLastVersionDataAction,
  ResourceVersionCreatorPageModelState
} from "@/models/resourceVersionCreatorPage";
import FUp from "@/components/FIcons/FUp";
import {FDown, FInfo} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";
import FUtil from "@/utils";
import FCustomOptionsCard from "@/components/FCustomOptionsCard";
import {FContentText} from "@/components/FText";
import {ConnectState, StorageObjectEditorModelState} from "@/models/connect";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FCustomOptionsEditorDrawer from "@/components/FCustomOptionsEditorDrawer";

interface CustomOptionsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function CustomOptions({dispatch, resourceVersionCreatorPage}: CustomOptionsProps) {


  async function onChange(payload: ChangeAction['payload']) {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
      caller: '2345324343452==0-=-=-4534%#$%#$%#$%#$#$',
    });
  }

  return (<>
    {
      resourceVersionCreatorPage.selectedFileStatus === -3 && (<>
        <div style={{height: 5}}/>
        <FBaseProperties
          basics={resourceVersionCreatorPage.rawProperties}
          additions={resourceVersionCreatorPage.baseProperties}
          onChangeAdditions={(value) => {
            onChange({
              baseProperties: value,
              dataIsDirty: true,
            });
          }}
          rightTop={<Space size={20}>
            <FTextBtn
              type="primary"
              onClick={() => {
                onChange({
                  basePropertiesEditorVisible: true,
                  basePropertiesEditorData: resourceVersionCreatorPage.baseProperties.map((bp) => {
                    return {
                      ...bp,
                      keyError: '',
                      valueError: '',
                      descriptionError: '',
                    };
                  }),
                });
              }}
            >补充属性</FTextBtn>
            {
              resourceVersionCreatorPage.preVersionBaseProperties.length > 0
                ? (<FTextBtn
                  type="primary"
                  onClick={() => {
                    dispatch<ImportLastVersionDataAction>({
                      type: 'resourceVersionCreatorPage/importLastVersionData',
                      payload: 'baseProps',
                    });
                    onChange({dataIsDirty: true})
                  }}
                >从上个版本导入</FTextBtn>)
                : undefined
            }
          </Space>}
        />

        <div style={{height: 20}}/>

        <Space size={5}>
          <FTextBtn
            type="default"
            onClick={() => {
              onChange({
                customOptionsDataVisible: !resourceVersionCreatorPage.customOptionsDataVisible,
              });
            }}
          >
            <span>自定义选项（高级）</span>
            {resourceVersionCreatorPage.customOptionsDataVisible ? (<FUp/>) : (<FDown/>)}
          </FTextBtn>
          <FTooltip title={FUtil.I18n.message('info_versionoptions')}>
            <div><FInfo/></div>
          </FTooltip>
        </Space>

        {
          resourceVersionCreatorPage.customOptionsDataVisible && (<>

            <div style={{height: 20}}/>

            <Space size={40}>
              <FTextBtn
                onClick={() => {
                  onChange({
                    customOptionsEditorDataSource: resourceVersionCreatorPage.customOptionsData.map<ResourceVersionCreatorPageModelState['customOptionsEditorDataSource'][number]>((cod) => {
                      return {
                        key: cod.key,
                        keyError: '',
                        description: cod.description,
                        descriptionError: '',
                        custom: cod.custom,
                        customOption: cod.customOption,
                        customOptionError: '',
                        defaultValue: cod.defaultValue,
                        defaultValueError: '',
                      };
                    }),
                    customOptionsEditorVisible: true,
                  });
                }}
              >添加选项</FTextBtn>
              {
                resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FTextBtn
                  onClick={() => {
                    dispatch<ImportLastVersionDataAction>({
                      type: 'resourceVersionCreatorPage/importLastVersionData',
                      payload: 'optionProps',
                    });
                    onChange({dataIsDirty: true,});
                  }}>从上个版本导入</FTextBtn>)
              }

            </Space>

            <div style={{height: 20}}/>

            {
              resourceVersionCreatorPage.customOptionsData.length > 0 ? (
                  <FCustomOptionsCard
                    dataSource={resourceVersionCreatorPage.customOptionsData.map((cod) => {
                      return {
                        key: cod.key,
                        type: cod.custom === 'input' ? '输入框' : '选择框',
                        description: cod.description,
                        value: cod.custom === 'input' ? cod.defaultValue : cod.customOption,
                      };
                    })}
                    onDeleteKey={(value) => {
                      dispatch<ChangeAction>({
                        type: 'resourceVersionCreatorPage/change',
                        payload: {
                          customOptionsData: resourceVersionCreatorPage.customOptionsData.filter((cod) => {
                            return cod.key !== value;
                          }),
                        },
                        caller: '23453243434523432453___(*)(*)(*4%#$%#$%#$%#$#$',
                      })
                    }}
                  />
                )
                : (<FContentText text={'暂无自定义选项…'} type="negative"/>)
            }

          </>)
        }

      </>)
    }

    <FBasePropsEditorDrawer
      visible={resourceVersionCreatorPage.basePropertiesEditorVisible}
      dataSource={resourceVersionCreatorPage.basePropertiesEditorData}
      disabledKeys={[
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
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
          baseProperties: resourceVersionCreatorPage.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
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
      visible={resourceVersionCreatorPage.customOptionsEditorVisible}
      onCancel={() => {
        dispatch<ChangeAction>({
          type: 'resourceVersionCreatorPage/change',
          payload: {
            customOptionsEditorVisible: false,
            customOptionsEditorDataSource: [],
          },
          caller: '234532&*^*(&^*(&^*(&434345234324534%#$%#$%#$%#$#$',
        });
      }}
      dataSource={resourceVersionCreatorPage.customOptionsEditorDataSource}
      disabledKeys={[
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
      ]}
      onChange={(value) => {
        dispatch<ChangeAction>({
          type: 'resourceVersionCreatorPage/change',
          payload: {customOptionsEditorDataSource: value},
          caller: '23453243434523432hjkjsdhfkjhajsdf4534%#$%#$%#$%#$#$',
        });
      }}
      onConfirm={() => {
        dispatch<ChangeAction>({
          type: 'resourceVersionCreatorPage/change',
          payload: {
            customOptionsData: resourceVersionCreatorPage.customOptionsEditorDataSource.map<StorageObjectEditorModelState['customOptionsData'][number]>((coeds) => {
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
          },
          caller: '23453[]p[pop[iooiiop2434345234324534%#$%#$%#$%#$#$',
        })
      }}
    />
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
