import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Dropdown } from 'antd';

interface FResourceTypeFilterProps {
  value: {
    value: string;
    label: string;
    values: string[];
    labels: string[];
  };
  omitTheme?: boolean;

  onChange?(value: FResourceTypeFilterProps['value']): void;
}

interface Option {
  value: string;
  label: string;
  values: string[];
  labels: string[];
  children: Option[];
}

interface ServerData {
  code: string;
  name: string;
  children: ServerData[];
}

interface FResourceTypeFilterStates {
  _localRecently: {
    value: string;
    labels: string[];
  }[];
  $recommend: {
    value: string;
    labels: string[];
  }[];
  $options: Option[];
  _isOpen: boolean;
}

const initStates: FResourceTypeFilterStates = {
  _localRecently: [],
  $recommend: [],
  $options: [],
  _isOpen: false,
};

function FResourceTypeFilter({ value, omitTheme = false, onChange }: FResourceTypeFilterProps) {

  const [_localRecently, set_localRecently] = AHooks.useLocalStorageState<FResourceTypeFilterStates['_localRecently']>('FResourceTypeFilter-$localRecently', {
    defaultValue: initStates['_localRecently'],
  });
  const [$recommend, set$recommend] = React.useState<FResourceTypeFilterStates['$recommend']>(initStates['$recommend']);
  const [$options, set$options] = React.useState<Option[]>(initStates['$options']);
  const [_isOpen, set_isOpen] = React.useState<FResourceTypeFilterStates['_isOpen']>(initStates['_isOpen']);

  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes({
      category: 1,
      // @ts-ignore
      isMine: false,
    });
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    let data: ServerData[] = data_resourceTypes;
    if (omitTheme) {
      data = data.filter((d) => {
        return d.name !== '主题';
      });
    }
    // console.log(data, 'dataiosdjflksdjfljl  dddddd');
    const options: Option[] = handledData(data, null);
    // console.log(options, 'options sda98ifjoewjfolkedjflsdjfljdslfjsldjflkj');
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
      .filter((r) => {
        return _localRecently.every((lr) => {
          return lr.value.replace('#all', '') !== r.code;
        });
      })
      .filter((r, i) => {
        return i < 6;
      })
      .map<FResourceTypeFilterStates['$recommend'][number]>((r) => {
        return {
          value: r.code,
          labels: r.names.split('/'),
        };
      }));
  });

  AHooks.useUnmount(() => {

  });

  function onDropdownChange(op: Option) {
    // console.log(op, 'OOOPPPP sdujfoisdjflksdjlfkjdslkfjl');
    set_localRecently([
      {
        value: op.value,
        labels: op.labels,
      },
      ..._localRecently
        .filter((i) => {
          return i.value !== op.value;
        })
        .filter((i, j) => {
          return j < 5;
        }),
    ]);
    onChange && onChange(op);
    set_isOpen(false);
  }

  return (<Dropdown
    // open={true}
    open={_isOpen}
    onOpenChange={(o) => {
      set_isOpen(o);
    }}
    trigger={['hover']}
    overlayClassName={styles.overlayClassName}
    overlay={(<div className={styles.overlay}>
      <div className={styles.recommend}>
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('filter_resourcetype_hint')}
          type={'additional2'}
        />
        <div style={{ height: 20 }} />
        <div className={styles.recommendResourceTypes}>
          {
            [..._localRecently, ...$recommend]
              .filter((_, i) => {
                return i < 6;
              })
              .map((r) => {
                const showLabels: string[] = r.labels.filter((l) => {
                  return l !== '全部';
                });
                return (<label
                  onClick={() => {
                    onDropdownChange({
                      value: r.value,
                      values: [],
                      labels: r.labels,
                      label: '',
                      children: [],
                    });
                  }}
                  key={r.value}>{showLabels.join('/') || '全部'}</label>);
              })
          }
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <FComponentsLib.FContentText
          text={FI18n.i18nNext.t('filter_resourcetype_hint2')}
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
                  onDropdownChange(o0);
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
                                onDropdownChange(o1);
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
                                              onDropdownChange(o2);
                                            }
                                          }}
                                        >
                                          <span>{o2.label}</span>
                                        </div>

                                      </React.Fragment>);
                                    })
                                  }

                                </div>
                              </>)
                            }
                          </div>
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
    <div className={styles.square}>
      <FComponentsLib.FContentText
        text={value.labels.filter((l) => {
          return l !== '全部';
        }).join(' / ') || '全部'}
        type={'normal'}
      />

      {
        _isOpen
          ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
      }
    </div>
  </Dropdown>);
}

export default FResourceTypeFilter;

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

  if (parent) {
    result.unshift({
      value: parent.value + '#all',
      label: '全部',
      values: [...parent.values, parent.value + '#all'],
      labels: [...parent.labels, '全部'],
      children: [],
    });
    result.push({
      value: parent.value + '#other',
      // label: '其他',
      label: FI18n.i18nNext.t('filter_resourcetype_type_other'),
      values: [...parent.values, parent.value + '#other'],
      labels: [...parent.labels, FI18n.i18nNext.t('filter_resourcetype_type_other')],
      children: [],
    });
  } else {
    result.unshift({
      value: '#all',
      label: '全部',
      values: ['#all'],
      labels: ['全部'],
      children: [],
    });
  }
  return result;
}
