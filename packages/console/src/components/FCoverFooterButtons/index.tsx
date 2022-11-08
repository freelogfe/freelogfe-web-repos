import * as React from 'react';
import styles from './index.less';
import FDivider from '@/components/FDivider';
// import FUpdate from '@/components/FIcons/FUpdate';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';

interface FCoverFooterButtonsProps {
  buttons: {
    type: '' | 'active' | 'edit' | 'delete' | 'resourceDetails' | 'objectDetails' | 'update' | 'cancelCollect';
    fn(): void;
  }[];
}

const btnMap: any = {
  active: {
    text: FI18n.i18nNext.t('btn_activate_theme'),
    icon: (<FComponentsLib.FIcons.FMappingRuleActive />),
  },
  edit: {
    text: '编辑',
    icon: (<FComponentsLib.FIcons.FEdit />),
  },
  resourceDetails: {
    text: '资源详情',
    icon: (<FComponentsLib.FIcons.FFileSearch />),
  },
  objectDetails: {
    text: '对象详情',
    icon: (<FComponentsLib.FIcons.FFileSearch />),
  },
  delete: {
    text: '删除',
    icon: (<FComponentsLib.FIcons.FDelete />),
  },
  update: {
    text: '更新',
    icon: (<FComponentsLib.FIcons.FUpdate />),
  },
  cancelCollect: {
    text: '取消收藏',
    icon: (<FComponentsLib.FIcons.FCancelCollect />),
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
          return <React.Fragment key={i}>
            {i !== 0 && (<FDivider />)}
            <a onClick={() => {
              fn();
            }}>
              {btnMap[type].icon}
              <div style={{ height: 4 }} />
              <span>{btnMap[type].text}</span>
            </a>
          </React.Fragment>;
        })
    }
    <div style={{ width: 1 }} />
  </div>);
}

export default FCoverFooterButtons;
