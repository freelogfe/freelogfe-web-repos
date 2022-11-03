import * as React from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import FBaseProperties from '@/components/FBaseProperties';
import { Space } from 'antd';
import {
  ChangeAction,
  ImportLastVersionDataAction,
  ResourceVersionCreatorPageModelState,
} from '@/models/resourceVersionCreatorPage';
import FTooltip from '@/components/FTooltip';
import {
  ConnectState,
} from '@/models/connect';
import FBasePropsEditorDrawer from '@/components/FBasePropsEditorDrawer';
import FCustomOptionsEditorDrawer from '@/components/FCustomOptionsEditorDrawer';
import FCustomOptionsCards from '@/components/FCustomOptionsCards';
import FBasePropEditorDrawer from '@/components/FBasePropEditorDrawer';
import FCustomOptionEditorDrawer from '@/components/FCustomOptionEditorDrawer';
import { FI18n } from '@freelog/tools-lib';
import FLoadingTip from '@/components/FLoadingTip';
import FComponentsLib from '@freelog/components-lib';

interface CustomOptionsProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
}

function CustomOptions({ dispatch, resourceVersionCreatorPage }: CustomOptionsProps) {


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
        <div style={{ height: 5 }} />
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
            <FComponentsLib.FTextBtn
              style={{ fontSize: 12, fontWeight: 600 }}
              type='primary'
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
            >补充属性</FComponentsLib.FTextBtn>
            {
              resourceVersionCreatorPage.preVersionBaseProperties.length > 0
                ? (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600 }}
                  type='primary'
                  onClick={() => {
                    dispatch<ImportLastVersionDataAction>({
                      type: 'resourceVersionCreatorPage/importLastVersionData',
                      payload: 'baseProps',
                    });
                    onChange({ dataIsDirty: true });
                  }}
                >从上个版本导入</FComponentsLib.FTextBtn>)
                : undefined
            }
          </Space>}
          onClickEdit={(theKey) => {
            const ind = resourceVersionCreatorPage.baseProperties.findIndex((bp) => {
              return bp.key === theKey;
            });
            const cur = resourceVersionCreatorPage.baseProperties[ind];
            onChange({
              basePropertyEditorIndex: ind,
              basePropertyEditorData: ind === -1
                ? null
                : {
                  key: cur.key,
                  keyError: '',
                  value: cur.value,
                  valueError: '',
                  description: cur.description,
                  descriptionError: '',
                },
            });
          }}
        />
        {
          resourceVersionCreatorPage.rawPropertiesState !== 'success' && (<div style={{ backgroundColor: '#F7F8F9' }}>
            <FLoadingTip height={100} />
          </div>)
        }


        <div style={{ height: 20 }} />

        <Space size={5}>
          <FComponentsLib.FTextBtn
            style={{ fontSize: 12, fontWeight: 600 }}
            type='default'
            onClick={() => {
              onChange({
                customOptionsDataVisible: !resourceVersionCreatorPage.customOptionsDataVisible,
              });
            }}
          >
            <span>自定义选项（高级）</span>
            {resourceVersionCreatorPage.customOptionsDataVisible ? (<FComponentsLib.FIcons.FUp />) : (<FComponentsLib.FIcons.FDown />)}
          </FComponentsLib.FTextBtn>
          <FTooltip title={FI18n.i18nNext.t('info_versionoptions')}>
            <div><FComponentsLib.FIcons.FInfo /></div>
          </FTooltip>
        </Space>

        {
          resourceVersionCreatorPage.customOptionsDataVisible && (<>

            <div style={{ height: 20 }} />

            <Space size={40}>
              <FComponentsLib.FTextBtn
                style={{ fontSize: 12, fontWeight: 600 }}
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
              >添加选项</FComponentsLib.FTextBtn>
              {
                resourceVersionCreatorPage.preVersionOptionProperties.length > 0 && (<FComponentsLib.FTextBtn
                  style={{ fontSize: 12, fontWeight: 600 }}
                  onClick={() => {
                    dispatch<ImportLastVersionDataAction>({
                      type: 'resourceVersionCreatorPage/importLastVersionData',
                      payload: 'optionProps',
                    });
                    onChange({ dataIsDirty: true });
                  }}>从上个版本导入</FComponentsLib.FTextBtn>)
              }

            </Space>

            <div style={{ height: 20 }} />

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
                  onEdit={(theKey) => {
                    const ind: number = resourceVersionCreatorPage.customOptionsData.findIndex((cod) => {
                      return cod.key === theKey;
                    });
                    const cur = resourceVersionCreatorPage.customOptionsData[ind];
                    onChange({
                      customOptionIndex: ind,
                      customOptionEditorData: ind === -1
                        ? null
                        : {
                          key: cur.key,
                          keyError: '',
                          description: cur.description,
                          descriptionError: '',
                          custom: cur.custom,
                          defaultValue: cur.defaultValue,
                          defaultValueError: '',
                          customOption: cur.customOption,
                          customOptionError: '',
                        },
                    });
                  }}
                />)
                : (<FComponentsLib.FContentText text={'暂无自定义选项…'} type='negative' />)
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
        ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
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
          baseProperties: [
            ...resourceVersionCreatorPage.baseProperties,
            ...resourceVersionCreatorPage.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
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
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.filter((bp, ind) => ind !== resourceVersionCreatorPage.basePropertyEditorIndex).map((bp) => {
          return bp.key;
        }),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
      ]}
      visible={resourceVersionCreatorPage.basePropertyEditorIndex > -1}
      keyInput={resourceVersionCreatorPage.basePropertyEditorData?.key || ''}
      keyInputError={resourceVersionCreatorPage.basePropertyEditorData?.keyError || ''}
      valueInput={resourceVersionCreatorPage.basePropertyEditorData?.value || ''}
      valueInputError={resourceVersionCreatorPage.basePropertyEditorData?.valueError || ''}
      descriptionInput={resourceVersionCreatorPage.basePropertyEditorData?.description || ''}
      descriptionInputError={resourceVersionCreatorPage.basePropertyEditorData?.descriptionError || ''}
      onCancel={() => {
        onChange({
          basePropertyEditorIndex: -1,
          basePropertyEditorData: null,
        });
      }}
      onConfirm={() => {
        onChange({
          baseProperties: resourceVersionCreatorPage.baseProperties.map((bp, ind) => {
            if (ind !== resourceVersionCreatorPage.basePropertyEditorIndex) {
              return bp;
            }
            return {
              key: resourceVersionCreatorPage.basePropertyEditorData?.key || '',
              value: resourceVersionCreatorPage.basePropertyEditorData?.value || '',
              description: resourceVersionCreatorPage.basePropertyEditorData?.description || '',
            };
          }),
          basePropertyEditorIndex: -1,
          basePropertyEditorData: null,
        });
      }}
      onKeyInputChange={(value) => {
        onChange({
          basePropertyEditorData: resourceVersionCreatorPage.basePropertyEditorData ? {
            ...resourceVersionCreatorPage.basePropertyEditorData,
            key: value.value,
            keyError: value.errorText,
          } : null,
        });
      }}
      onValueInputChange={(value) => {
        onChange({
          basePropertyEditorData: resourceVersionCreatorPage.basePropertyEditorData ? {
            ...resourceVersionCreatorPage.basePropertyEditorData,
            value: value.value,
            valueError: value.errorText,
          } : null,
        });
      }}
      onDescriptionInputChange={(value) => {
        onChange({
          basePropertyEditorData: resourceVersionCreatorPage.basePropertyEditorData ? {
            ...resourceVersionCreatorPage.basePropertyEditorData,
            description: value.value,
            descriptionError: value.errorText,
          } : null,
        });
      }}
    />

    <FCustomOptionsEditorDrawer
      visible={resourceVersionCreatorPage.customOptionsEditorVisible}
      defaultValue={resourceVersionCreatorPage.customOptionsEditorDataSource}
      onCancel={() => {
        onChange({
          customOptionsEditorVisible: false,
          customOptionsEditorDataSource: [],
        });
      }}
      disabledKeys={[
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
        ...resourceVersionCreatorPage.customOptionsData.map<string>((cod) => cod.key),
      ]}
      onConfirm={(value) => {
        onChange({
          customOptionsData: [
            ...resourceVersionCreatorPage.customOptionsData,
            ...value,
          ],
          customOptionsEditorVisible: false,
        });
      }}
    />

    <FCustomOptionEditorDrawer
      visible={resourceVersionCreatorPage.customOptionIndex !== -1}
      dataSource={{
        key: resourceVersionCreatorPage.customOptionEditorData?.key || '',
        description: resourceVersionCreatorPage.customOptionEditorData?.description || '',
        value: (resourceVersionCreatorPage.customOptionEditorData?.custom === 'input' ? resourceVersionCreatorPage.customOptionEditorData?.defaultValue : resourceVersionCreatorPage.customOptionEditorData?.customOption) || '',
        valueType: resourceVersionCreatorPage.customOptionEditorData?.custom || 'input',
      }}
      disabledKeys={[
        ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
        ...resourceVersionCreatorPage.baseProperties.map<string>((pp) => pp.key),
        ...resourceVersionCreatorPage.customOptionsData.filter((cod, ind) => {
          return ind !== resourceVersionCreatorPage.customOptionIndex;
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
      onConfirm={(value) => {
        onChange({
          customOptionsData: resourceVersionCreatorPage.customOptionsData.map((cod, ind) => {
            if (ind !== resourceVersionCreatorPage.customOptionIndex) {
              return cod;
            }
            return {
              key: value.key,
              description: value.description,
              custom: value.valueType,
              defaultValue: value.value,
              customOption: value.value,
            };
          }),
          customOptionIndex: -1,
          customOptionEditorData: null,
        });
      }}
    />
  </>);
}

export default connect(({ resourceVersionCreatorPage }: ConnectState) => ({
  resourceVersionCreatorPage,
}))(CustomOptions);
