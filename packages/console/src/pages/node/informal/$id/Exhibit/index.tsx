import * as React from 'react';
import styles from './index.less';
import FNoDataTip from "@/components/FNoDataTip";
import {FContentText, FTitleText} from "@/components/FText";
import {Popover, Popconfirm, Space} from "antd";
import FInput from "@/components/FInput";
import FTable from "@/components/FTable";
import {FDelete, FEdit, FFileSearch, FLine, FWarning} from "@/components/FIcons";
import FMappingRuleReplace from "@/components/FIcons/FMappingRuleReplace";
import {FNormalButton, FTextButton} from "@/components/FButton";
import FSwitch from "@/components/FSwitch";
import FTooltip from "@/components/FTooltip";
import FAdd from "@/components/FIcons/FAdd";
import FDropdownMenu from "@/components/FDropdownMenu";
import FDrawer from "@/components/FDrawer";
import FSelect from "@/components/FSelect";
import FCheckbox from "@/components/FCheckbox";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import FInfiniteScroll from "@/components/FInfiniteScroll";
import MappingRule from "./MappingRule";

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  // {
  //   key: '2',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },
  // {
  //   key: '3',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },
  // {
  //   key: '4',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },
  // {
  //   key: '5',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },
  // {
  //   key: '6',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },
  // {
  //   key: '7',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '8',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '9',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '10',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '11',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '12',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // }, {
  //   key: '13',
  //   name: '胡彦祖',
  //   age: 42,
  //   address: '西湖区湖底公园1号',
  // },

];

const list: {
  id: string;
  checked: boolean;
  name: string;
  type: string;
  updateTime: string;
  status: 'online' | 'offline' | 'unreleased';
}[] = [{
  id: '1',
  checked: false,
  name: 'freeman/freelog白皮书',
  type: 'markdown',
  updateTime: '2019/02/10 12:1',
  status: 'online',
}, {
  id: '2',
  checked: true,
  name: 'Stefan/文档配图_01',
  type: '',
  updateTime: '2019/02/10 12:1',
  status: 'offline',
}, {
  id: '3',
  checked: true,
  name: 'Stefan/markdown阅读器',
  type: '',
  updateTime: '2019/02/10 12:1',
  status: 'unreleased',
}];

interface ExhibitProps {

}

function Exhibit({}: ExhibitProps) {

  if (false) {
    return (<FNoDataTip
      height={'calc(100vh - 94px)'}
      tipText={'当前测试节点没有添加展品'}
      btnText={'添加测试展品'}
    />);
  }

  const columns = [
    {
      title: (<FContentText text={'来源｜封面'}/>),
      dataIndex: 'cover',
      key: 'cover',
      width: 120,
      render() {
        return (<div className={styles.cover}>
          <img
            src={'//cn.bing.com/th?id=OHR.FichtelbergWinter_ZH-CN9274877146_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'}
            alt={''}
            loading="lazy"
          />
          <label className={styles.resource}>资源</label>
          {/*<label className={styles.object}>对象</label>*/}
          {/*<label className={styles.exhibit}>展品</label>*/}
        </div>);
      },
    },
    {
      title: (<FContentText text={'测试展品名称｜类型｜测试展品标题｜映射规则'}/>),
      dataIndex: 'name',
      key: 'name',
      render(text: any, record: any) {
        return (<div className={styles.name}>
          <FTitleText
            // text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里这'}
            text={'这里是展品名称这里是名称名称这里是展这里是展品名称这里是名称名称这里是展这里是展品名称这里是名称名称这里是展'}
            type="h4"
            singleRow
          />
          <div className={styles.type}>
            <label>image</label>
            <div>
              <FContentText
                type="additional2"
                text={'这里是展品标题这里是展品标题这里是展品标题这里这里是展品标题这'}
                singleRow
              />
            </div>
          </div>
          <div>
            <MappingRule/>
          </div>
        </div>);
      }
    },
    {
      title: <FContentText text={''}/>,
      dataIndex: 'action',
      key: 'action',
      width: 110,
      render() {
        return (<div
          style={{width: 110}}
          className={styles.hoverVisible}
        >
          <Actions/>
        </div>);
      },
    },
    {
      title: <FContentText text={'展示版本'}/>,
      dataIndex: 'version',
      key: 'version',
      width: 123,
      render() {
        return (<div style={{width: 123}}>
          <FContentText text={'1.0.10'}/>
        </div>);
      },
    },
    {
      title: <FContentText text={'上线'}/>,
      dataIndex: 'online',
      key: 'online',
      width: 65,
      render() {
        return (<div style={{width: 65}}>
          <Space size={15}>
            <FSwitch
              disabled={false}
              // checked={record.isOnline}
              onChange={(value) => {
                // dispatch<OnOnlineOrOfflineAction>({
                //   type: 'nodeManagerPage/onOnlineOrOffline',
                //   payload: {
                //     id: record.id,
                //     onlineStatus: value ? 1 : 0,
                //   },
                // });
              }}
            />
            {/*{!record.isAuth || record.policies.length === 0 ?*/}
            <FTooltip
              // title={!record.isAuth ? record.authErrorText : '暂无上线策略'}
              title={'暂无上线策略'}
            >
              <FWarning/>
            </FTooltip>
            {/*: ''}*/}
          </Space>
        </div>);
      },
    },
  ];

  return (<FInfiniteScroll
    loadMore={() => {
      console.log('1234#####');
    }}
  >
    <div className={styles.header}>
      <FTitleText text={'展品管理'}/>
      <Space size={30}>
        <Space size={5}><FAdd/><FContentText text={'新增测试展品'}/></Space>
        <Space size={5}><FMappingRuleReplace/><FContentText text={'资源替换'}/></Space>
        <div><FDropdownMenu options={[{value: '1234', text: '1234'}]} text={'筛选'}/></div>
        <div><FInput theme={'dark'}/></div>
      </Space>
    </div>
    <div className={styles.body}>
      <div>
        <FTable
          className={styles.table}
          dataSource={dataSource}
          columns={columns}
          rowClassName={styles.rowClassName}
        />
      </div>
    </div>
    <div style={{height: 100}}/>

    <FDrawer
      title={'添加测试展品'}
      visible={false}
      topRight={<Space size={30}>
        <FTextButton>取消</FTextButton>
        <FNormalButton>添加</FNormalButton>
      </Space>}>
      <div className={styles.filter}>
        <FSelect
          value={'market'}
          dataSource={[
            {value: 'market', title: '资源市场'},
            {value: 'resource', title: '我的资源'},
            {value: 'collection', title: '我的收藏'},
          ]}
        />
        <FInput theme="dark"/>
      </div>
      <div style={{height: 15}}/>
      <div className={styles.list}>
        {
          list.map((l) => {
            return (<div key={l.id} className={styles.item}>
              <FCheckbox checked={l.checked}/>
              <div style={{width: 15}}/>
              <div className={styles.itemContent}>
                <div className={styles.itemName}>
                  <FContentText
                    singleRow
                    text={l.name}
                  />
                  <div style={{width: 5}}/>
                  <FResourceStatusBadge status={l.status}/>
                </div>
                <div style={{height: 2}}/>
                <FContentText
                  text={(l.type ? `资源类型 ${l.type}` : '未设置类型') + ` | 更新时间 ${l.updateTime}`}
                  type="additional2"
                />
              </div>
            </div>);
          })
        }

      </div>

      <div style={{height: 20}}/>
      {
        false
          ? (<div className={styles.footer}>
            <FNormalButton
              // onClick={() => onLoadMord && onLoadMord()}
            >加载更多</FNormalButton>
          </div>)
          : (['2'].length > 0 && (
            <div style={{textAlign: 'center', padding: '10px 0'}}>
              <FContentText type="additional1" text={'没有更多了~'}/>
            </div>))
      }
    </FDrawer>
  </FInfiniteScroll>);
}

export default Exhibit;

function Actions() {

  let refDom: any = null;

  return (<div ref={(ref) => refDom = ref}>
    <Space size={25}>
      <FTextButton
        // onClick={() => router.push('/node/exhibit/formal/' + record.id)}
        theme="primary"
      >
        <FEdit/>
      </FTextButton>
      <FTextButton
        // onClick={() => router.push('/resource/' + record.resourceId)}
        theme="primary"
      >
        <FFileSearch/>
      </FTextButton>

      <Popconfirm
        title={'确定删除吗？'}
        // style={{width: 200}}
        overlayStyle={{width: 150}}
        trigger="hover"
        getPopupContainer={() => refDom}
        // onConfirm={() => onClickDelete && onClickDelete()}
      >
        <FTextButton
          className={styles.Delete}
        ><FDelete/></FTextButton>
      </Popconfirm>
    </Space>
  </div>);
}
