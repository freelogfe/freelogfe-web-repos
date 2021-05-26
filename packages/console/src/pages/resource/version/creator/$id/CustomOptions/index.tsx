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
import {FContentText} from "@/components/FText";
import {ConnectState, StorageObjectEditorModelState} from "@/models/connect";
import FBasePropsEditorDrawer from "@/components/FBasePropsEditorDrawer";
import FCustomOptionsEditorDrawer from "@/components/FCustomOptionsEditorDrawer";
import FCustomOptionsCards from "@/components/FCustomOptionsCards";

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
                    customOptionsEditorDataSource: [{
                      key: '',
                      keyError: '',
                      description: '',
                      descriptionError: '',
                      custom: 'input',
                      customOption: '',
                      customOptionError: '',
                      defaultValue: '',
                      defaultValueError: '',
                    }],
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
              resourceVersionCreatorPage.customOptionsData.length > 0
                ? (<FCustomOptionsCards
                  dataSource={resourceVersionCreatorPage.customOptionsData.map((cod) => {
                    return {
                      theKey: cod.key,
                      description: cod.description,
                      type: cod.custom,
                      value: cod.custom === 'select' ? cod.customOption : cod.defaultValue,
                    };
                  })}
                  onDelete={(theKey) => {
                    onChange({
                      customOptionsData: resourceVersionCreatorPage.customOptionsData.filter((cod) => {
                        return cod.key !== theKey;
                      }),
                    });
                  }}
                />)
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
        onChange({
          customOptionsEditorVisible: false,
          customOptionsEditorDataSource: [],
        });
      }}
      dataSource={resourceVersionCreatorPage.customOptionsEditorDataSource}
      disabledKeys={[
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
      ]}
      onChange={(value) => {
        onChange({customOptionsEditorDataSource: value});
      }}
      onConfirm={() => {
        onChange({
          customOptionsData: [
            ...resourceVersionCreatorPage.customOptionsData,
            ...resourceVersionCreatorPage.customOptionsEditorDataSource.map<StorageObjectEditorModelState['customOptionsData'][number]>((coeds) => {
              return {
                key: coeds.key,
                defaultValue: coeds.defaultValue,
                description: coeds.description,
                custom: coeds.custom,
                customOption: coeds.customOption,
              };
            }),
          ],
          customOptionsEditorDataSource: [],
          customOptionsEditorVisible: false,
        });
      }}
    />
  </>);
}

export default connect(({resourceVersionCreatorPage}: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
