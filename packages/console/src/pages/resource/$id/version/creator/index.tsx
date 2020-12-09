import * as React from 'react';
import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FCircleButton, FNormalButton, FTextButton} from '@/components/FButton';
import {Space, Row, Col} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/components/FCustomProperties';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction, ChangeVersionInputAction,
  CreateVersionAction, FetchDraftAction,
  SaveDraftAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {withRouter} from 'umi';
import {i18nMessage} from '@/utils/i18n';
import RouterTypes from 'umi/routerTypes';
import {CloseCircleFilled} from '@ant-design/icons';
import {FClose, FCopy, FInfo} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";
import FBaseProperties from "@/components/FBaseProperties";

interface VersionCreatorProps {
  dispatch: Dispatch;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState,
  resourceInfo: ResourceInfoModelState,
  match: {
    params: {
      id: string;
    };
  };
}

function VersionCreator({dispatch, route, resourceVersionCreatorPage, match, resourceInfo}: VersionCreatorProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

  React.useEffect(() => {
    // console.log(match, 'creator902jfsadlk');
    init();
  }, [match.params.id]);

  async function init() {
    await dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload: {
        resourceId: match.params.id,
      }
    });
    await dispatch<FetchDraftAction>({
      type: 'resourceVersionCreatorPage/fetchDraft',
    });
  }

  function onClickCache() {
    dispatch<SaveDraftAction>({
      type: 'resourceVersionCreatorPage/saveDraft',
    });
  }

  function onClickCreate() {
    dispatch<CreateVersionAction>({
      type: 'resourceVersionCreatorPage/createVersion',
      payload: match.params.id,
    });
  }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceVersionCreatorPage/change',
      payload,
    });
  }

  const hasError: boolean =
    // 版本
    !resourceVersionCreatorPage.version || !!resourceVersionCreatorPage.versionErrorText
    // 对象
    || !resourceVersionCreatorPage.resourceObject || !!resourceVersionCreatorPage.resourceObjectErrorText
    // 依赖
    || !!resourceVersionCreatorPage.dependencies.find((dd) => {
      return !dd.enableReuseContracts.find((erc) => erc.checked) && !dd.enabledPolicies.find((ep) => ep.checked);
    })
    // 自定义属性
    || !!resourceVersionCreatorPage.properties.find((ep) => {
      return ep.key === '' || !!ep.keyError
        || ep.value === '' || !!ep.valueError
        || !!ep.descriptionError
        || (ep.allowCustom && ep.custom === 'select' && (ep.customOption === '' || !!ep.customOptionError))
    });

  return (<FInfoLayout>
    <FContentLayout header={<Header
      onClickCreate={onClickCreate}
      onClickCache={onClickCache}
      disabledCreate={hasError}
    />}>
      <div className={styles.wrap}>
        <FEditorCard dot={true} title={i18nMessage('version_number')}>
          <FInput
            value={resourceVersionCreatorPage.version}
            onChange={(e) => {
              dispatch<ChangeVersionInputAction>({
                type: 'resourceVersionCreatorPage/changeVersionInputAction',
                payload: e.target.value,
              });
            }}
            className={styles.versionInput}
            errorText={resourceVersionCreatorPage.versionErrorText}
          />
        </FEditorCard>

        <FEditorCard dot={true} title={i18nMessage('release_object')}>
          <FSelectObject
            resourceType={resourceInfo.info?.resourceType || ''}
            resourceObject={resourceVersionCreatorPage.resourceObject}
            onChange={(value, deps) => {
              onChange({resourceObject: value, resourceObjectErrorText: ''});
              if (!deps || deps.length === 0) {
                return;
              }
              // dispatch<ObjectAddDepsAction>({
              //   type: 'resourceVersionCreatorPage/objectAddDeps',
              //   payload: deps,
              // });
            }}
            errorText={resourceVersionCreatorPage.resourceObjectErrorText}
            onChangeErrorText={(text) => onChange({resourceObjectErrorText: text})}
          />
          <div style={{height: 5}}/>
          <FBaseProperties basics={[]} additions={[]} disabledKeys={[]}/>
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('rely')}>
          <FDepPanel/>
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('object_property')}>
          <Space size={80}>
            <Space size={10}>
              <FCircleButton
                // onClick={() => setModalVisible(true)}
                theme="weaken"
                onClick={() => {
                  dispatch<ChangeAction>({
                    type: 'resourceVersionCreatorPage/change',
                    payload: {
                      properties: [
                        ...resourceVersionCreatorPage.properties,
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
              <FContentText text={i18nMessage('create_property')}/>
            </Space>
            <Space size={10}>
              <FCircleButton
                theme="weaken"
                icon={<FCopy/>}
              />
              <FContentText text={i18nMessage('import_from_previous_version')}/>
            </Space>
          </Space>

          <div style={{height: 30}}/>

          <FCustomProperties
            dataSource={resourceVersionCreatorPage.properties}
            onChange={(value) => onChange({properties: value})}
          />
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('version_description')}>
          <FBraftEditor
            value={resourceVersionCreatorPage.description}
            onChange={(value) => onChange({description: value})}
          />
        </FEditorCard>
      </div>
    </FContentLayout>
  </FInfoLayout>);
}

interface HeaderProps {
  onClickCache: () => void;
  onClickCreate: () => void;
  disabledCreate?: boolean;
}

function Header({onClickCache, onClickCreate, disabledCreate = false}: HeaderProps) {
  return (<div className={styles.Header}>
    <FTitleText text={i18nMessage('create_new_version')} type={'h2'}/>

    <Space size={30}>
      <FTextButton onClick={onClickCache}>{i18nMessage('save_as_draft')}</FTextButton>
      <FNormalButton
        style={{width: 108}}
        onClick={onClickCreate}
        disabled={disabledCreate}
      >{i18nMessage('release_to_market')}</FNormalButton>
    </Space>
  </div>);
}

export default withRouter(connect(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
  resourceVersionCreatorPage: resourceVersionCreatorPage,
  resourceInfo: resourceInfo,
}))(VersionCreator));
