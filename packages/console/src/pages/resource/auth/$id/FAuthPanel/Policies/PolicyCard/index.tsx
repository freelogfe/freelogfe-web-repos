import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {Checkbox, Dropdown, Space} from 'antd';
import {FRectBtn, FTextBtn} from '@/components/FButton';
import {connect, Dispatch} from 'dva';
import {ConnectState, ResourceInfoModelState} from "@/models/connect";

interface PolicyCardProps {
  dispatch: Dispatch;
  resourceInfo: ResourceInfoModelState['info'];
  title: string;
  code: string;
  allVersions: string[];

  onClickLicense?(versions: string[]): void;
}

function PolicyCard({title, code, allVersions, onClickLicense, resourceInfo, dispatch}: PolicyCardProps) {
  const [dropdownVisible, setDropdownVisible] = React.useState<boolean>(false);

  return (<div className={styles.Policy}>
    <div style={{height: 10}}/>
    <div className={styles.PolicyName}>
      <Space size={10}>
        <span>{title}</span>
      </Space>

      <Dropdown
        overlay={<MenuPanel
          versions={allVersions}
          onClickCancel={() => setDropdownVisible(false)}
          onClickConfirm={(versions) => onClickLicense && onClickLicense(versions)}
        />}
        trigger={['click']}
        placement="bottomRight"
        visible={dropdownVisible}
        onVisibleChange={(visible) => setDropdownVisible(visible)}
        // getPopupContainer={() => document.getElementById('DepPanelContent') as HTMLElement}
        arrow={true}
      >
        <FRectBtn
          size="small"
          // onClick={() => onClickLicense && onClickLicense()}
        >获取授权</FRectBtn>
      </Dropdown>
    </div>
    <div style={{height: 10}}/>
    <div className={styles.PolicyGrammar}>
      <div style={{height: 5}}/>
      <pre>{code}</pre>
    </div>
  </div>);
}


export default connect(({resourceInfo}: ConnectState) => ({
  resourceInfo: resourceInfo.info,
}))(PolicyCard);

interface MenuPanelProps {
  versions: string[];

  onClickConfirm?(versions: string[]): void;

  onClickCancel?(): void;
}

function MenuPanel({versions, onClickConfirm, onClickCancel}: MenuPanelProps) {
  const [selectedVersions, setSelectedVersions] = React.useState<string[]>([]);

  function onChangeSelected(version: string, checked: boolean) {
    if (checked) {
      setSelectedVersions([
        ...selectedVersions,
        version,
      ]);
    } else {
      setSelectedVersions(selectedVersions.filter((v: string) => v !== version));
    }
  }

  return (<div className={styles.MenuPanel}>
    <FContentText text={'选择签约的版本'}/>
    <div style={{height: 30}}/>
    <div className={styles.allVersions}>
      {
        versions.map((v) => (<Space size={8} key={v}>
          <Checkbox
            checked={selectedVersions.includes(v)}
            onChange={(e) => onChangeSelected(v, e.target.checked)}
          />
          <span>{v}</span>
        </Space>))
      }
    </div>
    <div style={{height: 40}}/>
    <Space size={25}>
      <FTextBtn
        onClick={() => onClickCancel && onClickCancel()}>取消</FTextBtn>
      <FRectBtn
        onClick={() => onClickConfirm && onClickConfirm(selectedVersions)}
      >签约</FRectBtn>
    </Space>
  </div>);
}
