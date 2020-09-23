import * as React from 'react';
import {Divider, Popover, Space} from "antd";
import {StorageObjectEditorModelState} from "@/models/storageObjectEditor";
import styles from "./index.less";
import {FContentText} from "@/components/FText";
import {ArrowUpOutlined} from '@ant-design/icons';
import {FCircleButton} from '@/components/FButton';

interface DepsCardsProps {
  title: string;
  dataSource: StorageObjectEditorModelState['depRs'] | StorageObjectEditorModelState['depOs'];

  onDelete?(name: string): void;
}

function DepsCards({dataSource, title, onDelete}: DepsCardsProps) {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
  // console.log(JSON.stringify(dataSource), 'fdsdataSource3wq980');
  return (<div
    className={styles.DepsCards}
    ref={(div) => setRef(div)}
  >
    <div style={{height: 30}}/>
    <FContentText text={title}/>
    <div style={{height: 15}}/>
    <div className={styles.resources}>
      {
        (dataSource as any).map((d: any) => (<div key={d.name} className={styles.resource}>
          <div className={styles.resourceLeft}>
            <div className={styles.resourceTitle}>
              <FContentText
                singleRow={true}
                text={d.name}
                className={styles.resourceName}
              />
              {d.status === 0 && <span className={styles.notOnline}>未上线</span>}
            </div>
            <div style={{height: 9}}/>
            <div className={styles.resourceInfo}>
              <FContentText type="additional2">{d.type || '未设置类型'}</FContentText>
              {
                d.version && (<>
                  <Divider type="vertical"/>
                  <FContentText type="additional2">版本范围：{d.version}</FContentText>
                </>)
              }

              {
                d.baseUpthrows?.length > 0 && (<>
                  <Divider type="vertical"/>
                  {ref && <Popover
                    getPopupContainer={(triggerNode) => {
                      return ref || document.body;
                    }}
                    content={<BasisUpthrows dataSource={d.baseUpthrows}/>}
                  >
                    <div><FContentText type="additional2">{d.baseUpthrows.length}个基础上抛</FContentText></div>
                  </Popover>
                  }
                </>)
              }

            </div>
          </div>
          <div className={styles.resourceRight}>
            <FCircleButton
              theme="delete"
              onClick={() => onDelete && onDelete(d.name)}
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
