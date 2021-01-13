import * as React from 'react';
import styles from './index.less';
import {Space} from "antd";
import {FContentText} from '@/components/FText';
import {FTextButton} from '@/components/FButton';
import {FClose, FInfo} from "@/components/FIcons";
import FTooltip from "@/components/FTooltip";

interface FCustomOptionsCardProps {
  dataSource: {
    key: string;
    value: string;
    description: string;
    type: string;
  }[];

  // onChange?(value: FCustomOptionsCardProps['dataSource']): void;
  onDeleteKey?(value: string): void;
}

function FCustomOptionsCard({dataSource, onDeleteKey}: FCustomOptionsCardProps) {
  return (<Space className={styles.styles} size={20} direction="vertical">
    {
      dataSource.map((ds) => {
        return (<Space
          key={ds.key}
          size={10}
          direction="vertical"
        >
          <Space size={5}>
            <FContentText
              text={ds.key}
              type="additional2"
            />
            {
              ds.description ? (<FTooltip title={ds.description}><FInfo/></FTooltip>) : false
            }
            <FTextButton onClick={() => {
              onDeleteKey && onDeleteKey(ds.key)
            }}><FClose/></FTextButton>
          </Space>
          <div className={styles.content}>
            <div><FContentText text={ds.type}/></div>
            <div>|</div>
            <div><FContentText text={ds.value}/></div>
          </div>
        </Space>)
      })
    }

  </Space>);
}

export default FCustomOptionsCard;
