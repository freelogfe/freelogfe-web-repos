import * as React from 'react';
import {Affix, Tabs} from 'antd';
import styles from './index.less';

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
  return (<Affix offsetTop={0}>
    <Tabs
      activeKey={value}
      size="large"
      className={styles.Tabs}
      onChange={(value: any) => onChange && onChange(value)}
      animated={false}
    >
      {
        options.map((i: Tab) => (<Tabs.TabPane tab={i.text} key={i.value}/>))
      }
    </Tabs>
  </Affix>);
}

