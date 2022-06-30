import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import { ColumnsType } from 'antd/lib/table/interface';
import { FContentText, FTitleText } from '@/components/FText';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
import { Popconfirm, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { FDelete, FEdit, FFileSearch, FWarning } from '@/components/FIcons';
import { FTextBtn } from '@/components/FButton';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import {
  OnChange_Exhibits_StatusSwitch_Action,
  OnClick_Exhibits_DeleteBtn_Action,
} from '@/models/informalNodeManagerPage';
import { FServiceAPI, FUtil, FI18n } from '@freelog/tools-lib';
// import FUtil1 from '@/utils';
import FTooltip from '@/components/FTooltip';
import FCoverImage from '@/components/FCoverImage';
import fConfirmModal from '@/components/fConfirmModal';
import { MinusOutlined } from '@ant-design/icons';

interface ExhibitTableProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function ExhibitTable({ dispatch, informalNodeManagerPage }: ExhibitTableProps) {

  const columns: ColumnsType<InformalNodeManagerPageModelState['exhibit_List'][number]> = [
    {
      title: (<FTitleText type='table' text={'来源｜封面'} />),
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
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'测试展品名称｜类型｜测试展品标题｜映射规则'} />),
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
            <label>{record.originInfo.resourceType}</label>
            <div>
              <FContentText
                type='additional2'
                text={record.stateInfo.titleInfo.title}
                singleRow
              />
            </div>
          </div>
          <div style={{ maxWidth: 500, overflow: 'hidden' }}>
            <MappingRule
              operationAndActionRecords={record.operationAndActionRecords}
            />
          </div>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={''} />),
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render(text: any, record) {
        return (<div
          style={{ width: 110 }}
          className={styles.hoverVisible}
        >
          <Actions
            onEdit={() => {
              window.open(FUtil.LinkTo.informExhibitManagement({ exhibitID: record.testResourceId }));
            }}
            onSearch={async () => {
              // console.log(record, 'record0ojlakfsdfj09ewalkfsjdl');
              if (record.originInfo.type === 'resource') {
                return window.open(FUtil.LinkTo.resourceDetails({ resourceID: record.originInfo.id }));
              }

              const { data } = await FServiceAPI.Storage.objectDetails({
                objectIdOrName: record.originInfo.id,
              });

              // console.log(data, '!@!#$!@#$@!#$@#$@#$@#');
              window.open(FUtil.LinkTo.objectDetails({
                bucketName: data.bucketName,
                objectID: record.originInfo.id,
              }));
            }}
            onDelete={record.associatedPresentableId !== '' ? undefined : () => {
              dispatch<OnClick_Exhibits_DeleteBtn_Action>({
                type: 'informalNodeManagerPage/onClick_Exhibits_DeleteBtn',
                payload: {
                  testResourceId: record.testResourceId,
                  testResourceName: record.testResourceName,
                },
              });
            }}
          />
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'展示版本'} />),
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render(text: any, record) {
        return (<div style={{ width: 123 }}>
          {
            record.originInfo.version
              ? (<FContentText text={record.originInfo.version} />)
              // : (<FContentText text={'---'} />)
              : (<MinusOutlined />)
          }

        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'上线'} />),
      dataIndex: 'online',
      key: 'online',
      width: 65,
      render(text: any, record) {
        return (<div style={{ width: 65 }}>
          <Space size={15}>
            <FSwitch
              // disabled={!record.isAuth}
              checked={record.stateInfo.onlineStatusInfo.onlineStatus === 1}
              onChange={(value) => {
                dispatch<OnChange_Exhibits_StatusSwitch_Action>({
                  type: 'informalNodeManagerPage/onChange_Exhibits_StatusSwitch',
                  payload: {
                    testResourceId: record.testResourceId,
                    testResourceName: record.testResourceName,
                    checked: value,
                  },
                });
              }}
            />
            {
              !record.isAuth && (<FTooltip
                // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
                title={'存在授权问题'}
              >
                <FWarning />
              </FTooltip>)
            }

          </Space>
        </div>);
      },
    },
  ];

  return (<FTable
    className={styles.table}
    dataSource={informalNodeManagerPage.exhibit_List.map((el) => {
      return {
        key: el.testResourceId,
        ...el,
      };
    })}
    columns={columns}
    rowClassName={styles.rowClassName}
  />);
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
      {
        onEdit && (<FTooltip title={FI18n.i18nNext.t('tip_edit_exhibit')}>
          <span>
          <FTextBtn
            type='primary'
            onClick={() => onEdit()}
          >
            <FEdit />
          </FTextBtn>
            </span>
        </FTooltip>)
      }

      {
        onSearch && (<FTooltip title={FI18n.i18nNext.t('tip_check_relevant_resource')}>
          <span>
          <FTextBtn
            type='primary'
            onClick={() => onSearch()}
          >
            <FFileSearch />
          </FTextBtn>
            </span>
        </FTooltip>)
      }

      {/*{*/}
      {/*  onDelete && (<Popconfirm*/}
      {/*    title={'确定删除吗？'}*/}
      {/*    // style={{width: 200}}*/}
      {/*    overlayStyle={{ width: 150 }}*/}
      {/*    trigger='hover'*/}
      {/*    getPopupContainer={() => refDom.current || document.body}*/}
      {/*    onConfirm={() => onDelete()}*/}
      {/*  >*/}
      {/*    <div><FTextBtn className={styles.Delete}><FDelete /></FTextBtn></div>*/}
      {/*  </Popconfirm>)*/}
      {/*}*/}
      {
        onDelete && (<FTextBtn
          onClick={() => {
            fConfirmModal({
              message: '一旦删除则无法恢复，确认删除吗？',
              onOk() {
                onDelete()
              },
            });
          }}
          className={styles.Delete}><FDelete /></FTextBtn>)
      }

    </Space>
  </div>);
}
