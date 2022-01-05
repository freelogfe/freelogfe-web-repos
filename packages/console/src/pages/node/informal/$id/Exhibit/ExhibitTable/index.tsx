import * as React from 'react';
import styles from './index.less';
import FTable from '@/components/FTable';
import { connect, Dispatch } from 'dva';
import { ConnectState, InformalNodeManagerPageModelState } from '@/models/connect';
import { ColumnsType } from 'antd/lib/table/interface';
import { FContentText, FTitleText } from '@/components/FText';
import MappingRule from '@/pages/node/informal/$id/Exhibit/MappingRule';
// import {router} from "umi";
import { Popconfirm, Space } from 'antd';
import FSwitch from '@/components/FSwitch';
import { FDelete, FEdit, FFileSearch } from '@/components/FIcons';
import { FTextBtn } from '@/components/FButton';
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import FIdentityTypeBadge from '@/components/FIdentityTypeBadge';
import {
  ChangeAction,
  OnChange_Exhibits_StatusSwitch_Action, OnClick_Exhibits_DeleteBtn_Action,
  SaveDataRulesAction,
} from '@/models/informalNodeManagerPage';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
import FUtil1 from '@/utils';
import FTooltip from '@/components/FTooltip';
import FCoverImage from '@/components/FCoverImage';

const { compile } = require('@freelog/nmr_translator');

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
          {/*<img*/}
          {/*  src={record.cover || imgSrc}*/}
          {/*  alt={''}*/}
          {/*  loading="lazy"*/}
          {/*/>*/}

          <FCoverImage src={record.stateInfo.coverInfo.coverImages[0] || ''} width={120} style={{ borderRadius: 4 }} />

          <div className={styles.Identity}>
            <FIdentityTypeBadge
              status={record.originInfo.type}
            />
          </div>
        </div>);
      },
    },
    {
      title: (<FTitleText type='table' text={'测试展品名称｜类型｜测试展品标题｜映射规则'} />),
      dataIndex: 'name',
      key: 'name',
      render(text, record, index) {
        let add: {
          exhibit: string;
          source: {
            type: 'resource' | 'object';
            name: string;
            versionRange?: string;
          };
        } | null = null;
        let alter: string = '';
        if (record.associatedPresentableId === '') {
          add = {
            exhibit: record.testResourceName,
            source: {
              type: record.originInfo.type,
              name: record.originInfo.name,
              versionRange: record.originInfo.versionRange,
            },
          };
        } else if (record.rules.length !== 0) {
          alter = record.testResourceName;
        }
        return (<div className={styles.name}>
          <FContentText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={record.testResourceName}
            type='highlight'
            singleRow
          />
          <div className={styles.type}>
            <label>image</label>
            <div>
              <FContentText
                type='additional2'
                text={record.stateInfo.titleInfo.title}
                singleRow
              />
            </div>
          </div>
          <div>
            <MappingRule
              add={add || undefined}
              alter={alter || undefined}
              active={undefined}
              version={(record.originInfo.versionRange === '' || record.originInfo.versionRange === 'latest') ? undefined : record.originInfo.versionRange}
              cover={record.stateInfo.coverInfo.ruleId === 'default' ? undefined : record.stateInfo.coverInfo.coverImages[0]}
              title={record.stateInfo.titleInfo.ruleId === 'default' ? undefined : record.stateInfo.titleInfo.title}
              online={record.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : record.stateInfo.onlineStatusInfo.onlineStatus === 1}
              offline={record.stateInfo.onlineStatusInfo.ruleId === 'default' ? undefined : record.stateInfo.onlineStatusInfo.onlineStatus === 0}
              labels={record.stateInfo.tagInfo.ruleId === 'default' ? undefined : record.stateInfo.tagInfo.tags}
              replaces={record.stateInfo.replaceInfo.ruleId === 'default' ? undefined : record.stateInfo.replaceInfo.replaceRecords}
              attrs={record.stateInfo.propertyInfo.ruleId === 'default'
                ? undefined
                : record.stateInfo.propertyInfo.testResourceProperty
                  .filter((trp) => {
                    return trp.isRuleAdd;
                  })
                  .map((trp) => {
                    return {
                      type: 'add',
                      theKey: trp.key,
                      value: String(trp.value),
                      description: trp.remark,
                    };
                  })}
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
                  testResourceName: record.testResourceName,
                },
              });
              // const { rules }: { rules: any[] } = compile(informalNodeManagerPage.node_RuleText);
              // // console.log(rules, '0-23jlksdjflkasdfio;ajsdlf');
              // await dispatch<SaveDataRulesAction>({
              //   type: 'informalNodeManagerPage/saveDataRules',
              //   payload: {
              //     type: 'replace',
              //     data: rules.filter((r) => {
              //       return r.exhibitName !== record.testResourceName;
              //     }),
              //   },
              // });
              //
              // await onChange({
              //   exhibit_List: informalNodeManagerPage.exhibit_List.filter((e) => {
              //     // console.log(e.name, record.name, '@#ADSFASDFj98ueijow;fjlasdkf');
              //     return e.testResourceName !== record.testResourceName;
              //   }),
              // });
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
          <FContentText text={record.originInfo.version} />
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
              disabled={false}
              checked={record.stateInfo.onlineStatusInfo.onlineStatus === 1}
              onChange={(value) => {
                dispatch<OnChange_Exhibits_StatusSwitch_Action>({
                  type: 'informalNodeManagerPage/onChange_Exhibits_StatusSwitch',
                  payload: {
                    testResourceName: record.testResourceName,
                    checked: value,
                  },
                });
                // const { rules }: { rules: any[] } = compile(informalNodeManagerPage.node_RuleText);
                //
                // const rule = rules.find((r) => r.exhibitName === record.testResourceName);
                //
                // let data;
                //
                // if (rule) {
                //   data = rules.map((r) => {
                //     if (r.exhibitName !== record.testResourceName) {
                //       return r;
                //     }
                //     return {
                //       ...r,
                //       online: value,
                //     };
                //   });
                // } else {
                //   data = [
                //     ...rules,
                //     {
                //       operation: 'alter',
                //       exhibitName: record.testResourceName,
                //       online: value,
                //     },
                //   ];
                // }
                //
                // await dispatch<SaveDataRulesAction>({
                //   type: 'informalNodeManagerPage/saveDataRules',
                //   payload: {
                //     type: 'replace',
                //     data: data,
                //   },
                // });
              }}
            />
            {/*<FTooltip*/}
            {/*  // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}*/}
            {/*  title={'暂无上线策略'}*/}
            {/*>*/}
            {/*  <FWarning/>*/}
            {/*</FTooltip>*/}
          </Space>
        </div>);
      },
    },
  ];

  async function onChange(payload: Partial<InformalNodeManagerPageModelState>) {
    await dispatch<ChangeAction>({
      type: 'informalNodeManagerPage/change',
      payload,
    });
  }

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
        onEdit && (<FTooltip title={FUtil1.I18n.message('tip_edit_exhibit')}>
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
        onSearch && (<FTooltip title={FUtil1.I18n.message('tip_check_relevant_resource')}>
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

      {
        onDelete && (<Popconfirm
          title={'确定删除吗？'}
          // style={{width: 200}}
          overlayStyle={{ width: 150 }}
          trigger='hover'
          getPopupContainer={() => refDom.current || document.body}
          onConfirm={() => onDelete()}
        >
          <div><FTextBtn className={styles.Delete}><FDelete /></FTextBtn></div>
        </Popconfirm>)
      }

    </Space>
  </div>);
}
