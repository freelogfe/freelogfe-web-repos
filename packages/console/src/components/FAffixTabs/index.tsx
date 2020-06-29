import * as React from 'react';
import {Affix, Tabs} from 'antd';
import styles from './index.less';

interface Tab {
  id: string | number;
  text: string | number;
}

interface FAffixTabsProps {
  tabs: Tab[];
}

export default function ({tabs}: FAffixTabsProps) {
  return (<Affix offsetTop={0}>
    <Tabs
      defaultActiveKey="1"
      size="large"
      className={styles.Tabs}
      // onChange={callback}
    >
      {
        tabs.map((i: Tab) => (<Tabs.TabPane tab={i.text} key={i.id}/>))
      }
    </Tabs>
  </Affix>);
}

