import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FServiceAPI } from '@freelog/tools-lib';
import { Fragment } from 'react';

type HandledOperationCategories = {
  id: string;
  code: string;
  name: string;
  parentID: string;
  depth: number;
}[];

interface FOperationCategoryFilterProps {
  value: string[];

  onChange?(value: string[]): void;
}

function FOperationCategoryFilter({ value: selectedOperationCategoryIDs, onChange }: FOperationCategoryFilterProps) {

  const [operationCategories, set_operationCategories] = React.useState<HandledOperationCategories>([]);
  // const [selectedOperationCategoryIDs, set_selectedOperationCategoryIDs] = React.useState<string[]>(['#all']);

  AHooks.useMount(async () => {
    const { data: data_operationCategories }: { data: any[] } = await FServiceAPI.Operation.operationCategories();
    const payload: HandledOperationCategories = [];
    flatOperationCategories(data_operationCategories, '', 0, payload);
    // console.log(payload, 'payloadoisdlfkjsd;lkfjodsijflksdjflkjl');
    set_operationCategories(payload);
  });

  function onClick(str: string) {
    const id: string = '/' + selectedOperationCategoryIDs.join('/');
    if (str === id) {
      return;
    }
    const hasChildren: boolean = operationCategories.some((c) => {
      return c.parentID === str;
    });
    const arr: string[] = str.split('/').filter((code) => {
      return code !== '';
    });
    if (hasChildren) {
      arr.push('#all');
    }
    onChange && onChange(arr);
    // return arr;
  }

  return (<div className={styles.styles}>

    {
      selectedOperationCategoryIDs.map((code, index) => {


        const selectedOperationCategoryIDString: string = '/' + selectedOperationCategoryIDs.join('/');

        const data: HandledOperationCategories = operationCategories.filter((c) => {
          return c.depth === index;
        });

        if (index === 0) {
          return (<div className={styles.level0} key={index}>
            {
              data.map((d) => {

                if (!selectedOperationCategoryIDString.startsWith(d.parentID)) {
                  // return <React.Fragment key={d.id} />;
                  return null;
                }
                return (<div
                  key={d.id}
                  className={[styles.level0Item,
                    operationCategories.some((c) => {
                      return c.parentID === d.id;
                    }) ? styles.hasChildren : '',
                    selectedOperationCategoryIDString.startsWith(d.id) ? styles.active : ''].join(' ')}
                  onClick={() => {
                    // set_selectedOperationCategoryIDs(stringToIDs(d.id));
                    onClick(d.id);
                  }}
                >
                  <span>{d.name}</span>
                </div>);
              })
            }
          </div>);
        }

        if (index === 1) {
          // const parentID: string = selectedOperationCategoryIDString.replaceAll('/#all', '');

          return (<div className={styles.level1} key={index}>
            {
              data.map((d) => {

                if (!selectedOperationCategoryIDString.startsWith(d.parentID)) {
                  // return (<React.Fragment key={d.id} />);
                  return null;
                }

                return (<div
                  className={[styles.level1Item, selectedOperationCategoryIDString.startsWith(d.id) ? styles.active : ''].join(' ')}
                  key={d.id}
                  onClick={() => {
                    // set_selectedOperationCategoryIDs(stringToIDs(d.id));
                    // onChange && onChange(stringToIDs(d.id));
                    onClick(d.id);
                  }}
                >{d.name}</div>);
              })
            }
          </div>);
        }

        if (index === 2) {
          return (<div className={styles.level2} key={index}>
            {
              data.map((d) => {
                if (!selectedOperationCategoryIDString.startsWith(d.parentID)) {
                  // return (<React.Fragment key={d.id}/>);
                  return null;
                }
                return (<div
                  key={d.id}
                  className={[styles.level2Item, selectedOperationCategoryIDString.startsWith(d.id) ? styles.active : ''].join(' ')}
                  onClick={() => {
                    // set_selectedOperationCategoryIDs(stringToIDs(d.id));
                    // onChange && onChange(stringToIDs(d.id));
                    onClick(d.id);
                  }}
                >{d.name}</div>);
              })
            }
          </div>);
        }
        return null;
      })
    }

  </div>);
}

export default FOperationCategoryFilter;

type OperationCategories = {
  children: OperationCategories;
  code: string;
  name: string;
}[];

function flatOperationCategories(operationCategories: OperationCategories, parentID: string, depth: number, payload: HandledOperationCategories) {
  if (operationCategories.length > 0) {
    payload.push({
      id: `${parentID}/#all`,
      code: '#all',
      name: '全部',
      parentID: parentID,
      depth: depth,
    });
  }
  for (const operationCategory of operationCategories) {
    const currentID: string = `${parentID}/${operationCategory.code}`;
    payload.push({
      id: currentID,
      code: operationCategory.code,
      name: operationCategory.name,
      parentID: parentID,
      depth: depth,
    });
    flatOperationCategories(operationCategory.children, currentID, depth + 1, payload);
  }
}
