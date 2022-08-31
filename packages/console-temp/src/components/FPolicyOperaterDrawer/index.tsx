import { Checkbox, Space } from 'antd';
import * as React from 'react';
import styles from './index.less';
import FDrawer from '../FDrawer';
import { PolicyCard } from '../FPolicyList';
import FComponentsLib from '@freelog/components-lib';

interface FPolicyOperaterDrawerProps {
  visible: boolean;
  type: 'resource' | 'exhibit';
  policiesList: any[];
  onCancel(): void;
  onConfirm(): void;
  onNewPolicy(): void;
}

export const FPolicyOperaterDrawer = ({
  visible = false,
  policiesList,
  type,
  onCancel,
  onConfirm,
  onNewPolicy,
}: FPolicyOperaterDrawerProps) => {
  const typeMapping = { resource: '资源', exhibit: '展品' };
  const [activeList, setActiveList] = React.useState<string[]>([]);
  const updateActiveList = () => {
    const list = policiesList.filter((item) => item.checked).map((item) => item.policyId);
    setActiveList(list);
  };

  React.useEffect(() => {
    if (visible) updateActiveList();
  }, [visible]);

  return (
    <>
      <FDrawer
        visible={visible}
        title={
          <Space size={10}>
            <FComponentsLib.FTitleText type="h2" text={`启用策略并上架${typeMapping[type]}`} />
          </Space>
        }
        width={700}
        onClose={() => onCancel()}
        topRight={
          <Space size={30}>
            <FComponentsLib.FTextBtn onClick={() => onCancel()}>取消</FComponentsLib.FTextBtn>
            <FComponentsLib.FRectBtn disabled={activeList.length === 0} onClick={() => onConfirm()} type="primary">
              上架{typeMapping[type]}
            </FComponentsLib.FRectBtn>
          </Space>
        }
      >
        <div className={styles.tip}>
          <i className={`freelog fl-icon-warningxiaochicun ${styles.icon}`}></i>
          <div className={styles.text}>
            {typeMapping[type]}上架需要启用至少一个授权策略，请选择你想要启用的授权策略
          </div>
        </div>
        {policiesList.map((item) => {
          return (
            <div key={item.policyId}>
              <Checkbox
                style={{ marginBottom: '10px' }}
                checked={activeList.includes(item.policyId)}
                onChange={(e) => {
                  item.checked = e.target.checked;
                  updateActiveList();
                }}
              ></Checkbox>
              <PolicyCard fullInfo={item} activeBtnShow={false} />
            </div>
          );
        })}
        <FComponentsLib.FRectBtn style={{ marginTop: '-10px' }} onClick={onNewPolicy} type="primary">
          创建新授权策略
        </FComponentsLib.FRectBtn>
      </FDrawer>
    </>
  );
};