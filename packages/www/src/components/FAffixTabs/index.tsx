import * as React from 'react';
import {Affix, Tabs} from 'antd';
import styles from './index.less';
// import {TabsProps} from "antd/lib/tabs";

interface Tab {
  value: string;
  text: string;
}

interface FAffixTabsProps {
  options: Tab[];
  value: string;
  onChange?: (value: '1' | '2') => void;
}

export default function ({options, value, onChange}: FAffixTabsProps) {
  return (<>
    <div className={styles.styles}>
      <div>
        <Tabs
          activeKey={value}
          size="large"
          className={styles.Tabs}
          onChange={(value: any) => onChange && onChange(value)}
          animated={false}
          centered
          // renderTabBar={(props: any, DefaultTabBar: React.ComponentClass) => <div>{DefaultTabBar}</div>}
        >
          {
            options.map((i: Tab) => (<Tabs.TabPane tab={i.text} key={i.value}/>))
          }
        </Tabs>
      </div>
    </div>
    <div style={{height: 55}}/>
  </>);
}

