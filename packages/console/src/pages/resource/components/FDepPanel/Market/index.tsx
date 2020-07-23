import * as React from 'react';
import styles from "./index.less";
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import {FContentText} from "@/components/FText";
import {FNormalButton} from "@/components/FButton";
import {resourceTypes} from "@/utils/globals";
import {DepResources, FDepPanelProps} from "@/pages/resource/components/FDepPanel";

// export interface MarketResource {
//   readonly id: string;
//   readonly name: string;
//   readonly resourceType: string;
//   readonly time: string;
//   readonly versions: string[];
//   readonly enableReuseContracts: {
//     readonly id: string;
//     readonly title: string;
//     readonly status: 'executing' | 'stopped';
//     readonly code: string;
//     readonly date: string;
//     readonly versions: string[];
//   }[];
//   readonly enabledPolicies: {
//     readonly id: string;
//     readonly title: string;
//     readonly code: string;
//   }[];
//   readonly unresolved: MarketResource[];
// }

interface MarketProps {
  readonly addedResourceID?: string[];
  readonly onSelect?: (resource: DepResources) => void;
}

export default function ({onSelect, addedResourceID}: MarketProps) {

  const [select, setSelect] = React.useState<{ text?: string, value: string }[]>([
    {text: '全部类型', value: '-1'},
    ...resourceTypes.map((i) => ({value: i})),
  ]);
  const [selected, setSelected] = React.useState<any>('-1');

  const [input, setInput] = React.useState<string>('');

  const [resourceObjects, setResourceObjects] = React.useState<DepResources[] | null>(null);

  React.useEffect(() => {
    setResourceObjects([
      {
        id: '100',
        title: 'liukai/hahaha',
        resourceType: 'image',
        version: {
          isCustom: false,
          input: '',
          allowUpdate: true,
          select: '1.2.3',
        },
        versions: ['11.2.3', '1.2.3'],
        upthrow: false,
        enableReuseContracts: [{
          checked: true,
          title: '买奶粉',
          status: 'stopped',
          code: 'code',
          id: '1234',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }],
        enabledPolicies: [{
          checked: true,
          id: 'string',
          title: 'string',
          code: 'code',
        }],
        unresolved: [{
          id: '1234',
          title: 'liukai/hahaha',
          resourceType: 'image',
          version: {
            isCustom: false,
            input: '',
            allowUpdate: true,
            select: '1.2.3',
          },
          versions: ['11.2.3', '1.2.3'],
          upthrow: false,
          enableReuseContracts: [{
            checked: true,
            title: '买奶粉',
            status: 'stopped',
            code: 'code',
            id: '1234',
            date: '2013-12-22',
            versions: ['12.23.3', '1.42.3'],
          }],
          enabledPolicies: [{
            checked: true,
            id: 'string',
            title: 'string',
            code: 'code',
          }]
        }]
      }, {
        id: '101',
        title: 'liukai2/hahaha2',
        resourceType: 'image',
        version: {
          isCustom: false,
          input: '',
          allowUpdate: true,
          select: '1.2.3',
        },
        versions: ['11.2.3', '1.2.3'],
        upthrow: false,
        enableReuseContracts: [{
          checked: true,
          title: '买奶粉2',
          status: 'executing',
          code: 'code',
          id: '1234',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }, {
          checked: false,
          title: '买奶粉sd2',
          status: 'executing',
          code: 'code',
          id: '12342345',
          date: '2013-12-22',
          versions: ['12.23.3', '1.42.3'],
        }],
        enabledPolicies: [{
          checked: true,
          id: 'string',
          title: 'string',
          code: 'code',
        }, {
          checked: true,
          id: 'stringzd',
          title: 'hello',
          code: 'code',
        }],
        unresolved: [{
          id: '1234',
          title: 'liukai2/hahaha2',
          resourceType: 'image',
          version: {
            isCustom: false,
            input: '',
            allowUpdate: true,
            select: '1.2.3',
          },
          versions: ['11.2.3', '1.2.3'],
          upthrow: false,
          enableReuseContracts: [{
            checked: true,
            title: '买奶粉2',
            status: 'executing',
            code: 'code',
            id: '1234',
            date: '2013-12-22',
            versions: ['12.23.3', '1.42.3'],
          }, {
            checked: false,
            title: '买奶粉sd2',
            status: 'executing',
            code: 'code',
            id: '12342345',
            date: '2013-12-22',
            versions: ['12.23.3', '1.42.3'],
          }],
          enabledPolicies: [{
            checked: true,
            id: 'string',
            title: 'string',
            code: 'code',
          }, {
            checked: true,
            id: 'stringzd',
            title: 'hello',
            code: 'code',
          }]
        }, {
          id: '100',
          title: 'liukai/hahaha',
          resourceType: 'image',
          version: {
            isCustom: false,
            input: '',
            allowUpdate: true,
            select: '1.2.3',
          },
          versions: ['11.2.3', '1.2.3'],
          upthrow: false,
          enableReuseContracts: [{
            checked: true,
            title: '买奶粉',
            status: 'stopped',
            code: 'code',
            id: '1234',
            date: '2013-12-22',
            versions: ['12.23.3', '1.42.3'],
          }],
          enabledPolicies: [{
            checked: true,
            id: 'string',
            title: 'string',
            code: 'code',
          }],
        }]
      }
    ])
  }, []);

  // function onConfirm(i) {
  //
  // }

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
        resourceObjects?.map((i) => (
          <div key={i.id} className={styles.bucket}>
            <div>
              <FContentText text={i.title}/>
              <div style={{height: 2}}/>
              <FContentText type={'additional2'} text={`资源类型 ${i.resourceType} | 更新时间 ${i.time}`}/>
            </div>
            <FNormalButton
              theme="weaken"
              onClick={() => onSelect && onSelect(i)}
              disabled={addedResourceID?.includes(i.id)}
            >选择</FNormalButton>
          </div>
        ))
      }
    </div>
  );
}
