import * as React from 'react';
import styles from './index.less';
import {Drawer, Space} from "antd";
import {FContentText, FTitleText} from "@/components/FText";
import FInput from "@/components/FInput";
import {FCircleButton, FNormalButton, FTextButton} from "@/components/FButton";
import {CUSTOM_KEY} from "@/utils/regexp";
import {Data} from "@/components/FCustomProperties";

interface FBasePropsEditorDrawerProps {
  visible: boolean;
  dataSource: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];
  disabledKeys: string[];

  onChange?(value: FBasePropsEditorDrawerProps['dataSource']): void

  onConfirm?(): void;

  onCancel?(): void;
}

function FBasePropsEditorDrawer({visible, dataSource, disabledKeys, onChange, onConfirm, onCancel}: FBasePropsEditorDrawerProps) {

  function onChangeData(value: Partial<FBasePropsEditorDrawerProps['dataSource'][number]>, index: number) {
    const dd = dataSource.map((ds, i) => {
      if (i !== index) {
        return ds;
      }
      return {
        ...ds,
        ...value,
      };
    });
    onChange && onChange(verifyDuplication(dd));
  }


  function verifyDuplication(data: FBasePropsEditorDrawerProps['dataSource']) {
    const map: Map<string, number> = new Map<string, number>(disabledKeys.map((dk) => {
      return [dk, 1];
    }));
    for (const item of data) {
      if (item.key === '') {
        continue;
      }
      if (map.has(item.key)) {
        map.set(item.key, map.get(item.key) as number + 1)
      } else {
        map.set(item.key, 1);
      }
    }
    const errorText: string = '键不能重复';

    return data.map((d) => {
      if (d.keyError && d.keyError !== errorText) {
        return d;
      }
      // console.log(d.key, map.get(d.key), '9812347928137');
      return {
        ...d,
        keyError: (map.has(d.key) && map.get(d.key) !== 1) ? errorText : '',
      };
    });
  }

  return (<Drawer
    title={'补充属性'}
    onClose={() => {
      onCancel && onCancel();
    }}
    visible={visible}
    width={720}
    // className={styles}
    bodyStyle={{paddingLeft: 40, paddingRight: 40, height: 600, overflow: 'auto'}}
  >
    <Space
      size={30}
      direction="vertical"
      style={{width: '100%'}}
    >
      {
        dataSource.map((ds, index) => {
          return (<Space key={index} size={10}>
            <div className={styles.input}>
              <div className={styles.title}>
                <i className={styles.dot}/>
                <FTitleText type="form">key</FTitleText>
              </div>
              <div style={{height: 5}}/>
              <FInput
                value={ds.key}
                errorText={ds.keyError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let keyError: string = '';
                  if (value === '') {
                    keyError = '请输入';
                  } else if (value.length > 15) {
                    keyError = '不超过15个字符';
                  } else if (!CUSTOM_KEY.test(value)) {
                    keyError = `不符合${CUSTOM_KEY}`;
                  }
                  onChangeData({
                    key: value,
                    keyError: keyError,
                  }, index);
                }}
                placeholder={'输入key'}
              />
            </div>
            <div className={styles.input}>
              <div className={styles.title}>
                <i className={styles.dot}/>
                <FTitleText type="form">value</FTitleText>
              </div>
              <div style={{height: 5}}/>
              <FInput
                value={ds.value}
                errorText={ds.valueError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let valueError: string = '';
                  if (value === '') {
                    valueError = '请输入';
                  } else if (value.length > 30) {
                    valueError = '不超过30个字符';
                  }
                  onChangeData({
                    value: value,
                    valueError: valueError,
                  }, index);
                }}
                placeholder={'输入value'}
              />
            </div>
            <div className={styles.input}>
              <div className={styles.title}>
                <FTitleText type="form">属性说明</FTitleText>
              </div>
              <div style={{height: 5}}/>
              <FInput
                value={ds.description}
                errorText={ds.descriptionError}
                className={styles.input}
                onChange={(e) => {
                  const value: string = e.target.value;
                  let descriptionError: string = '';
                  if (value.length > 50) {
                    descriptionError = '不超过50个字符';
                  }
                  onChangeData({
                    description: value,
                    descriptionError: descriptionError,
                  }, index);
                }}
                placeholder={'输入属性说明'}
              />
            </div>
            <div>
              <div style={{height: 22}}/>
              <div className={styles.delete}>
                <FCircleButton
                  theme="delete"
                  onClick={() => {
                    onChange && onChange(dataSource.filter((eds, edsIndex) => {
                      return edsIndex !== index;
                    }));
                  }}
                />
              </div>
            </div>
          </Space>);
        })
      }
    </Space>

    {
      dataSource.length > 0 && (<div style={{height: 30}}/>)
    }

    <Space size={10}>
      <FCircleButton
        onClick={() => {
          onChange && onChange([
            ...dataSource,
            {
              key: '',
              keyError: '',
              value: '',
              valueError: '',
              description: '',
              descriptionError: '',
            },
          ]);
        }}
      />
      <FContentText
        text={'新增一项属性'}
      />
    </Space>

    <div style={{height: 120}}/>
    <div className={styles.footer}>
      <Space size={30}>
        <FTextButton
          onClick={() => {
            onCancel && onCancel()
          }}
        >取消</FTextButton>
        <FNormalButton
          disabled={!!dataSource.find((eds) => {
            return !eds.key || !!eds.keyError
              || !eds.value || !!eds.valueError
              || !!eds.descriptionError;
          })}
          onClick={() => {
            onConfirm && onConfirm();
          }}
          // disabled={editor.typeVerify === 1 || hasError}
          // onClick={async () => {
          //   await dispatch<UpdateObjectInfoAction>({
          //     type: 'storageObjectEditor/updateObjectInfo',
          //   });
          //   dispatch<UpdateAObjectAction>({
          //     type: 'storageHomePage/updateAObject',
          //     payload: {
          //       id: editor.objectId,
          //       type: editor.type,
          //     },
          //   });
          //   dispatch<ChangeAction>({
          //     type: 'storageObjectEditor/change',
          //     payload: {
          //       visible: false,
          //     }
          //   });
          // }}
        >确定</FNormalButton>
      </Space>
    </div>
  </Drawer>);
}

export default FBasePropsEditorDrawer;
