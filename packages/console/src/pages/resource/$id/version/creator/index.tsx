import * as React from 'react';
import styles from './index.less';
import FInfoLayout from '@/pages/resource/layouts/FInfoLayout';
import FContentLayout from '@/pages/resource/layouts/FContentLayout';
import {FContentText, FTitleText} from '@/components/FText';
import FEditorCard from '@/components/FEditorCard';
import FInput from '@/components/FInput';
import FBraftEditor from '@/components/FBraftEditor';
import {FCircleButton, FNormalButton, FTextButton} from '@/components/FButton';
import {Space} from 'antd';
import FSelectObject from '@/pages/resource/components/FSelectObject';
import FCustomProperties from '@/components/FCustomProperties';
import FDepPanel from '@/pages/resource/containers/FDepPanel';
import {connect, Dispatch} from "dva";
import {ConnectState, ResourceInfoModelState, ResourceVersionCreatorPageModelState} from '@/models/connect';
import {
  ChangeAction,
  // ChangeVersionInputAction,
  CreateVersionAction,
  // ImportPreVersionAction, ObjectAddDepsAction,
  SaveDraftAction,
} from '@/models/resourceVersionCreatorPage';
import {ChangeAction as GlobalChangeAction} from '@/models/global';
import {withRouter} from 'umi';
import {i18nMessage} from '@/utils/i18n';
import RouterTypes from 'umi/routerTypes';
import {CopyOutlined} from '@ant-design/icons';
import {FCopy} from "@/components/FIcons";

interface VersionCreatorProps {
  dispatch: Dispatch;
  version: ResourceVersionCreatorPageModelState,
  resource: ResourceInfoModelState,
  match: {
    params: {
      id: string;
    };
  };
}

function VersionCreator({dispatch, route, version, match, resource}: VersionCreatorProps & RouterTypes) {

  React.useEffect(() => {
    dispatch<GlobalChangeAction>({
      type: 'global/change',
      payload: {
        route: route,
      },
    });
  }, [route]);

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

  const hasError: boolean = !version.version || !!version.versionErrorText
    || !version.resourceObject || !!version.resourceObjectErrorText
    || !!version.properties.find((ep) => {
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
            value={version.version}
            onChange={(e) => {
              // dispatch<ChangeVersionInputAction>({
              //   type: 'resourceVersionCreatorPage/changeVersionInputAction',
              //   payload: e.target.value,
              // });
            }}
            className={styles.versionInput}
            errorText={version.versionErrorText}
          />
        </FEditorCard>

        <FEditorCard dot={true} title={i18nMessage('release_object')}>
          <FSelectObject
            resourceType={resource.info?.resourceType || ''}
            resourceObject={version.resourceObject}
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
            errorText={version.resourceObjectErrorText}
            onChangeErrorText={(text) => onChange({resourceObjectErrorText: text})}
          />
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
                        ...version.properties,
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
            dataSource={version.properties}
            onChange={(value) => onChange({properties: value})}
          />
        </FEditorCard>

        <FEditorCard dot={false} title={i18nMessage('version_description')}>
          <FBraftEditor
            value={version.description}
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
  version: resourceVersionCreatorPage,
  resource: resourceInfo,
}))(VersionCreator));
