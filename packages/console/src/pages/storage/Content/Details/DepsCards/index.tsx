import * as React from 'react';
import {Divider, Popover, Space} from 'antd';
import {StorageObjectEditorModelState} from '@/models/storageObjectEditor';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {ArrowUpOutlined} from '@ant-design/icons';
import {FCircleButton, FTextButton} from '@/components/FButton';
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import {FEdit} from "@/components/FIcons";
import {objectDetails, resourceDetails, resourceInfo} from "@/utils/path-assembler";

interface DepsCardsProps {
  title: string;
  // dataSource: StorageObjectEditorModelState['depRs'] | StorageObjectEditorModelState['depOs'];
  dataSource: {
    id: string;
    name: string;
    type: string;
    identity: 'resource' | 'object';
    version?: string;
    versions?: string[];
    status?: 0 | 1;
    baseUpthrows?: string[];
  }[];

  // onDelete?(name: string): void;
  onChange?(value: DepsCardsProps['dataSource']): void;
}

function DepsCards({dataSource, title, onChange}: DepsCardsProps) {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  // console.log(JSON.stringify(dataSource), 'fdsdataSource3wq980');

  function changeData(value: DepsCardsProps['dataSource']) {
    return onChange && onChange(value);
  }

  return (<div
    className={styles.DepsCards}
    ref={(div) => setRef(div)}
  >
    <div style={{height: 30}}/>
    <FContentText text={title}/>
    <div style={{height: 15}}/>
    <div className={styles.resources}>
      {
        dataSource.map((d, i: number) => (<div
          key={d.name}
          className={styles.resource}
        >
          <div className={styles.resourceLeft}>
            <div className={styles.resourceTitle}>
              <a href={d.identity === 'resource' ? resourceDetails({
                resourceID: d.id,
              }) : objectDetails({
                objectID: d.id,
              })}>
                <FContentText
                  singleRow={true}
                  text={d.name}
                  className={styles.resourceName}
                />
              </a>
              {d.status === 0 && <span className={styles.notOnline}>未上线</span>}
            </div>
            <div style={{height: 9}}/>
            <div className={styles.resourceInfo}>
              <FContentText type="additional2">{d.type || '未设置类型'}</FContentText>
              {
                d.version && (<>
                  <Divider type="vertical"/>
                  <Space size={5}>
                    <FContentText type="additional2">版本范围：{d.version}</FContentText>
                    <FVersionHandlerPopover
                      value={d.version}
                      versionOptions={d.versions || []}
                      onChange={(value: string) => {
                        changeData(dataSource.map((ds, index) => {
                          if (index !== i) {
                            return ds;
                          }
                          return {
                            ...ds,
                            version: value,
                          }
                        }));
                      }}
                    ><FTextButton><FEdit style={{fontSize: 12}}/></FTextButton></FVersionHandlerPopover>
                  </Space>
                </>)
              }

              {
                (d.baseUpthrows?.length || 0) > 0 && (<>
                  <Divider type="vertical"/>
                  {ref && <Popover
                    getPopupContainer={(triggerNode) => {
                      return ref || document.body;
                    }}
                    content={<BasisUpthrows dataSource={d.baseUpthrows || []}/>}
                  >
                    <div><FContentText type="additional2">{d.baseUpthrows?.length || 0}个基础上抛</FContentText></div>
                  </Popover>
                  }
                </>)
              }

            </div>
          </div>
          <div className={styles.resourceRight}>
            <FCircleButton
              theme="delete"
              onClick={() => {
                changeData(dataSource.filter((ds, index) => index !== i))
              }}
            />
          </div>
        </div>))
      }

    </div>
  </div>);
}

export default DepsCards;

interface BasisUpthrowsProps {
  dataSource: string[];
}

function BasisUpthrows({dataSource}: BasisUpthrowsProps) {
  return (
    <Space direction="vertical" size={10}>
      {
        dataSource.map((t) => (<div key={t}>
          <Space size={10}>
            <ArrowUpOutlined style={{color: '#EA7171'}}/>
            <span>{t}</span>
          </Space>
        </div>))
      }
    </Space>
  );
}
