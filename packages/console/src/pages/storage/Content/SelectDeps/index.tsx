import * as React from 'react';
import styles from './index.less';
import {Dropdown, Tabs} from 'antd';
import FMenu from "@/components/FMenu";
import FDropdown from "@/components/FDropdown";
import {DownOutlined} from '@ant-design/icons';
import FInput from "@/components/FInput";
import FResourceList from "@/components/FResourceList";

interface SelectDepsProps {

}

const totalItem = 1;

function SelectDeps({}: SelectDepsProps) {
  return (<div>
    <Tabs>
      <Tabs.TabPane tab="资源" key="1">
        <div className={styles.filter}>
          <FDropdown options={[{text: '全部', value: '1234'}]}>
          <a>全部Bucket <DownOutlined
            style={{marginLeft: 8}}/></a>
          </FDropdown>
          <FInput theme="dark"/>
        </div>
        {/*<FResourceList*/}
        {/*  resourceObjects={[{id: "5f3e413a3ae810002eeffaf8",*/}
        {/*    resourceType: "txt",*/}
        {/*    status: 1,*/}
        {/*    time: "2020-08-20 17:25",*/}
        {/*    title: "12345676789/5C"}]}*/}
        {/*  loading={totalItem === -1}*/}
        {/*  stillMore={totalItem > 1 * 20}*/}
        {/*  onSelect={onSelect}*/}
        {/*  onLoadMord={onChangePage}*/}
        {/*/>*/}
      </Tabs.TabPane>
      <Tabs.TabPane tab="对象" key="2">
        Content of Tab Pane 2
      </Tabs.TabPane>
    </Tabs>
  </div>);
}

export default SelectDeps;
