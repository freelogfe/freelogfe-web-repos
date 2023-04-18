import * as React from 'react';
import styles from './index.less';
import { Cascader, Dropdown, Menu } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

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
  } | null;
  useKey?: 'code' | 'name';

  onChange?(value: Option, selectedOptions: Option[]): void;
}

interface FResourceTypeInputStates {
  options: Option[];
  isOpen: boolean;
}

const initStates: FResourceTypeInputStates = {
  options: [],
  isOpen: false,
};

function FResourceTypeInput({ value, useKey = 'code', onChange }: FResourceTypeInputProps) {

  const [options, set_options] = React.useState<FResourceTypeInputStates['options']>(initStates['options']);
  const [isOpen, set_isOpen] = React.useState<FResourceTypeInputStates['isOpen']>(initStates['isOpen']);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    const options: Option[] = handledData(data_resourceTypes, null);
    // console.log(options, 'options哦i圣诞节二零');
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  return (<Dropdown
    // open={true}
    open={isOpen}
    onOpenChange={(o) => {
      set_isOpen(o);
    }}
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
                  onChange && onChange(o0, [o0]);
                  set_isOpen(false);
                }
              }}
            >
              <span>{o0.label}</span>
              {
                o0.children.length > 0 && (<>
                  <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />
                  <div className={styles.itemChildren}>
                    {
                      o0.children.map((o1) => {
                        return (<div
                          key={o1.value}
                          className={styles.item}
                          onClick={() => {
                            if (o1.children.length === 0) {
                              // console.log(o1, 'ds90ifjal;skdfj;lksdjflksdjklfjsdklj');
                              onChange && onChange(o1, [o0, o1]);
                              set_isOpen(false);
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
                                    return (<div
                                      key={o2.value}
                                      className={styles.item}
                                      onClick={() => {
                                        if (o2.children.length === 0) {
                                          // console.log(2, 'ds90ifjal;skdfj;lksdjflksdjklfjsdklj');
                                          onChange && onChange(o2, [o0, o1, o2]);
                                          set_isOpen(false);
                                        }
                                      }}
                                    >
                                      <span>{o2.label}</span>
                                    </div>);
                                  })
                                }

                              </div>
                            </>)
                          }
                        </div>);
                      })
                    }

                    {/*<div className={styles.item}>*/}
                    {/*  <span>插件</span>*/}
                    {/*  */}
                    {/*</div>*/}
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
