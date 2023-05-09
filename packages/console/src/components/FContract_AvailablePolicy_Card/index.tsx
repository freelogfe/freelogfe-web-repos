import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FPolicyDisplay from '@/components/FPolicyDisplay';
import FModal from '@/components/FModal';
import FDrawer from '@/components/FDrawer';
import FCheckbox from '@/components/FCheckbox';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import FComponentsLib from '@freelog/components-lib';

interface FContract_AvailablePolicy_Card_Props {
  fullInfo: PolicyFullInfo_Type;
  allVersions: string[];
  canSign?: boolean;

  onClickLicense?(versions: string[]): void;
}

interface FContract_AvailablePolicy_Card_States {
  fullScreenVisible: boolean;
  drawerVisible: boolean;
  checkedVersions: string[];

}

function FContract_AvailablePolicy_Card({
                                          fullInfo,
                                          allVersions,
                                          onClickLicense,
                                          canSign = true,
                                        }: FContract_AvailablePolicy_Card_Props) {
  const [fullScreenVisible, setFullScreenVisible] = React.useState<FContract_AvailablePolicy_Card_States['fullScreenVisible']>(false);
  const [drawerVisible, setDrawerVisible] = React.useState<FContract_AvailablePolicy_Card_States['drawerVisible']>(false);
  const [checkedVersions, setCheckedVersions] = React.useState<FContract_AvailablePolicy_Card_States['checkedVersions']>([]);

  function onCancel_VersionsDrawer() {
    setDrawerVisible(false);
  }

  function onChange_VersionsDrawer_Visible(visible: boolean) {
    if (visible && allVersions.length === 1) {
      setCheckedVersions([
        ...allVersions,
      ]);
    } else {
      setCheckedVersions([]);
    }
  }

  function onChange_SelectAllCheckbox(checked: boolean) {
    if (checked) {
      setCheckedVersions([
        ...allVersions,
      ]);
    } else {
      setCheckedVersions([]);
    }
  }

  function onChange_VersionSelected(version: string, checked: boolean) {
    if (checked) {
      setCheckedVersions([
        ...checkedVersions,
        version,
      ]);
    } else {
      setCheckedVersions(checkedVersions.filter((v1) => {
        return version !== v1;
      }));
    }
  }

  function onConfirm_VersionsDrawer() {
    setDrawerVisible(false);
    onClickLicense && onClickLicense(checkedVersions);
  }

  return (<>
    <div className={styles.Policy}>
      <div style={{ height: 10 }} />
      <div className={styles.PolicyName}>
        <Space size={10}>
          <span>{fullInfo.policyName}</span>
        </Space>

        {
          canSign && (<FComponentsLib.FRectBtn
            size='small'
            onClick={() => {
              if (allVersions.length > 0) {
                setDrawerVisible(true);
              } else {
                onClickLicense && onClickLicense([]);
              }

            }}
          >获取授权</FComponentsLib.FRectBtn>)
        }

      </div>
      <div style={{ height: 10 }} />
      <div style={{ padding: '0 20px' }}>
        <FPolicyDisplay
          fullInfo={fullInfo}
        />
      </div>
      <a
        className={styles.PolicyFullScreenBtn}
        onClick={() => {
          setFullScreenVisible(true);
        }}
      ><FComponentsLib.FIcons.FFullScreen style={{ fontSize: 12 }} /></a>
    </div>

    <FModal
      title={null}
      open={fullScreenVisible}
      onCancel={() => {
        setFullScreenVisible(false);
      }}
      width={1240}
      footer={null}
      centered
    >
      <div className={styles.ModalTile}>
        <FComponentsLib.FTitleText text={fullInfo.policyName} type='h2' />
        <div style={{ width: 20 }} />
        <FComponentsLib.FRectBtn
          size='small'
          onClick={() => {
            if (allVersions.length > 0) {
              setDrawerVisible(true);
            } else {
              onClickLicense && onClickLicense([]);
            }
          }}
        >获取授权</FComponentsLib.FRectBtn>
      </div>
      <div style={{ padding: '0 20px' }}>
        <FPolicyDisplay
          containerHeight={770}
          // code={code}
          fullInfo={fullInfo}
        />
      </div>
    </FModal>

    <FDrawer
      // visible={drawerVisible}
      open={drawerVisible}
      width={720}
      title={'获取授权'}
      topRight={<Space size={30}>
        <FComponentsLib.FTextBtn
          type='default'
          onClick={() => {
            onCancel_VersionsDrawer();
          }}
        >取消</FComponentsLib.FTextBtn>

        <FComponentsLib.FRectBtn
          type='primary'
          disabled={checkedVersions.length === 0}
          onClick={onConfirm_VersionsDrawer}
        >签约</FComponentsLib.FRectBtn>
      </Space>}
      afterOpenChange={onChange_VersionsDrawer_Visible}
    >
      <div className={styles.versionDrawerTip}>当前依赖资源被以下版本所用，请确认新合约应用的版本范围</div>
      <div style={{ height: 25 }} />
      <Space size={5}>
        <FCheckbox
          checked={checkedVersions.length === allVersions.length}
          indeterminate={checkedVersions.length !== allVersions.length && checkedVersions.length !== 0}
          onChange={(e) => {
            onChange_SelectAllCheckbox(e.target.checked);
          }}
        />
        <FComponentsLib.FContentText text={'全选'} type='highlight' />
      </Space>
      <div style={{ height: 10, borderBottom: '1px solid #E5E7EB' }} />
      {
        allVersions.map((version) => {
          return (<div key={version} className={styles.versionDrawerVersions}>
            <Space size={5}>
              <FCheckbox
                checked={checkedVersions.includes(version)}
                onChange={(e) => {
                  onChange_VersionSelected(version, e.target.checked);
                }}
              />
              <FComponentsLib.FContentText text={version} type='highlight' />
            </Space>
          </div>);
        })
      }

    </FDrawer>
  </>);
}


export default FContract_AvailablePolicy_Card;
