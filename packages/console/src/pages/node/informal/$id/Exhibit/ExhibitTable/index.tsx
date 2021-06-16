import * as React from 'react';
import styles from './index.less';
import FTable from "@/components/FTable";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ColumnsType} from "antd/lib/table/interface";
import {FContentText} from "@/components/FText";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {router} from "umi";
import {Popconfirm, Space} from "antd";
import FSwitch from "@/components/FSwitch";
import {FDelete, FEdit, FFileSearch} from "@/components/FIcons";
import {FTextBtn} from "@/components/FButton";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import {ChangeAction, SaveDataRulesAction} from "@/models/informalNodeManagerPage";
import {FUtil} from '@freelog/tools-lib';

const {compile} = require('@freelog/nmr_translator');

interface ExhibitTableProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function ExhibitTable({dispatch, informalNodeManagerPage}: ExhibitTableProps) {

  const columns: ColumnsType<InformalNodeManagerPageModelState['exhibitList'][number]> = [
    {
      title: (<FContentText text={'来源｜封面'}/>),
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render(text, record) {
        return (<div className={styles.cover}>
          <img
            src={record.cover || imgSrc}
            alt={''}
            loading="lazy"
          />

          <div className={styles.Identity}>
            <FIdentityTypeBadge
              status={record.identity}
            />
          </div>
          {/*<label className={styles.object}>对象</label>*/}
          {/*<label className={styles.exhibit}>展品</label>*/}
        </div>);
      },
    },
    {
      title: (<FContentText text={'测试展品名称｜类型｜测试展品标题｜映射规则'}/>),
      dataIndex: 'name',
      key: 'name',
      render(text, record, index) {
        return (<div className={styles.name}>
          <FContentText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={record.name}
            type="highlight"
            singleRow
          />
          <div className={styles.type}>
            <label>image</label>
            <div>
              <FContentText
                type="additional2"
                text={record.title}
                singleRow
              />
            </div>
          </div>
          <div>
            <MappingRule
              add={record.rule.add}
              alter={record.rule.alter}
              active={record.rule.active}
              version={record.rule.version}
              cover={record.rule.cover}
              title={record.rule.title}
              online={record.rule.online}
              offline={record.rule.offline}
              labels={record.rule.labels}
              replaces={record.rule.replaces}
              attrs={record.rule.attrs}
            />
          </div>
        </div>);
      }
    },
    {
      title: <FContentText text={''}/>,
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render(text: any, record) {
        return (<div
          style={{width: 110}}
          className={styles.hoverVisible}
        >
          <Actions
            onEdit={() => router.push(FUtil.LinkTo.informExhibitManagement({exhibitID: record.id}))}
            onSearch={record.originInfo.type === 'resource' ? () => {
              if (record.identity === 'resource') {
                // console.log(record, 'record0ojlakfsdfj09ewalkfsjdl');
                if (record.originInfo.type === 'resource') {
                  router.push(FUtil.LinkTo.resourceDetails({resourceID: record.originInfo.id}));
                }

              }
            } : undefined}
            onDelete={!!record.associatedExhibitID ? undefined : async () => {
              const {rules}: { rules: any[] } = compile(informalNodeManagerPage.ruleText);
              // console.log(rules, '0-23jlksdjflkasdfio;ajsdlf');
              await dispatch<SaveDataRulesAction>({
                type: 'informalNodeManagerPage/saveDataRules',
                payload: {
                  type: 'replace',
                  data: rules.filter((r) => {
                    return r.exhibitName !== record.name;
                  }),
                },
              });

              await onChange({
                exhibitList: informalNodeManagerPage.exhibitList.filter((e) => {
                  console.log(e.name, record.name, '@#ADSFASDFj98ueijow;fjlasdkf');
                  return e.name !== record.name;
                }),
              });

            }}
          />
        </div>);
      },
    },
    {
      title: <FContentText text={'展示版本'}/>,
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render(text: any, record) {
        return (<div style={{width: 123}}>
          <FContentText text={record.version}/>
        </div>);
      },
    },
    {
      title: <FContentText text={'上线'}/>,
      dataIndex: 'online',
      key: 'online',
      width: 65,
      render(text: any, record) {
        return (<div style={{width: 65}}>
          <Space size={15}>
            <FSwitch
              disabled={false}
              checked={record.isOnline}
              onChange={async (value) => {
                const {rules}: { rules: any[] } = compile(informalNodeManagerPage.ruleText);
                // console.log(rules, '0-23jlksdjflkasdfio;ajsdlf');

                const rule = rules.find((r) => r.exhibitName === record.name);

                let data;

                if (rule) {
                  data = rules.map((r) => {
                    if (r.exhibitName !== record.name) {
                      return r;
                    }
                    return {
                      ...r,
                      online: value,
                    };
                  })
                } else {
                  data = [
                    ...rules,
                    {
                      operation: 'alter',
                      exhibitName: record.name,
                      online: value,
                    }
                  ];
                }

                await dispatch<SaveDataRulesAction>({
                  type: 'informalNodeManagerPage/saveDataRules',
                  payload: {
                    type: 'replace',
                    data: data,
                  },
                });

                // console.log(value, 'value0923jrlkasdjflasdf');

                await onChange({
                  exhibitList: informalNodeManagerPage.exhibitList
                    .map((e) => {
                      // console.log(e.name, record.name, '@#ADSFASDFj98ueijow;fjlasdkf');
                      if (e.name !== record.name) {
                        return e;
                      }

                      return {
                        ...e,
                        isOnline: value,
                        rule: {
                          ...e.rule,
                          online: value ? true : undefined,
                          offline: !value ? true : undefined,
                        },
                      };
                    }),
                });
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
    dataSource={informalNodeManagerPage.exhibitList.map((el) => {
      return {
        key: el.id,
        ...el,
      };
    })}
    columns={columns}
    rowClassName={styles.rowClassName}
  />);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(ExhibitTable);

interface ActionsProps {
  onEdit?(): void;

  onSearch?(): void;

  onDelete?(): void;
}

function Actions({onEdit, onSearch, onDelete}: ActionsProps) {
  let refDom: any = null;

  return (<div ref={(ref) => refDom = ref}>
    <Space size={25}>
      {
        onEdit && (<FTextBtn
          type="primary"
          onClick={() => onEdit()}
        >
          <FEdit/>
        </FTextBtn>)
      }

      {
        onSearch && (<FTextBtn
          type="primary"
          onClick={() => onSearch()}
        >
          <FFileSearch/>
        </FTextBtn>)
      }

      {
        onDelete && (<Popconfirm
          title={'确定删除吗？'}
          // style={{width: 200}}
          overlayStyle={{width: 150}}
          trigger="hover"
          getPopupContainer={() => refDom}
          onConfirm={() => onDelete()}
        >
          <FTextBtn
            className={styles.Delete}
          ><FDelete/></FTextBtn>
        </Popconfirm>)
      }

    </Space>
  </div>);
}
