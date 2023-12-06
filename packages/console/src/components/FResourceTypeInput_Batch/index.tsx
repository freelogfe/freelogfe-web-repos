import * as React from 'react';
import styles from './index.less';
import { Dropdown, Popover } from 'antd';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

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

interface FResourceTypeInput_Batch_Props {
  value: {
    value: string;
    labels: string[];
  } | null;

  onChange?(value: FResourceTypeInput_Batch_Props['value']): void;
}

function FResourceTypeInput_Batch({ value, onChange }: FResourceTypeInput_Batch_Props) {

  const ref = React.useRef<any>();

  const [$isOpen, set$isOpen, get$isOpen] = FUtil.Hook.useGetState<boolean>(false);
  const [$options, set$options, get$options] = FUtil.Hook.useGetState<Option[]>([]);

  AHooks.useMount(async () => {

    const { data: data_resourceTypes }: {
      data: ServerData[];
    } = await FServiceAPI.Resource.resourceTypes({
      category: 1,
      status: 1,
      // @ts-ignore
      supportCreateBatch: 2,
    });
    const options: Option[] = handledData(data_resourceTypes, null);
    set$options(options);
  });

  function onDropdownChange(v: {
    value: string;
    labels: string[];
  }) {
    onChange && onChange({
      value: v.value,
      labels: v.labels,
    });
    // set_isOpen(false);
    set$isOpen(false);
  }

  return (<Dropdown
    open={$isOpen}
    onOpenChange={(o) => {
      set$isOpen(o);
    }}
    getPopupContainer={() => {
      return ref.current;
    }}
    trigger={['click']}
    destroyPopupOnHide={true}
    overlayClassName={styles.overlayClassName}
    overlay={(<div className={styles.overlay}>
      <div style={{ height: 10 }} />
      <div className={styles.FCascader}>
        {
          $options.map((o0) => {
            return (<Popover
              key={o0.value}
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
                    return (<Popover
                      key={o1.value}
                      zIndex={10001}
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
                            return (<div
                              key={o2.value}
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
                            </div>);
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
                          o1.children.length > 0 && (
                            <FComponentsLib.FIcons.FRight className={styles.itemRightIcon} />)
                        }
                      </div>
                    </Popover>);
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
      <div style={{ height: 10 }} />
    </div>)}
  >
    <div
      className={styles.square}
      style={{ borderColor: $isOpen ? '#2784FF' : '#D4D4D4' }}
      ref={ref}
    >
      {
        value === null
          ? (<span>{FI18n.i18nNext.t('brr_selectresourcetype_input_resourcetype_hint')}</span>)
          : (<FComponentsLib.FContentText
            text={(value.labels).join(' / ')}
            type={'normal'}
          />)
      }

      {
        $isOpen
          ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
          : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
      }
    </div>

  </Dropdown>);
}

export default FResourceTypeInput_Batch;

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
