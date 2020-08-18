import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {Checkbox, Dropdown, Space} from 'antd';
import {FNormalButton, FTextButton} from '@/components/FButton';


interface PolicyCardProps {
  title: string;
  code: string;

  onClickLicense?(): void;
}

function PolicyCard({title, code, onClickLicense}: PolicyCardProps) {
  const [dropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  return (<div className={styles.Policy}>
    <div className={styles.PolicyGrammar}>
      <div className={styles.PolicyName}>
        <span>{title}</span>
        <Dropdown
          overlay={<MenuPanel versions={[]} onClickCancel={() => setDropdownVisible(false)}/>}
          trigger={['click']}
          placement="bottomRight"
          visible={dropdownVisible}
          onVisibleChange={(visible) => setDropdownVisible(visible)}
          getPopupContainer={() => document.getElementById('DepPanelContent') as HTMLElement}
          arrow={true}
        >
          <FNormalButton
            size="small"
            onClick={() => onClickLicense && onClickLicense()}
          >获取授权</FNormalButton>
        </Dropdown>
      </div>
      <div style={{height: 5}}/>
      <pre>{code}</pre>
    </div>
  </div>);
}

export default PolicyCard;

interface MenuPanelProps {
  versions: {
    text: string;
    checked: boolean;
  }[];

  onClickConfirm?(versions: string[]): void;

  onClickCancel?(): void;
}

function MenuPanel({versions, onClickConfirm, onClickCancel}: MenuPanelProps) {
  return (<div className={styles.MenuPanel}>
    <FContentText text={'选择签约的版本'}/>
    <div style={{height: 30}}/>
    <div className={styles.allVersions}>
      <Space size={8}>
        <Checkbox checked={true}/>
        <span>0.0.1</span>
      </Space>
      <Space size={8}>
        <Checkbox checked={true}/>
        <span>0.0.2</span>
      </Space>
      <Space size={8}>
        <Checkbox checked={true}/>
        <span>0.0.2</span>
      </Space>
      <Space size={8}>
        <Checkbox checked={true}/>
        <span>0.0.2</span>
      </Space>
    </div>
    <div style={{height: 40}}/>
    <Space size={25}>
      <FTextButton onClick={() => onClickCancel && onClickCancel()}>取消</FTextButton>
      <FNormalButton>签约</FNormalButton>
    </Space>
  </div>);
}
