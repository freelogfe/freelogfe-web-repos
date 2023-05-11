import * as React from 'react';
import styles from './index.less';
import { AutoComplete, Dropdown, Popover } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';
import FDropdown from '../../../../@freelog/components-lib/src/FDropdown';

interface Option {
  value: string;
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
    value: string;
    labels: string[];
    customInput?: string;
  } | null;

  onChange?(value: FResourceTypeInputProps['value']): void;
}

interface FResourceTypeInputStates {

  $options: Option[];
  $recommend: {
    value: string;
    labels: string[];
  }[];

  _mode: 'select' | 'input';
  _isOpen: boolean;
  _selectedCache: {
    value: string;
    label: string;
    values: Array<string | number>;
    labels: string[];
  } | null;
  _autoCompleteOptions: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
    count: number;
  }[];
  _autoCompleteOptionsOther: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
    count: number;
  }[];
  _autoCompleteInput: string;
  _autoCompleteInputIsNew: boolean;
}

const initStates: FResourceTypeInputStates = {
  $options: [],
  $recommend: [],
  _mode: 'select',
  _isOpen: false,
  _selectedCache: null,
  _autoCompleteOptions: [],
  _autoCompleteOptionsOther: [],
  // autoCompleteInputStarWith: '',
  _autoCompleteInput: '',
  _autoCompleteInputIsNew: false,
};

function FResourceTypeInput({ value, onChange }: FResourceTypeInputProps) {
  const ref = React.useRef<any>();
  // const refAutoComplete = React.useRef(null);

  const [$options, set$options] = React.useState<FResourceTypeInputStates['$options']>(initStates['$options']);
  const [$recommend, set$recommend] = React.useState<FResourceTypeInputStates['$recommend']>(initStates['$recommend']);
  const [_mode, set_mode] = React.useState<FResourceTypeInputStates['_mode']>(initStates['_mode']);
  const [_isOpen, set_isOpen] = React.useState<FResourceTypeInputStates['_isOpen']>(initStates['_isOpen']);
  const [_selectedCache, set_selectedCache] = React.useState<FResourceTypeInputStates['_selectedCache']>(initStates['_selectedCache']);
  const [_autoCompleteOptions, set_autoCompleteOptions] = React.useState<FResourceTypeInputStates['_autoCompleteOptions']>(initStates['_autoCompleteOptions']);
  const [_autoCompleteOptionsOther, set_autoCompleteOptionsOther] = React.useState<FResourceTypeInputStates['_autoCompleteOptionsOther']>(initStates['_autoCompleteOptionsOther']);
  // const [autoCompleteInputStarWith, set_autoCompleteInputStarWith] = React.useState<FResourceTypeInputStates['autoCompleteInputStarWith']>(initStates['autoCompleteInputStarWith']);
  const [_autoCompleteInput, set_autoCompleteInput] = React.useState<FResourceTypeInputStates['_autoCompleteInput']>(initStates['_autoCompleteInput']);
  const [_autoCompleteInputIsNew, set_autoCompleteInputIsNew] = React.useState<FResourceTypeInputStates['_autoCompleteInputIsNew']>(initStates['_autoCompleteInputIsNew']);

  AHooks.useMount(async () => {

    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes({
      category: 1,
      // @ts-ignore
      status: 1,
    });
    const options: Option[] = handledData(data_resourceTypes, null);
    set$options(options);
  });

  AHooks.useMount(async () => {
    const { data: data_recently }: {
      data: {
        code: string;
        name: string;
        names: string;
        resourceCount: number;
      }[];
    } = await FServiceAPI.Resource.listSimple4Recently({});
    // console.log(data_recently, 'dataoisdjlfkjsdlkfjsdlkjflkj');
    set$recommend(data_recently
      .filter((r, i) => {
        return i < 6;
      })
      .map<FResourceTypeInputStates['$recommend'][number]>((r) => {
        return {
          value: r.code,
          labels: r.names.split('/'),
        };
      }));
  });

  AHooks.useUnmount(() => {

  });

  AHooks.useDebounceEffect(
    () => {
      // console.log(_autoCompleteInput, 'a9s8idofjhoilsdjflkjsdlfjlkj');
      (async () => {

        // console.log(_autoCompleteInput, '_autoCompleteInputisdjflksdjflksdjflkjl');
        if (_autoCompleteInput === '' || _autoCompleteInput.endsWith('/')) {
          set_autoCompleteOptions([]);
          set_autoCompleteOptionsOther([]);
          return;
        }
        const search: string[] = _autoCompleteInput.split('/');

        const { data: data_list }: {
          data: {
            code: string;
            name: string;
            names: string;
            resourceCount: number;
          }[];
        } = await FServiceAPI.Resource.ListSimpleByParentCode({
          // parentCode: String(value),
          parentCode: _selectedCache?.value || '',
          category: 1,
          name: search[search.length - 1],
          // @ts-ignore
          isTerminate: true,
        });

        set_autoCompleteOptions(data_list.map((l) => {
          return {
            value: l.code,
            label: l.name,
            values: [l.code],
            labels: l.names.split('/'),
            count: l.resourceCount,
          };
        }));

        const { data: data_list1 }: {
          data: {
            code: string;
            name: string;
            names: string;
            resourceCount: number;
          }[];
        } = await FServiceAPI.Resource.ListSimpleByParentCode({
          parentCode: _selectedCache?.value || '',
          category: 1,
          name: search[search.length - 1],
          excludeParentCode: true,
          // @ts-ignore
          isTerminate: true,
        });

        set_autoCompleteOptionsOther(data_list1.map((l) => {
          return {
            value: l.code,
            label: l.name,
            values: [l.code],
            labels: l.names.split('/'),
            count: l.resourceCount,
          };
        }));
      })();
    },
    [_autoCompleteInput],
    {
      wait: 300,
    },
  );

  function init() {
    set_mode(initStates['_mode']);
    set_isOpen(initStates['_isOpen']);
    set_selectedCache(initStates['_selectedCache']);
    set_autoCompleteOptions(initStates['_autoCompleteOptions']);
    set_autoCompleteInput(initStates['_autoCompleteInput']);
    set_autoCompleteInputIsNew(initStates['_autoCompleteInputIsNew']);
  }

  // console.log(autoCompleteInput, 'autoCompleteInput sd9ifoj;sldkfjsdlfjlkj');

  function onDropdownChange(v: {
    value: string;
    labels: string[];
  }) {
    onChange && onChange({
      value: v.value,
      labels: v.labels,
    });
    set_isOpen(false);
  }

  async function onDropdownClickCustom({ value, values, label, labels }: {
    value: string;
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
  }

  if (_mode === 'input' && _selectedCache) {
    return (<AutoComplete
      autoFocus={true}
      allowClear={true}
      defaultOpen={true}
      options={[
        ...(_autoCompleteInputIsNew ? [
          {
            value: '#new',
            label: (<div className={styles.autoCompleteOption}>
              <span>{_autoCompleteInput}</span>
              {/*<FComponentsLib.FTextBtn>添加新类型</FComponentsLib.FTextBtn>*/}
              <FComponentsLib.FTextBtn>{FI18n.i18nNext.t('createresource_selectresourcetype_btn_addthis')}</FComponentsLib.FTextBtn>
            </div>),
            data: {
              value: '#new',
              label: '',
              values: [],
              labels: _autoCompleteInput.split('/'),
            },
          },
        ] : []),
        ..._autoCompleteOptions.map((aco) => {
          return {
            value: aco.value,
            label: (<div className={styles.autoCompleteOption}>
              <span>{aco.labels.join('/')}</span>
              <FComponentsLib.FContentText
                // text={`${aco.count}个资源`}
                text={FI18n.i18nNext.t('createresource_selectresourcetype_input_resourceqty', {
                  ResourceQty: aco.count,
                })}
                type={'additional2'}
              />
            </div>),
            data: aco,
          };
        }),
        ..._autoCompleteOptionsOther.map((aco) => {
          return {
            value: aco.value,
            label: (<div className={styles.autoCompleteOption}>
              <span>{aco.labels.join('/')}</span>
              <FComponentsLib.FContentText
                // text={`${aco.count}个资源`}
                text={FI18n.i18nNext.t('createresource_selectresourcetype_input_resourceqty', {
                  ResourceQty: aco.count,
                })}
                type={'additional2'}
              />
            </div>),
            data: aco,
          };
        }),
      ]}
      style={{ width: 360 }}
      value={_autoCompleteInput}
      className={styles.AutoComplete}
      // filterOption={(inputValue, option: any) => {
      //   return option.data.labels[option.data.labels.length - 1].length <= 40 && option.data.labels.join('/').startsWith(inputValue);
      // }}
      onChange={(value: string) => {
        // console.log(value, 'value 908wieojfklsdfjasldkfjlkj');
        if (!value) {
          return;
        }
        const startStr: string = [..._selectedCache.labels, ''].join('/');
        if (!value.startsWith(startStr)) {
          return;
        }
        set_autoCompleteInput(value);


        const custom: string = value.replace(startStr, '');
        set_autoCompleteInputIsNew(value !== startStr && FUtil.Regexp.RESOURCE_TYPE.test(custom) && _autoCompleteOptions.every((aco) => {
          return aco.labels.join('/') !== value;
        }));
      }}
      onSelect={(value: any, op: any) => {
        const data: FResourceTypeInputStates['_autoCompleteOptions'][number] = op.data;
        // console.log(value, option, 'value : any sdfoisdjf lskdjlkj');
        if (value !== '#new') {
          onChange && onChange({
            value: data.value,
            // label: data.label,
            // values: data.values,
            labels: data.labels,
          });
        } else {
          const customInputLabels: string[] = _autoCompleteInput.split('/');
          onChange && onChange({
            value: _selectedCache.value,
            // label: _selectedCache.label,
            // values: _selectedCache.values,
            labels: _selectedCache.labels,
            customInput: customInputLabels[customInputLabels.length - 1],
          });
        }
        init();
      }}
      onClear={() => {
        onChange && onChange(null);
        init();
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
    open={_isOpen}
    onOpenChange={(o) => {
      set_isOpen(o);
    }}
    getPopupContainer={() => {
      return ref.current;
    }}
    trigger={['click']}
    destroyPopupOnHide={true}
    overlayClassName={styles.overlayClassName}
    overlay={(<div className={styles.overlay}>
      <div className={styles.recommend}>
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('createresource_selectresourcetype_input_hint2')}
          type={'additional2'}
        />
        <div style={{ height: 20 }} />
        <div className={styles.recommendResourceTypes}>
          {
            $recommend.map((r) => {
              return (<label
                onClick={() => {
                  onDropdownChange({
                    value: r.value,
                    labels: r.labels,
                  });
                }}
                key={r.value}
              >{r.labels.join('/')}</label>);
            })
          }
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
          $options.map((o0) => {
            return (<Popover

              getPopupContainer={() => {
                return ref.current;
              }}
              open={o0.children.length === 0 ? false : undefined}
              // trigger={'click'}
              // arrowPointAtCenter={false}
              // overlayInnerStyle={{ padding: 0, width: 200 }}
              // overlayStyle={{ padding: 0 }}
              overlayClassName={styles.PopoverOverlayClassName}
              placement={'rightTop'}
              title={null}
              content={<div className={styles.itemChildren}>
                {
                  o0.children.map((o1, o1Index, data) => {
                    return (<React.Fragment key={o1.value}>
                      <Popover
                        getPopupContainer={() => {
                          return ref.current;
                        }}
                        open={o1.children.length === 0 ? false : undefined}
                        // overlayInnerStyle={{ padding: 0 }}
                        // overlayStyle={{ padding: 0 }}
                        // trigger={'click'}
                        overlayClassName={styles.PopoverOverlayClassName}
                        title={null}
                        placement={'rightTop'}
                        content={<div className={styles.itemChildren}>
                          {
                            o1.children.map((o2) => {
                              return (<React.Fragment key={o2.value}>
                                <div
                                  className={styles.item}
                                  onClick={() => {
                                    if (o2.children.length === 0) {
                                      onDropdownChange({
                                        value: o2.value,
                                        labels: o2.labels,
                                      });
                                    }
                                  }}
                                >
                                  <span>{o2.label}</span>
                                </div>

                                {
                                  o1Index + 1 === data.length && (<div
                                    className={styles.item + ' ' + styles.itemLatest}
                                    onClick={() => {
                                      onDropdownClickCustom({
                                        value: o1.value,
                                        values: o1.values,
                                        label: o1.label,
                                        labels: o1.labels,
                                      });
                                    }}
                                  >
                                    {/*<span>添加新类型</span>*/}
                                    <span>{FI18n.i18nNext.t('createresource_selectresourcetype_btn_addnewtype')}</span>
                                  </div>)
                                }
                              </React.Fragment>);
                            })
                          }
                        </div>}
                      >
                        <div
                          className={styles.item}
                          onClick={() => {
                            if (o1.children.length === 0) {
                              onDropdownChange({
                                value: o1.value,
                                labels: o1.labels,
                              });
                            }
                          }}
                        >
                          <span>{o1.label}</span>
                          {
                            o1.children.length > 0 && (<>
                              <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />
                            </>)
                          }
                        </div>
                      </Popover>
                      {
                        o1Index + 1 === data.length && (<div
                          className={styles.item + ' ' + styles.itemLatest}
                          onClick={() => {
                            onDropdownClickCustom({
                              value: o0.value,
                              values: o0.values,
                              label: o0.label,
                              labels: o0.labels,
                            });
                          }}
                        >
                          {/*<span>添加新类型</span>*/}
                          <span>{FI18n.i18nNext.t('createresource_selectresourcetype_btn_addnewtype')}</span>
                        </div>)
                      }
                    </React.Fragment>);
                  })
                }
              </div>}
            >
              <div
                className={styles.item}
                key={o0.value}
                onClick={() => {
                  if (o0.children.length === 0) {
                    onDropdownChange({
                      value: o0.value,
                      labels: o0.labels,
                    });
                  }
                }}
              >
                <span>{o0.label}</span>
                {
                  o0.children.length > 0 && (<>
                    <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />
                  </>)
                }
              </div>
            </Popover>);
          })
        }
      </div>
    </div>)}
  >
    <div
      className={styles.square}
      style={{ borderColor: _isOpen ? '#2784FF' : '#D4D4D4' }}
      ref={ref}
    >
      {
        value === null
          ? (<span>{FI18n.i18nNext.t('createresource_selectresourcetype_input_hint')}</span>)
          : (<FComponentsLib.FContentText
            text={(value.customInput ? [...value.labels, value.customInput] : value.labels).join(' / ')}
            type={'normal'}
          />)
      }

      {
        _isOpen
          ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
      }
    </div>

  </Dropdown>);
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
  return result;
}
