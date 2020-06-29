import React from 'react';
import styles from './index.less';
import FLayout from '@/layouts/FLayout';
import {Affix, Tabs} from 'antd';
import FAffixTabs from "@/components/FAffixTabs";

const navs = [
  {
    id: 1,
    text: '资源市场',
  },
  {
    id: 2,
    text: '示例节点',
  },
];

export default function () {
  return (
    <FLayout>
      <FAffixTabs tabs={navs}/>
    </FLayout>
  );
}
