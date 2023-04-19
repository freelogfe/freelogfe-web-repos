import * as React from 'react';
import styles from './index.less';
import { AutoComplete, Cascader, Dropdown, Input, Menu } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';

// import { ListSimpleByParentCode } from '../../../../@freelog/tools-lib/src/service-API/resources';

interface Option {
  value: string | number;
  label: string;
  values: Array<string | number>;
  labels: string[];
  children: Option[];
}

interface ServerData {
  code: string;
  name: string;
  children: ServerData[];
}

interface FResourceTypeInputProps {
  value: {
    value: string | number;
    label: string;
    values: Array<string | number>;
    labels: string[];
    customInput?: string;
  } | null;

  // useKey?: 'code' | 'name';

  onChange?(value: Option, selectedOptions: Option[]): void;
}

interface FResourceTypeInputStates {
  mode: 'select' | 'input';
  options: Option[];
  isOpen: boolean;
  selectedCache: {
    value: string | number;
    label: string;
    values: Array<string | number>;
    labels: string[];
  } | null;
  autoCompleteOptions: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
    count: number;
  }[];
  autoCompleteInput: string;
}

const initStates: FResourceTypeInputStates = {
  mode: 'select',
  options: [],
  isOpen: false,
  selectedCache: null,
  autoCompleteOptions: [],
  // autoCompleteInputStarWith: '',
  autoCompleteInput: '',
};

function FResourceTypeInput({ value, onChange }: FResourceTypeInputProps) {

  // const refAutoComplete = React.useRef(null);

  const [mode, set_mode] = React.useState<FResourceTypeInputStates['mode']>(initStates['mode']);
  const [isOpen, set_isOpen] = React.useState<FResourceTypeInputStates['isOpen']>(initStates['isOpen']);
  const [options, set_options] = React.useState<FResourceTypeInputStates['options']>(initStates['options']);
  const [selectedCache, set_selectedCache] = React.useState<FResourceTypeInputStates['selectedCache']>(initStates['selectedCache']);
  const [autoCompleteOptions, set_autoCompleteOptions] = React.useState<FResourceTypeInputStates['autoCompleteOptions']>(initStates['autoCompleteOptions']);
  // const [autoCompleteInputStarWith, set_autoCompleteInputStarWith] = React.useState<FResourceTypeInputStates['autoCompleteInputStarWith']>(initStates['autoCompleteInputStarWith']);
  const [autoCompleteInput, set_autoCompleteInput] = React.useState<FResourceTypeInputStates['autoCompleteInput']>(initStates['autoCompleteInput']);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    const options: Option[] = handledData(data_resourceTypes, null);
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  // console.log(autoCompleteInput, 'autoCompleteInput sd9ifoj;sldkfjsdlfjlkj');

  function onDropdownChange(option: Option, options: Option[]) {
    onChange && onChange(option, options);
    set_isOpen(false);
  }

  async function onDropdownClickCustom({ value, values, label, labels }: {
    value: string | number;
    label: string;
    values: Array<string | number>;
    labels: string[];
  }) {
    // console.log(labels, 'labelsiosdjflksjdlkfjsldkjl');
    set_isOpen(false);
    set_mode('input');
    set_selectedCache({
      value,
      values,
      label,
      labels,
    });

    const startWidth: string = [...labels, ''].join('/');
    // set_autoCompleteInputStarWith(startWidth);
    set_autoCompleteInput(startWidth);

    const { data: data_list }: {
      data: {
        code: string;
        name: string;
        resourceCount: number;
      }[];
    } = await FServiceAPI.Resource.ListSimpleByParentCode({
      parentCode: String(value),
      // parentCode: 'RT005',
    });

    // console.log(data_list, 'dataojdslkfjlksdjfl sdflkajsdlkfjksldjfl');
    // console.log(startWidth, 'startWidth sdiofjsldkjflsdjflkjlkj');
    //
    // const op: FResourceTypeInputStates['autoCompleteOptions'] = [];
    //
    // if (!data_list.some((l) => {
    //   return startWidth + l.name === autoCompleteInput;
    // })) {
    //   op.push({
    //     value: '#input',
    //     label: (<div className={styles.autoCompleteOption}>
    //       <span>{startWidth}</span>
    //       {/*<FComponentsLib.FContentText text={`${l.resourceCount}个资源`} type={'additional2'} />*/}
    //       <FComponentsLib.FTextBtn type={'primary'}>添加新类型</FComponentsLib.FTextBtn>
    //     </div>),
    //   });
    // }

    set_autoCompleteOptions(data_list.map((l) => {
      return {
        value: l.code,
        label: l.name,
        values: [l.code],
        labels: [...labels, l.name],
        count: l.resourceCount,
      };
    }));
  }

  if (mode === 'input' && selectedCache) {
    return (<AutoComplete
      // ref={refAutoComplete}
      autoFocus={true}
      allowClear={true}
      defaultOpen={true}
      options={autoCompleteOptions.map((aco) => {
        return {
          value: aco.value,
          label: (<div className={styles.autoCompleteOption}>
            <span>{aco.labels.join('/')}</span>
            <FComponentsLib.FContentText
              text={`${aco.count}个资源`}
              type={'additional2'}
            />
          </div>),
          data: aco,
        };
      })}
      style={{ width: 360 }}
      // onSelect={onSelect}
      // onSearch={onSearch}
      value={autoCompleteInput}
      className={styles.AutoComplete}
      filterOption={(inputValue, option: any) => {
        // console.log(inputValue, option);
        return option.data.labels.join('/').startsWith(inputValue);
      }}
      onChange={(value) => {
        // console.log(value, selectedCache, 'selectedCache  valuesdlkfjsldkj');
        const startStr: string = [...selectedCache.labels, ''].join('/');
        if (!value.startsWith(startStr)) {
          return;
        }

        set_autoCompleteInput(value);
      }}
      onSelect={(value: any, op: any) => {
        const data: FResourceTypeInputStates['autoCompleteOptions'][number] = op.data;
        // console.log(value, option, 'value : any sdfoisdjf lskdjlkj');
        onChange && onChange({
          value: data.value,
          label: data.label,
          values: data.values,
          labels: data.labels,
          children: [],
        }, []);
        set_mode('select');
        // set_isOpen(false);
      }}
      onClear={() => {

      }}
    >
      <FInput
        // value={'autoCompleteInput'}
        style={{ width: 360 }}
      />
    </AutoComplete>);
  }

  return (<Dropdown
    // open={true}
    open={isOpen}
    onOpenChange={(o) => {
      set_isOpen(o);
    }}
    trigger={['click']}
    overlayClassName={styles.overlayClassName}
    overlay={(<div className={styles.overlay}>
      <div className={styles.recommend}>
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('createresource_selectresourcetype_input_hint2')}
          type={'additional2'}
        />
        <div style={{ height: 20 }} />
        <div className={styles.recommendResourceTypes}>
          <label>阅读/文本</label>
          <label>阅读/演示文稿</label>
          <label>音频/有声书</label>
          <label>音频/播客</label>
          <label>视频/长视频</label>
          <label>视频/短视频</label>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('createresource_selectresourcetype_input_hint3')}
          type={'additional2'}
        />
      </div>
      <div style={{ height: 20 }} />
      <div className={styles.FCascader}>
        {
          options.map((o0) => {
            return (<div
              className={styles.item}
              key={o0.value}
              onClick={() => {
                if (o0.children.length === 0) {
                  // console.log(o0, 'ds90ifjal;skdfj;lksdjflksdjklfjsdklj');
                  // onChange && onChange(o0, [o0]);
                  // set_isOpen(false);
                  onDropdownChange(o0, [o0]);
                }
              }}
            >
              <span>{o0.label}</span>
              {
                o0.children.length > 0 && (<>
                  <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />
                  <div className={styles.itemChildren}>
                    {
                      o0.children.map((o1, o1Index, data) => {
                        return (<React.Fragment key={o1.value}>
                          <div
                            className={styles.item}
                            onClick={() => {
                              if (o1.children.length === 0) {
                                // console.log(o1, 'ds90ifjal;skdfj;lksdjflksdjklfjsdklj');
                                // onChange && onChange(o1, [o0, o1]);
                                // set_isOpen(false);
                                onDropdownChange(o1, [o0, o1]);
                              }
                            }}
                          >
                            <span>{o1.label}</span>
                            {
                              o1.children.length > 0 && (<>
                                <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />
                                <div className={styles.itemChildren}>
                                  {
                                    o1.children.map((o2) => {
                                      return (<React.Fragment key={o2.value}>
                                        <div
                                          className={styles.item}
                                          onClick={() => {
                                            if (o2.children.length === 0) {
                                              // console.log(2, 'ds90ifjal;skdfj;lksdjflksdjklfjsdklj');
                                              // onChange && onChange(o2, [o0, o1, o2]);
                                              // set_isOpen(false);
                                              onDropdownChange(o2, [o0, o1, o2]);
                                            }
                                          }}
                                        >
                                          <span>{o2.label}</span>
                                        </div>

                                        {
                                          o1Index + 1 === data.length && (<div
                                            className={styles.item + ' ' + styles.itemLatest}
                                            onClick={() => {
                                              // set_mode('input');
                                              // set_selectedCache({
                                              //   value: o1.value,
                                              //   values: o1.values,
                                              //   label: o1.label,
                                              //   labels: o1.labels,
                                              // });
                                              // set_autoCompleteInput([...o1.labels, ''].join('/'));
                                              onDropdownClickCustom({
                                                value: o1.value,
                                                values: o1.values,
                                                label: o1.label,
                                                labels: o1.labels,
                                              });
                                            }}
                                          >
                                            <span>添加新类型</span>
                                          </div>)
                                        }
                                      </React.Fragment>);
                                    })
                                  }

                                </div>
                              </>)
                            }
                          </div>
                          {
                            o1Index + 1 === data.length && (<div
                              className={styles.item + ' ' + styles.itemLatest}
                              onClick={() => {
                                // set_mode('input');
                                // set_selectedCache({
                                //   value: o0.value,
                                //   values: o0.values,
                                //   label: o0.label,
                                //   labels: o0.labels,
                                // });
                                // set_autoCompleteInput([...o0.labels, ''].join('/'));
                                onDropdownClickCustom({
                                  value: o0.value,
                                  values: o0.values,
                                  label: o0.label,
                                  labels: o0.labels,
                                });
                              }}
                            >
                              <span>添加新类型</span>
                            </div>)
                          }
                        </React.Fragment>);
                      })
                    }
                  </div>
                </>)
              }
            </div>);
          })
        }
      </div>
    </div>)}
  >
    <div className={styles.square} style={{ borderColor: isOpen ? '#2784FF' : '#D4D4D4' }}>
      {
        value === null
          ? (<span>选择类型</span>)
          : (<FComponentsLib.FContentText text={value.labels.join(' / ')} type={'normal'} />)
      }

      {
        isOpen
          ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
      }
    </div>

  </Dropdown>);

  // return (<Cascader
  //   allowClear={true}
  //   value={value}
  //   options={options}
  //   onChange={(value: Array<string | number> | undefined, selectedOptions) => {
  //     // console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
  //     if (!value) {
  //       onChange && onChange([], []);
  //       return;
  //     }
  //     onChange && onChange(value, selectedOptions as Option[]);
  //   }}
  //   placeholder='Please select'
  // />);
}

export default FResourceTypeInput;


function handledData(data: ServerData[], parent: Option | null): Option[] {
  const result: Option[] = data.map((d) => {
    const res: Option = {
      value: d.code,
      label: d.name,
      values: [
        ...(parent?.values || []),
        d.code,
      ],
      labels: [
        ...(parent?.labels || []),
        d.name,
      ],
      children: [],
    };

    return {
      ...res,
      children: handledData(d.children, res),
    };
  });
  if (result.length === 0) {
    return [];
  }
  return [
    // {
    //   value: '#all',
    //   label: '全部',
    //   children: [],
    // },
    ...result,
    // {
    //   value: '#custom',
    //   label: '添加新类型',
    //   children: [],
    // },
  ];
}

// export async function codeToCodes(code: string): Promise<Option[]> {
//   const { data: data_resourceTypes }: {
//     data: ServerData[];
//   } = await FServiceAPI.Resource.resourceTypes();
//   const arr: Option[] = [];
//   ha(code, data_resourceTypes, arr);
//   return arr;
// }
//
// function ha(code: string, data: ServerData[], payload: Option[]) {
//   const da: ServerData | undefined = data.find((d) => {
//     return code.startsWith(d.code);
//   });
//   if (!da) {
//     return;
//   }
//   payload.push({
//     value: da.code,
//     label: da.name,
//     children: [],
//   });
//   ha(code, da.children, payload);
// }
