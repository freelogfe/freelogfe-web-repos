import * as React from 'react';
import styles from "./index.less";
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";

export interface ResourceObject {
  id: string;
  name: string;
  size: number;
  path: string;
  type: string;
  time: string;
}

interface StorageProps {
  onSelect?: (resource: ResourceObject) => void;
}

export default function ({onSelect}: StorageProps) {

  const [select, setSelect] = React.useState([
    {text: '全部Bucket', value: '-1'},
    {value: 'bucket1'},
    {value: 'bucket2'},
    {value: 'bucket3'},
  ]);
  const [selected, setSelected] = React.useState<any>('-1');

  const [input, setInput] = React.useState<string>('');

  const [resourceObjects, setResourceObjects] = React.useState<ResourceObject[] | null>(null);

  React.useEffect(() => {
    setResourceObjects([
      {
        id: 'q12342',
        name: 'picture.png',
        size: 1234190,
        path: 'buckt1/1234.png',
        time: '2019-12-22 12:22',
        type: 'image'
      },
      {
        id: 'q12343',
        name: 'picture2.png',
        size: 634532,
        path: 'buckt2/1234.png',
        time: '2019-12-22 23:00',
        type: 'image'
      },
    ])
  }, []);

  return (
    <div className={styles.SelectBucket}>
      <div className={styles.filter}>
        <div className={styles.filterSelect}>
          <FDropdown
            options={select}
            text={selected === '-1' ? select[0].text : selected}
            onChange={(value) => setSelected(value)}
          />
        </div>

        <FInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.filterInput}
          theme="dark"
          size="small"
        />
      </div>

      <div style={{height: 17}}/>

      {
        (resourceObjects || []).map((i: ResourceObject) => (
          <div key={i.id} className={styles.bucket}>
            <div>
              <FContentText text={i.path}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={`资源类型 ${i.type} | 更新时间 ${i.time}`}/>
            </div>
            <FNormalButton
              theme="weaken"
              onClick={() => onSelect && onSelect(i)}
            >选择</FNormalButton>
          </div>
        ))
      }
    </div>
  );
}
