import * as React from 'react';
import styles from './index.less';
import { FTitleText, FContentText } from '@/components/FText';
import FInput from '@/components/FInput';
import { FRectBtn } from '@/components/FButton';
import FLabelEditor from '@/pages/resource/components/FLabelEditor';
import FUploadResourceCover from '@/pages/resource/components/FUploadResourceCover';
import FIntroductionEditor from '@/pages/resource/components/FIntroductionEditor';
import FContentLayout from '@/layouts/FContentLayout';
import { Space } from 'antd';
import { connect, Dispatch } from 'dva';
import { ConnectState, ResourceCreatorPageModelState, UserModelState } from '@/models/connect';
import {
  OnCreateAction,
  ChangeAction,
  OnChangeNameAction,
  OnChangeResourceTypeAction,
  ClearDataAction, OnMount_Page_Action, OnUnmount_Page_Action,
} from '@/models/resourceCreatorPage';
import FAutoComplete from '@/components/FAutoComplete';
import { router, RouterTypes } from 'umi';
import { FCheck, FInfo, FLoading } from '@/components/FIcons';
import FFormLayout from '@/components/FFormLayout';
import * as H from 'history';
import Prompt from 'umi/prompt';
import fConfirmModal from '@/components/fConfirmModal';
import FUtil1 from '@/utils';
import { FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';
import FDropdown from '@/components/FDropdown';
import categoryData from '@/utils/category';
import { DownOutlined } from '@ant-design/icons';
import FMenu from '@/components/FMenu';

interface ResourceCreatorProps {
  dispatch: Dispatch;
  resourceCreatorPage: ResourceCreatorPageModelState;
  user: UserModelState;
}

function ResourceCreator({
  dispatch,
  route,
  resourceCreatorPage,
  user,
}: ResourceCreatorProps & RouterTypes) {
  const [category, setCategory] = React.useState<any>({
    first: -1,
    second: '',
  });

  AHooks.useMount(() => {
    dispatch<OnMount_Page_Action>({
      type: 'resourceCreatorPage/onMount_Page',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnUnmount_Page_Action>({
      type: 'resourceCreatorPage/onUnmount_Page',
    });
  });
  React.useEffect(() => {
    return () => {
      dispatch<ClearDataAction>({
        type: 'resourceCreatorPage/clearData',
      });
      window.onbeforeunload = null;
    };
  }, []);

  React.useEffect(() => {
    // const func = () => 1234;
    if (
      resourceCreatorPage.name !== '' ||
      resourceCreatorPage.resourceType !== '' ||
      resourceCreatorPage.introduction !== '' ||
      resourceCreatorPage.cover !== '' ||
      resourceCreatorPage.labels.length !== 0
    ) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
  }, [
    resourceCreatorPage.name,
    resourceCreatorPage.resourceType,
    resourceCreatorPage.introduction,
    resourceCreatorPage.cover,
    resourceCreatorPage.labels,
  ]);

  function onClickCreate() {
    // console.log('onClickCreate', '0932jdlfsf');
    dispatch<OnCreateAction>({
      type: 'resourceCreatorPage/create',
    });
  }

  function onChange(payload: ChangeAction['payload']) {
    dispatch<ChangeAction>({
      type: 'resourceCreatorPage/change',
      payload,
    });
  }

  return (
    <>
      <Prompt
        when={
          resourceCreatorPage.promptLeavePath === '' &&
          (resourceCreatorPage.name !== '' ||
            resourceCreatorPage.resourceType !== '' ||
            resourceCreatorPage.introduction !== '' ||
            resourceCreatorPage.cover !== '' ||
            resourceCreatorPage.labels.length !== 0)
        }
        message={(location: H.Location, action: H.Action) => {
          // console.log(location, action, 'LAAAAL');
          // return window.confirm('还没有创建资源，现在离开会导致信息丢失');
          if (location.pathname === FUtil.LinkTo.resourceCreator()) {
            return true;
          }
          dispatch<ChangeAction>({
            type: 'resourceCreatorPage/change',
            payload: {
              promptLeavePath: location.pathname + location.search,
            },
          });
          fConfirmModal({
            message: '还没有创建资源，现在离开会导致信息丢失',
            onOk() {
              // console.log('OK');
              router.push(location.pathname + location.search);
            },
            onCancel() {
              // console.log('Cancel');
              dispatch<ChangeAction>({
                type: 'resourceCreatorPage/change',
                payload: {
                  promptLeavePath: '',
                },
              });
            },
          });
          return false;
        }}
      />
      <FContentLayout
        header={
          <Header
            disabled={
              resourceCreatorPage.nameVerify !== 2 ||
              resourceCreatorPage.resourceTypeVerify !== 2 ||
              !!resourceCreatorPage.nameErrorText ||
              !!resourceCreatorPage.resourceTypeErrorText ||
              !!resourceCreatorPage.introductionErrorText
            }
            onClickCreate={onClickCreate}
          />
        }
      >
        <FFormLayout>
          <FFormLayout.FBlock title={FUtil1.I18n.message('resource_name')} asterisk={true}>
            <div className={styles.resourceName}>
              <FContentText text={`${user.info?.username} /`} />
              &nbsp;
              <FInput
                errorText={resourceCreatorPage.nameErrorText}
                value={resourceCreatorPage.name}
                onChange={(e) => {}}
                debounce={300}
                onDebounceChange={(value) => {
                  onChange({
                    name: value,
                  });
                  // console.log(value, value.length, '!@#$!@#$!!!!!!');
                  dispatch<OnChangeNameAction>({
                    type: 'resourceCreatorPage/onChangeName',
                    payload: value,
                  });
                }}
                className={styles.FInput}
                placeholder={FUtil1.I18n.message('hint_enter_resource_name')}
                lengthLimit={60}
              />
              <div style={{ width: 10 }} />
              {resourceCreatorPage.nameVerify === 1 && <FLoading />}
              {resourceCreatorPage.nameVerify === 2 && !resourceCreatorPage.nameErrorText && (
                <FCheck />
              )}
            </div>
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FUtil1.I18n.message('resource_type')} asterisk={true}>
            <FDropdown
              className='h-38 flex-column justify-center'
              overlay={
                <FMenu
                  options={[
                    {
                      value: '-1',
                      text: '请选择大类',
                    },
                    ...categoryData.first.map((i, index) => {
                      return {
                        value: index + '',
                        text: i,
                      };
                    }),
                  ]}
                  value={category.first}
                  onClick={(value) => {
                    setCategory({
                      ...category,
                      first: value,
                      second: '',
                    });
                    //onChangeResourceType && onChangeResourceType(value)
                  }}
                />
              }
            >
              <span style={{ cursor: 'pointer' }} className='h-38 flex-row align-center'>
                {categoryData.first[category.first] || '请选择大类'}
                <DownOutlined style={{ marginLeft: 8 }} />
              </span>
            </FDropdown>

            {category.first > 1 ? (
              <>
                <span className="ml-30">子类型：</span>
                <FAutoComplete
                  errorText={resourceCreatorPage.resourceTypeErrorText}
                  value={
                    // @ts-ignore
                    categoryData.second[category.first][category.second] || category.second
                  }
                  onChange={
                    (value) => {
                      setCategory({
                        ...category,
                        second: value,
                      });
                    }
                    // dispatch<OnChangeResourceTypeAction>({
                    //   type: 'resourceCreatorPage/onChangeResourceType',
                    //   payload: value,
                    // })
                  }
                  className={styles.FSelect}
                  placeholder={FUtil1.I18n.message('hint_choose_resource_type')}
                  options={[
                    // @ts-ignore
                    ...categoryData.second[category.first].map((i, index) => {
                      return {
                        value: index + '',
                        label: i,
                      };
                    }),
                  ]}
                />
              </>
            ) : null}
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FUtil1.I18n.message('resource_short_description')}>
            <FIntroductionEditor
              value={resourceCreatorPage.introduction}
              onChange={(e) =>
                onChange({
                  introductionErrorText: e.target.value.length > 1000 ? '不多于1000个字符' : '',
                  introduction: e.target.value,
                })
              }
              placeholder={FUtil1.I18n.message('hint_enter_resource_short_description')}
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FUtil1.I18n.message('resource_image')}>
            <FUploadResourceCover
              value={resourceCreatorPage.cover}
              onChange={(value) =>
                onChange({
                  cover: value,
                })
              }
            />
          </FFormLayout.FBlock>

          <FFormLayout.FBlock title={FUtil1.I18n.message('resource_tag')}>
            <FLabelEditor
              values={resourceCreatorPage.labels}
              onChange={(value) =>
                onChange({
                  labels: value,
                })
              }
            />
          </FFormLayout.FBlock>
        </FFormLayout>
      </FContentLayout>
    </>
  );
}

interface HeaderProps {
  onClickCreate: () => void;
  disabled?: boolean;
}

function Header({ onClickCreate, disabled = false }: HeaderProps) {
  return (
    <div className={styles.Header}>
      <FTitleText
        // text={FUtil.I18n.message('create_resource')}
        text={'创建资源'}
        type="h1"
      />

      <Space size={30}>
        <FRectBtn disabled={disabled} onClick={onClickCreate}>
          {FUtil1.I18n.message('create')}
        </FRectBtn>
      </Space>
    </div>
  );
}

export default connect(({ resourceCreatorPage, user }: ConnectState) => ({
  resourceCreatorPage: resourceCreatorPage,
  user: user,
}))(ResourceCreator);
