import * as React from 'react';
import styles from './index.less';
import { AutoComplete, Cascader, Dropdown, Input, Menu } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FInput from '@/components/FInput';

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
    value: string | number;
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
  // autoCompleteInputStarWith: '',
  _autoCompleteInput: '',
  _autoCompleteInputIsNew: false,
};

function FResourceTypeInput({ value, onChange }: FResourceTypeInputProps) {

  // const refAutoComplete = React.useRef(null);

  const [$options, set$options] = React.useState<FResourceTypeInputStates['$options']>(initStates['$options']);
  const [$recommend, set$recommend] = React.useState<FResourceTypeInputStates['$recommend']>(initStates['$recommend']);
  const [_mode, set_mode] = React.useState<FResourceTypeInputStates['_mode']>(initStates['_mode']);
  const [_isOpen, set_isOpen] = React.useState<FResourceTypeInputStates['_isOpen']>(initStates['_isOpen']);
  const [_selectedCache, set_selectedCache] = React.useState<FResourceTypeInputStates['_selectedCache']>(initStates['_selectedCache']);
  const [_autoCompleteOptions, set_autoCompleteOptions] = React.useState<FResourceTypeInputStates['_autoCompleteOptions']>(initStates['_autoCompleteOptions']);
  // const [autoCompleteInputStarWith, set_autoCompleteInputStarWith] = React.useState<FResourceTypeInputStates['autoCompleteInputStarWith']>(initStates['autoCompleteInputStarWith']);
  const [_autoCompleteInput, set_autoCompleteInput] = React.useState<FResourceTypeInputStates['_autoCompleteInput']>(initStates['_autoCompleteInput']);
  const [_autoCompleteInputIsNew, set_autoCompleteInputIsNew] = React.useState<FResourceTypeInputStates['_autoCompleteInputIsNew']>(initStates['_autoCompleteInputIsNew']);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    const options: Option[] = handledData(data_resourceTypes, null);
    set$options(options);
  });

  AHooks.useMount(async () => {
    const { data: data_recently }: {
      data: {
        code: string;
        name: string;
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
          labels: [r.name],
        };
      }));
  });

  AHooks.useUnmount(() => {

  });

  function init() {
    set_mode(initStates['_mode']);
    set_isOpen(initStates['_isOpen']);
    set_selectedCache(initStates['_selectedCache']);
    set_autoCompleteOptions(initStates['_autoCompleteOptions']);
    set_autoCompleteInput(initStates['_autoCompleteInput']);
    set_autoCompleteInputIsNew(initStates['_autoCompleteInputIsNew']);
  }

  // console.log(autoCompleteInput, 'autoCompleteInput sd9ifoj;sldkfjsdlfjlkj');

  function onDropdownChange(option: Option, options: Option[]) {
    onChange && onChange({
      value: option.value,
      values: option.values,
      label: option.label,
      labels: option.labels,
    });
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

  if (_mode === 'input' && _selectedCache) {
    return (<AutoComplete
      // ref={refAutoComplete}
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
      ]}
      style={{ width: 360 }}
      // onSelect={onSelect}
      // onSearch={onSearch}
      value={_autoCompleteInput}
      className={styles.AutoComplete}
      filterOption={(inputValue, option: any) => {
        // console.log(inputValue, option);
        return option.data.labels.join('/').startsWith(inputValue);
      }}
      onChange={(value) => {
        if (!value) {
          return;
        }
        // console.log(value, selectedCache, 'selectedCache  valuesdlkfjsldkj');
        const startStr: string = [..._selectedCache.labels, ''].join('/');
        if (!value.startsWith(startStr)) {
          return;
        }
        // console.log(value, startStr, 'asiodjf;lkwejl;kfjlsk;djflk;jsdlfkjsdlkfjsdlkfj');
        if (value.length > startStr.length + 40) {
          return;
        }
        set_autoCompleteInput(value);
        set_autoCompleteInputIsNew(value !== startStr && _autoCompleteOptions.every((aco) => {
          return aco.labels.join('/') !== value;
        }));
      }}
      onSelect={(value: any, op: any) => {
        const data: FResourceTypeInputStates['_autoCompleteOptions'][number] = op.data;
        // console.log(value, option, 'value : any sdfoisdjf lskdjlkj');
        if (value !== '#new') {
          onChange && onChange({
            value: data.value,
            label: data.label,
            values: data.values,
            labels: data.labels,
          });
        } else {
          const customInputLabels: string[] = _autoCompleteInput.split('/');
          onChange && onChange({
            value: _selectedCache.value,
            label: _selectedCache.label,
            values: _selectedCache.values,
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
          {
            $recommend.map((r) => {
              return (<label key={r.value}>{r.labels.join('/')}</label>);
            })
          }

          {/*<label>阅读/演示文稿</label>*/}
          {/*<label>音频/有声书</label>*/}
          {/*<label>音频/播客</label>*/}
          {/*<label>视频/长视频</label>*/}
          {/*<label>视频/短视频</label>*/}
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
                                            {/*<span>添加新类型</span>*/}
                                            <span>{FI18n.i18nNext.t('createresource_selectresourcetype_btn_addnewtype')}</span>
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
                  </div>
                </>)
              }
            </div>);
          })
        }
      </div>
    </div>)}
  >
    <div className={styles.square} style={{ borderColor: _isOpen ? '#2784FF' : '#D4D4D4' }}>
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
