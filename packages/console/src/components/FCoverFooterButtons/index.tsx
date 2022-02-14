import * as React from 'react';
import styles from './index.less';
import FMappingRuleActive from '@/components/FIcons/FMappingRuleActive';
import { FDelete, FEdit } from '@/components/FIcons';
import FFileSearch from '../FIcons/FFileSearch';
import FDivider from '@/components/FDivider';

interface FCoverFooterButtonsProps {
  buttons: {
    type: '' | 'active' | 'edit' | 'delete' | 'resourceDetails' | 'objectDetails';
    fn(): void;
  }[];
}

const btnMap: any = {
  active: {
    text: '激活',
    icon: (<FMappingRuleActive />),
  },
  edit: {
    text: '编辑',
    icon: (<FEdit />),
  },
  resourceDetails: {
    text: '资源详情',
    icon: (<FFileSearch />),
  },
  objectDetails: {
    text: '对象详情',
    icon: (<FFileSearch />),
  },
  delete: {
    text: '删除',
    icon: (<FDelete />),
  },
};

function FCoverFooterButtons({ buttons }: FCoverFooterButtonsProps) {
  return (<div className={styles.FCoverFooterButtons}>
    <div style={{ width: 1 }} />
    {
      buttons
        .filter(({ type }) => {
          return type !== '';
        })
        .map(({ type, fn }, i) => {
          return <>
            {i !== 0 && (<FDivider />)}
            <a onClick={() => {
              fn();
            }}>
              {btnMap[type].icon}
              <div style={{ height: 4 }} />
              <span>{btnMap[type].text}</span>
            </a>
          </>;
        })
    }
    <div style={{ width: 1 }} />
  </div>);
}

export default FCoverFooterButtons;
