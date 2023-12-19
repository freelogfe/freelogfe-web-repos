import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import { ColumnsType } from 'antd/lib/table/interface';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { Checkbox, Popconfirm, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import {
  OnChange_Exhibits_StatusSwitch_Action,
  OnClick_Exhibits_DeleteBtn_Action,
} from '@/models/informalNodeManagerPage';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import FCoverImage from '@/components/FCoverImage';
import fConfirmModal from '@/components/fConfirmModal';
import { LoadingOutlined, MinusOutlined } from '@ant-design/icons';
import { FDialog } from '@/components/FDialog';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

interface ExhibitTableProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function ExhibitTable({ dispatch, informalNodeManagerPage }: ExhibitTableProps) {
  let [operateExhibit, setOperateExhibit] = React.useState<any>(null);
  const [inactiveDialogShow, setInactiveDialogShow] = React.useState(false);
  const [resultPopupType, setResultPopupType] = React.useState<null | boolean>(null);
  const [loading, setLoading] = React.useState(false);
  const [noLonger, setNoLonger] = React.useState(false);

  const columns: ColumnsType<InformalNodeManagerPageModelState['exhibit_List'][number]> = [
    {
      title: <FComponentsLib.FTitleText type='table' text={'来源｜封面'} />,
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render(text, record) {
        return (<div className={styles.cover}>
            <FCoverImage
              src={record.stateInfo.coverInfo.coverImages[0] || ''}
              width={120}
              style={{ borderRadius: 4 }}
            />
            <div className={styles.Identity}>
              <FIdentityTypeBadge
                status={record.associatedPresentableId === '' ? record.originInfo.type : 'exhibit'}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: <FComponentsLib.FTitleText type='table' text={'测试展品名称｜类型｜测试展品标题｜映射规则'} />,
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (<div className={styles.name}>
          <FComponentsLib.FContentText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={record.testResourceName}
            type='highlight'
            singleRow
          />
          <div className={styles.type}>
            <label>{FUtil.Format.resourceTypeKeyArrToResourceType(record.originInfo.resourceType)}</label>
            <div>
              <FComponentsLib.FContentText
                type='additional2'
                text={record.stateInfo.titleInfo.title}
                singleRow
              />
            </div>
          </div>
          <div style={{ maxWidth: 500, overflow: 'hidden' }}>
            <MappingRule operationAndActionRecords={record.operationAndActionRecords} />
          </div>
        </div>);
      },
    },
    {
      title: <FComponentsLib.FTitleText type='table' text={''} />,
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render(text: any, record) {
        return (
          <div style={{ width: 110 }} className={styles.hoverVisible}>
            <Actions
              onEdit={() => {
                window.open(
                  FUtil.LinkTo.informExhibitManagement({ exhibitID: record.testResourceId }),
                );
              }}
              onSearch={async () => {
                // console.log(record, 'record0ojlakfsdfj09ewalkfsjdl');
                if (record.originInfo.type === 'resource') {
                  return window.open(
                    FUtil.LinkTo.resourceDetails({ resourceID: record.originInfo.id }),
                  );
                }

                const { data } = await FServiceAPI.Storage.objectDetails({
                  objectIdOrName: record.originInfo.id,
                });

                // console.log(data, '!@!#$!@#$@!#$@#$@#$@#');
                window.open(
                  FUtil.LinkTo.objectDetails({
                    bucketName: data.bucketName,
                    objectID: record.originInfo.id,
                  }),
                );
              }}
              onDelete={
                record.associatedPresentableId !== ''
                  ? undefined
                  : () => {
                    dispatch<OnClick_Exhibits_DeleteBtn_Action>({
                      type: 'informalNodeManagerPage/onClick_Exhibits_DeleteBtn',
                      payload: {
                        testResourceId: record.testResourceId,
                        testResourceName: record.testResourceName,
                      },
                    });
                  }
              }
            />
          </div>
        );
      },
    },
    {
      title: <FComponentsLib.FTitleText type='table' text={'展示版本'} />,
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render(text: any, record) {
        return (
          <div style={{ width: 123 }}>
            {record.originInfo.version ? (
              <FComponentsLib.FContentText text={record.originInfo.version} />
            ) : (
              // : (<FContentText text={'---'} />)
              <MinusOutlined />
            )}
          </div>
        );
      },
    },
    {
      title: <FComponentsLib.FTitleText type='table' text={FI18n.i18nNext.t('switch_set_exhibit_avaliable')} />,
      dataIndex: 'online',
      key: 'online',
      width: 65,
      render(text: any, record) {
        return (
          <div style={{ width: 65 }}>
            <Space size={15}>
              <FSwitch
                // disabled={!record.isAuth}
                checked={record.stateInfo.onlineStatusInfo.onlineStatus === 1}
                loading={loading && operateExhibit.testResourceId === record.testResourceId}
                onClick={(checked) => changeStatus(checked, record)}
                // onChange={(value) => {
                //   dispatch<OnChange_Exhibits_StatusSwitch_Action>({
                //     type: 'informalNodeManagerPage/onChange_Exhibits_StatusSwitch',
                //     payload: {
                //       testResourceId: record.testResourceId,
                //       testResourceName: record.testResourceName,
                //       checked: value,
                //     },
                //   });
                // }}
              />
              {!record.isAuth && (
                <FTooltip
                  // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
                  title={'存在授权问题'}
                >
                  <FComponentsLib.FIcons.FWarning />
                </FTooltip>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  /** 上下架 */
  const changeStatus = (value: boolean, exhibit: any) => {
    operateExhibit = exhibit;
    setOperateExhibit(exhibit);

    if (value) {
      // 上架
      upOrDownExhibit(value);
    } else {
      // 下架
      const resourceNoTip = localStorage.getItem('exhibitNoTip') || false;
      if (resourceNoTip) {
        inactiveResource();
      } else {
        setNoLonger(false);
        setInactiveDialogShow(true);
      }
    }
  };

  /** 下架 */
  const inactiveResource = () => {
    if (inactiveDialogShow && noLonger) localStorage.setItem('exhibitNoTip', 'true');

    upOrDownExhibit(false);
  };

  /** 上下架请求 */
  const upOrDownExhibit = (value: boolean) => {
    setInactiveDialogShow(false);
    setLoading(true);
    setResultPopupType(value);

    dispatch<OnChange_Exhibits_StatusSwitch_Action>({
      type: 'informalNodeManagerPage/onChange_Exhibits_StatusSwitch',
      payload: {
        testResourceId: operateExhibit.testResourceId,
        testResourceName: operateExhibit.testResourceName,
        checked: value,
      },
    });

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setResultPopupType(null);
      }, 1000);
    }, 1000);
  };

  return (
    <>
      <FTable
        className={styles.table}
        dataSource={informalNodeManagerPage.exhibit_List.map((el) => {
          return {
            key: el.testResourceId,
            ...el,
          };
        })}
        columns={columns}
        rowClassName={styles.rowClassName}
      />

      <FDialog
        show={inactiveDialogShow}
        title={FI18n.i18nNext.t('remove_exhibit_from_auth_confirmation_title')}
        desc={FI18n.i18nNext.t('confirm_msg_remove_exhibits_from_auth')}
        sureText={FI18n.i18nNext.t('btn_remove_exhibits_from_auth')}
        cancel={() => {
          setInactiveDialogShow(false);
        }}
        sure={inactiveResource}
        loading={loading}
        footer={
          <Checkbox
            className={styles['no-longer']}
            checked={noLonger}
            onChange={(e) => setNoLonger(e.target.checked)}
          >
            {FI18n.i18nNext.t('checkbox_dontaskmeagain')}
          </Checkbox>
        }
      />

      {resultPopupType !== null && (
        <div className={styles['result-modal']}>
          <div className={styles['result-popup']}>
            {loading ? (
              <div className={styles['loader']}>
                <LoadingOutlined className={styles['loader-icon']} />
                <div className={styles['loader-text']}>
                  {
                    resultPopupType
                      ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_processing')
                      : FI18n.i18nNext.t('remove_resource_from_auth_msg_processing')
                  }
                </div>
              </div>
            ) : (
              <div className={styles['result']}>
                <i
                  className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                    styles[resultPopupType ? 'up' : 'down']
                  }`}
                />
                <div className={styles['result-text']}>
                  {
                    resultPopupType
                      ? FI18n.i18nNext.t('set_resource_available_for_auth_msg_done')
                      : FI18n.i18nNext.t('remove_resource_from_auth_msg_done')
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default connect(({ informalNodeManagerPage }: ConnectState) => ({
  informalNodeManagerPage,
}))(ExhibitTable);

interface ActionsProps {
  onEdit?(): void;

  onSearch?(): void;

  onDelete?(): void;
}

function Actions({ onEdit, onSearch, onDelete }: ActionsProps) {
  const refDom = React.useRef(null);

  return (<div ref={refDom}>
    <Space size={25}>
      {onEdit && (
        <FTooltip title={FI18n.i18nNext.t('tip_edit_exhibit')}>
            <span>
              <FComponentsLib.FTextBtn type='primary' onClick={() => onEdit()}>
                <FComponentsLib.FIcons.FEdit />
              </FComponentsLib.FTextBtn>
            </span>
        </FTooltip>
      )}

      {onSearch && (
        <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
            <span>
              <FComponentsLib.FTextBtn type='primary' onClick={() => onSearch()}>
                <FComponentsLib.FIcons.FFileSearch />
              </FComponentsLib.FTextBtn>
            </span>
        </FTooltip>
      )}

      {
        onDelete && (<FComponentsLib.FTextBtn
          onClick={async () => {
            const bool: boolean = await fPromiseModalConfirm({
              title: '提示',
              description: '一旦删除则无法恢复，确认删除吗？',
            });

            if (bool) {
              onDelete();
            }
            // fConfirmModal({
            //   message: '一旦删除则无法恢复，确认删除吗？',
            //   onOk() {
            //     onDelete();
            //   },
            // });
          }}
          className={styles.Delete}><FComponentsLib.FIcons.FDelete /></FComponentsLib.FTextBtn>)
      }

    </Space>
  </div>);
}
