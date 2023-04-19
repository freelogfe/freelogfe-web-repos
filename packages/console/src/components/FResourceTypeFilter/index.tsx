import * as React from 'react';
import styles from './index.less';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import { Dropdown } from 'antd';

interface FResourceTypeFilterProps {
  value: string;
  omitTheme?: boolean;

  onChange?(value: FResourceTypeFilterProps['value']): void;
}

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

interface FResourceTypeFilterStates {
  $options: Option[];
  _isOpen: boolean;
}

const initStates: FResourceTypeFilterStates = {
  $options: [],
  _isOpen: false,
};

function FResourceTypeFilter({ value, omitTheme = false, onChange }: FResourceTypeFilterProps) {

  const [$options, set$options] = React.useState<Option[]>(initStates['$options']);
  const [_isOpen, set_isOpen] = React.useState<FResourceTypeFilterStates['_isOpen']>(initStates['_isOpen']);


  AHooks.useMount(async () => {
    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes();
    // console.log(data_resourceTypes, 'data_resourceTypessiodjdflkjsdlkjflksdjlk');
    let data: ServerData[] = data_resourceTypes;
    if (omitTheme) {
      data = data.filter((d) => {
        return d.name !== '主题';
      });
    }
    // console.log(data, 'dataiosdjflksdjfljl  dddddd');
    const options: Option[] = handledData(data, null);
    set$options(options);
  });

  AHooks.useUnmount(() => {

  });

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
          $options.map((o0) => {
            return (<div
              className={styles.item}
              key={o0.value}
              onClick={() => {
                if (o0.children.length === 0) {
                  // onDropdownChange(o0, [o0]);
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
                                // onDropdownChange(o1, [o0, o1]);
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
                                              // onDropdownChange(o2, [o0, o1, o2]);
                                            }
                                          }}
                                        >
                                          <span>{o2.label}</span>
                                        </div>

                                        {
                                          o1Index + 1 === data.length && (<div
                                            className={styles.item + ' ' + styles.itemLatest}
                                            onClick={() => {
                                              // onDropdownClickCustom({
                                              //   value: o1.value,
                                              //   values: o1.values,
                                              //   label: o1.label,
                                              //   labels: o1.labels,
                                              // });
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
          ? (<span>全部</span>)
          : (<FComponentsLib.FContentText
            text={['全部'].join(' / ')}
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

  // return (<Cascader
  //   allowClear={false}
  //   value={value}
  //   options={options}
  //   onChange={(value: Array<string | number>, selectedOptions) => {
  //     // console.log(value, selectedOptions, 'value, selectedOptions sdi8ofjsdlkfjsldkfjlkj');
  //     onChange && onChange(value);
  //   }}
  //   placeholder='Please select'
  // />);
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
      value: '#all',
      label: '全部',
      values: [...parent.values, '#all'],
      labels: [...parent.labels, '全部'],
      children: [],
    });
    result.push({
      value: parent.value + '#other',
      label: '其他',
      values: [...parent.values, parent.value + '#other'],
      labels: [...parent.labels, '其他'],
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
