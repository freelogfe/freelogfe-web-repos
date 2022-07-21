import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import { ColumnsType } from 'antd/lib/table/interface';
import { FContentText, FTitleText } from '@/components/FText';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { Radio, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { FDelete, FFileSearch, FWarning } from '@/components/FIcons';
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
      title: <FTitleText type="table" text={'来源｜封面'} />,
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
      title: <FTitleText type="table" text={'测试展品名称｜类型｜测试展品标题｜映射规则'} />,
      dataIndex: 'name',
      key: 'name',
      render(text, record) {
        return (<div className={styles.name}>
          <FContentText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={record.testResourceName}
            type='highlight'
            singleRow
          />
          <div className={styles.type}>
            <label>{FUtil.Format.resourceTypeKeyArrToResourceType(record.originInfo.resourceType)}</label>
            <div>
              <FContentText
                type='additional2'
                text={record.stateInfo.titleInfo.title}
                singleRow
              />
            </div>
          </div>
          <div style={{ maxWidth: 500, overflow: 'hidden' }}>
            <MappingRule operationAndActionRecords={record.operationAndActionRecords}/>
          </div>
        </div>);
      },
    },
    {
      title: <FTitleText type="table" text={''} />,
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
      title: <FTitleText type="table" text={'展示版本'} />,
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render(text: any, record) {
        return (
          <div style={{ width: 123 }}>
            {record.originInfo.version ? (
              <FContentText text={record.originInfo.version} />
            ) : (
              // : (<FContentText text={'---'} />)
              <MinusOutlined />
            )}
          </div>
        );
      },
    },
    {
      title: <FTitleText type="table" text={'上架'} />,
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
                  <FWarning />
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
  }

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
        title="提醒"
        desc="下架后其它用户将无法签约该资源，确认要下架吗？"
        sureText="下架资源"
        cancel={() => {
          setInactiveDialogShow(false);
        }}
        sure={inactiveResource}
        loading={loading}
        footer={
          <Radio
            className={styles['no-longer']}
            checked={noLonger}
            onClick={() => setNoLonger(!noLonger)}
          >
            不再提醒
          </Radio>
        }
      ></FDialog>

      {resultPopupType !== null && (
        <div className={styles['result-modal']}>
          <div className={styles['result-popup']}>
            {loading ? (
              <div className={styles['loader']}>
                <LoadingOutlined className={styles['loader-icon']} />
                <div className={styles['loader-text']}>
                  正在{resultPopupType ? '上架' : '下架'}
                </div>
              </div>
            ) : (
              <div className={styles['result']}>
                <i
                  className={`freelog fl-icon-shangpao ${styles['result-icon']} ${
                    styles[resultPopupType ? 'up' : 'down']
                  }`}
                ></i>
                <div className={styles['result-text']}>
                  已{resultPopupType ? '上架' : '下架'}
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
              <FComponentsLib.FTextBtn type="primary" onClick={() => onEdit()}>
                <FComponentsLib.FIcons.FEdit />
              </FComponentsLib.FTextBtn>
            </span>
          </FTooltip>
        )}

        {onSearch && (
          <FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
            <span>
              <FComponentsLib.FTextBtn type="primary" onClick={() => onSearch()}>
                <FFileSearch />
              </FComponentsLib.FTextBtn>
            </span>
          </FTooltip>
        )}

      {
        onDelete && (<FComponentsLib.FTextBtn
          onClick={() => {
            fConfirmModal({
              message: '一旦删除则无法恢复，确认删除吗？',
              onOk() {
                onDelete();
              },
            });
          }}
          className={styles.Delete}><FDelete /></FComponentsLib.FTextBtn>)
      }

    </Space>
  </div>);
}
