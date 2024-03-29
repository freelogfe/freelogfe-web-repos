import * as React from 'react';
import {Divider, Popover, Space} from 'antd';
import styles from './index.less';
import {ArrowUpOutlined} from '@ant-design/icons';
import FVersionHandlerPopover from "@/components/FVersionHandlerPopover";
import FResourceStatusBadge from "@/components/FResourceStatusBadge";
import FDivider from "@/components/FDivider";
import FComponentsLib from '@freelog/components-lib';

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
    linkTo: string;
  }[];

  // linkTo: string;

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
    <FComponentsLib.FContentText text={title}/>
    <div style={{height: 15}}/>
    <div className={styles.resources}>
      {
        dataSource.map((d, i: number) => (<div
          key={d.name}
          className={styles.resource}
        >
          <div className={styles.resourceLeft}>
            <Space size={8}>
              <FComponentsLib.FTextBtn
                onClick={() => window.open(d.linkTo)}
                // type="default"
              >
                <FComponentsLib.FContentText
                  type="highlight"
                  singleRow={true}
                  text={d.name}
                  className={styles.resourceName}
                />
              </FComponentsLib.FTextBtn>
              {d.status === 0 && (<FResourceStatusBadge status={'offline'}/>)}
            </Space>
            <div style={{height: 9}}/>
            <Space size={5} className={styles.resourceInfo}>
              <FComponentsLib.FContentText type="additional2">{d.type || '未设置类型'}</FComponentsLib.FContentText>
              {
                d.version && (<>
                  <FDivider style={{fontSize: 14}}/>
                  <Space size={5}>
                    <FComponentsLib.FContentText type="additional2">版本范围：{d.version}</FComponentsLib.FContentText>
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
                    ><FComponentsLib.FTextBtn><FComponentsLib.FIcons.FEdit style={{fontSize: 12}}/></FComponentsLib.FTextBtn></FVersionHandlerPopover>
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
                    <div><FComponentsLib.FContentText type="additional2">{d.baseUpthrows?.length || 0}个基础上抛</FComponentsLib.FContentText></div>
                  </Popover>
                  }
                </>)
              }

            </Space>
          </div>
          <div className={styles.resourceRight}>
            <FComponentsLib.FCircleBtn
              type="danger"
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
