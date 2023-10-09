import * as React from 'react';
import styles from './index.less';
import { AutoComplete, Dropdown, Popover, Space } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

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
  _autoCompleteInput: '',
  _autoCompleteInputIsNew: false,
};

function FResourceTypeInput(
  $prop: FResourceTypeInputProps) {

  const ref = React.useRef<any>();

  const [$state, $setState] = AHooks.useSetState<FResourceTypeInputStates>(initStates);

  AHooks.useMount(async () => {

    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes({
      category: 1,
      status: 1,
    });
    const options: Option[] = handledData(data_resourceTypes, null);
    // set$options(options);
    $setState({
      $options: options,
    });
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
    if (!data_recently) {
      return;
    }

    $setState({
      $recommend: data_recently
        .filter((r, i) => {
          return i < 6;
        })
        .map<FResourceTypeInputStates['$recommend'][number]>((r) => {
          return {
            value: r.code,
            labels: r.names.split('/'),
          };
        }),
    });
  });

  AHooks.useUnmount(() => {

  });

  AHooks.useDebounceEffect(
    () => {
      // console.log(_autoCompleteInput, 'a9s8idofjhoilsdjflkjsdlfjlkj');
      (async () => {

        // console.log(_autoCompleteInput, '_autoCompleteInputisdjflksdjflksdjflkjl');
        if ($state._autoCompleteInput === '' || $state._autoCompleteInput.endsWith('/')) {
          // set_autoCompleteOptions([]);
          // set_autoCompleteOptionsOther([]);
          $setState({
            _autoCompleteOptions: [],
            _autoCompleteOptionsOther: [],
          });
          return;
        }
        const search: string[] = $state._autoCompleteInput.split('/');

        const { data: data_list }: {
          data: {
            code: string;
            name: string;
            names: string;
            resourceCount: number;
          }[];
        } = await FServiceAPI.Resource.ListSimpleByParentCode({
          // parentCode: String(value),
          parentCode: $state._selectedCache?.value || '',
          // category: 1,
          name: search[search.length - 1],
          isTerminate: true,
        });

        $setState({
          _autoCompleteOptions: data_list.map((l) => {
            return {
              value: l.code,
              label: l.name,
              values: [l.code],
              labels: l.names.split('/'),
              count: l.resourceCount,
            };
          }),
        });

        const { data: data_list1 }: {
          data: {
            code: string;
            name: string;
            names: string;
            resourceCount: number;
          }[];
        } = await FServiceAPI.Resource.ListSimpleByParentCode({
          parentCode: $state._selectedCache?.value || '',
          category: 1,
          name: search[search.length - 1],
          excludeParentCode: true,
          // @ts-ignore
          isTerminate: true,
        });

        $setState({
          _autoCompleteOptionsOther: data_list1.map((l) => {
            return {
              value: l.code,
              label: l.name,
              values: [l.code],
              labels: l.names.split('/'),
              count: l.resourceCount,
            };
          }),
        });
      })();
    },
    [$state._autoCompleteInput],
    {
      wait: 300,
    },
  );

  function init() {
    $setState({
      _mode: initStates['_mode'],
      _isOpen: initStates['_isOpen'],
      _selectedCache: initStates['_selectedCache'],
      _autoCompleteOptions: initStates['_autoCompleteOptions'],
      _autoCompleteInput: initStates['_autoCompleteInput'],
      _autoCompleteInputIsNew: initStates['_autoCompleteInputIsNew'],
    });
  }

  function onDropdownChange(v: {
    value: string;
    labels: string[];
  }) {
    $prop.onChange && $prop.onChange({
      value: v.value,
      labels: v.labels,
    });
    // set_isOpen(false);
    $setState({
      _isOpen: false,
    });
  }

  async function onDropdownClickCustom({ value, values, label, labels }: {
    value: string;
    label: string;
    values: Array<string | number>;
    labels: string[];
  }) {
    $prop.onChange && $prop.onChange(null);
    // console.log(labels, 'labelsiosdjflksjdlkfjsldkjl');


    const startWidth: string = [...labels, ''].join('/');

    $setState({
      _autoCompleteInput: startWidth,
      _isOpen: false,
      _mode: 'input',
      _selectedCache: {
        value,
        values,
        label,
        labels,
      },
    });
  }

  if ($state._mode === 'input' && $state._selectedCache) {
    return (<div style={{ display: 'block' }}>
      <AutoComplete
        autoFocus={true}
        allowClear={true}
        defaultOpen={true}
        options={[
          ...($state._autoCompleteInputIsNew ? [
            {
              value: '#new',
              label: (<div className={styles.autoCompleteOption}>
                <span>{$state._autoCompleteInput}</span>
                {/*<FComponentsLib.FTextBtn>添加新类型</FComponentsLib.FTextBtn>*/}
                <FComponentsLib.FTextBtn>{FI18n.i18nNext.t('createresource_selectresourcetype_btn_addthis')}</FComponentsLib.FTextBtn>
              </div>),
              data: {
                value: '#new',
                label: '',
                values: [],
                labels: $state._autoCompleteInput.split('/'),
              },
            },
          ] : []),
          ...$state._autoCompleteOptions.map((aco) => {
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
          ...$state._autoCompleteOptionsOther.map((aco) => {
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
        value={$state._autoCompleteInput}
        className={styles.AutoComplete}
        onChange={(value: string) => {
          // console.log(value, 'value 908wieojfklsdfjasldkfjlkj');
          if (!value) {
            return;
          }
          const startStr: string = [...($state._selectedCache?.labels || []), ''].join('/');
          if (!value.startsWith(startStr)) {
            return;
          }

          const custom: string = value.replace(startStr, '');
          // console.log(custom, '1234567890 1234567890wsiedojflksdjl');

          if (value.length <= startStr.length + 40) {
            $setState({
              _autoCompleteInputIsNew: value !== startStr && FUtil.Regexp.RESOURCE_TYPE.test(custom) && $state._autoCompleteOptions.every((aco) => {
                return aco.labels.join('/') !== value;
              }),
              _autoCompleteInput: value,
            });
          }

        }}
        onSelect={(value: any, op: any) => {
          const data: FResourceTypeInputStates['_autoCompleteOptions'][number] = op.data;
          // console.log(value, option, 'value : any sdfoisdjf lskdjlkj');
          if (value !== '#new') {
            $prop.onChange && $prop.onChange({
              value: data.value,
              // label: data.label,
              // values: data.values,
              labels: data.labels,
            });
          } else {
            const customInputLabels: string[] = $state._autoCompleteInput.split('/');
            $prop.onChange && $prop.onChange({
              value: $state._selectedCache?.value || '',
              // label: _selectedCache.label,
              // values: _selectedCache.values,
              labels: $state._selectedCache?.labels || [],
              customInput: customInputLabels[customInputLabels.length - 1],
            });
          }
          init();
        }}
        onClear={() => {
          $prop.onChange && $prop.onChange(null);
          init();
        }}
      >
        <FComponentsLib.FInput.FSingleLine
          lengthLimit={-1}
          value={''}
          // value={'autoCompleteInput'}
          style={{ width: 360 }}
        />
      </AutoComplete>
      <div style={{ height: 30 }} />
      <Space style={{ display: 'flex' }} size={5} direction={'vertical'}>
        <FComponentsLib.FContentText text={'目前仅支持中文、英文、数字，及符号“-”、“&”、“.”、“,”'} type={'additional2'} />
        <FComponentsLib.FContentText text={'英文区分大小写'} type={'additional2'} />
        <FComponentsLib.FContentText text={'长度必须在1-40个字符之间'} type={'additional2'} />
      </Space>
    </div>);
  }

  return (<Dropdown
    // open={true}
    open={$state._isOpen}
    onOpenChange={(o) => {
      // set_isOpen(o);
      $setState({
        _isOpen: o,
      });
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
            $state.$recommend.map((r) => {
              return (<label
                key={r.value}
                onClick={() => {
                  onDropdownChange({
                    value: r.value,
                    labels: r.labels,
                  });
                }}
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
          $state.$options.map((o0) => {
            return (<Popover
              key={o0.value}
              // showArrow={false}
              // arrowPointAtCenter={false}
              getPopupContainer={() => {
                return ref.current;
              }}
              zIndex={10000}
              open={o0.children.length === 0 ? false : undefined}
              overlayClassName={styles.PopoverOverlayClassName}
              placement={'rightTop'}
              title={null}
              content={<div className={styles.itemChildren}>
                {
                  o0.children.map((o1, o1Index) => {
                    return (<React.Fragment key={o1.value}>
                      <Popover
                        zIndex={10001}
                        // showArrow={false}
                        getPopupContainer={() => {
                          return ref.current;
                        }}
                        open={o1.children.length === 0 ? false : undefined}
                        overlayClassName={styles.PopoverOverlayClassName}
                        title={null}
                        placement={'rightTop'}
                        content={<div className={styles.itemChildren}>
                          {
                            o1.children.map((o2, o2Index) => {
                              // console.log(o2Index + 1, o1.children.length, 'o2Index + 1 === o1.children.length 839isdfihsdkf');
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
                                  o2Index + 1 === o1.children.length && (<div
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
                            o1.children.length > 0 && (<FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />)
                          }
                        </div>
                      </Popover>
                      {
                        o1Index + 1 === o0.children.length && (<div
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
                  o0.children.length > 0 && (<FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />)
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
      style={{ borderColor: $state._isOpen ? '#2784FF' : '#D4D4D4' }}
      ref={ref}
    >
      {
        $prop.value === null
          ? (<span>{FI18n.i18nNext.t('createresource_selectresourcetype_input_hint')}</span>)
          : (<FComponentsLib.FContentText
            text={($prop.value.customInput ? [...$prop.value.labels, $prop.value.customInput] : $prop.value.labels).join(' / ')}
            type={'normal'}
          />)
      }

      {
        $state._isOpen
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
