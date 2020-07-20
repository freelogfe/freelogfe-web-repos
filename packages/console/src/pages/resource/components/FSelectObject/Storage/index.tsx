import * as React from 'react';
import styles from "./index.less";
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";

interface StorageProps {
  onSelect?: (resource: any) => void;
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
        [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i: number) => (
          <div key={i} className={styles.bucket}>
            <div>
              <FContentText text={`bucket${i}/xxx.png`}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={'资源类型 image | 更新时间 2019.02.10 12:12'}/>
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
