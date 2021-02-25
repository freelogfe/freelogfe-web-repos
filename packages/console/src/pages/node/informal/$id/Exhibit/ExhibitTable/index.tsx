import * as React from 'react';
import styles from './index.less';
import FTable from "@/components/FTable";
import {connect, Dispatch} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {ColumnsType} from "antd/lib/table/interface";
import {FContentText, FTitleText} from "@/components/FText";
import MappingRule from "@/pages/node/informal/$id/Exhibit/MappingRule";
import {router} from "umi";
import {informExhibitManagement, resourceDetails, resourceInfo} from "@/utils/path-assembler";
import {Popconfirm, Space} from "antd";
import FSwitch from "@/components/FSwitch";
import FTooltip from "@/components/FTooltip";
import {FDelete, FEdit, FFileSearch, FWarning} from "@/components/FIcons";
import {FTextButton} from "@/components/FButton";
import * as imgSrc from '@/assets/default-resource-cover.jpg';
import FIdentityTypeBadge from "@/components/FIdentityTypeBadge";
import {SaveDataRulesAction} from "@/models/informalNodeManagerPage";

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
            <FIdentityTypeBadge status={record.identity}/>
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
          <FTitleText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={record.name}
            type="h4"
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
              {...record.rule}
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
            onEdit={() => router.push(informExhibitManagement({exhibitID: record.id}))}
            onSearch={() => {
              if (record.identity === 'resource') {
                router.push(resourceDetails({resourceID: record.originId}));
              }
            }}
            onDelete={!!record.associatedExhibitID ? undefined : () => {
              const {rules}: { rules: any[] } = compile(informalNodeManagerPage.ruleText);
              // console.log(rules, '0-23jlksdjflkasdfio;ajsdlf');
              dispatch<SaveDataRulesAction>({
                type: 'informalNodeManagerPage/saveDataRules',
                payload: {
                  type: 'replace',
                  data: rules.filter((r) => {
                    return r.exhibitName !== record.name;
                  }),
                },
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
              onChange={(value) => {
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
                  ]
                }

                dispatch<SaveDataRulesAction>({
                  type: 'informalNodeManagerPage/saveDataRules',
                  payload: {
                    type: 'replace',
                    data: data,
                  },
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
        onEdit && (<FTextButton
          theme="primary"
          onClick={() => onEdit()}
        >
          <FEdit/>
        </FTextButton>)
      }

      {
        onSearch && (<FTextButton
          theme="primary"
          onClick={() => onSearch()}
        >
          <FFileSearch/>
        </FTextButton>)
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
          <FTextButton
            className={styles.Delete}
          ><FDelete/></FTextButton>
        </Popconfirm>)
      }

    </Space>
  </div>);
}
