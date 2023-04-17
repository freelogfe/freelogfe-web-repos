import * as React from 'react';
import styles from './index.less';
import { Cascader, Dropdown, Menu } from 'antd';
import * as AHooks from 'ahooks';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

interface ServerData {
  code: string;
  name: string;
  children: ServerData[];
}

interface FResourceTypeInputProps {
  value: Array<string | number>;
  useKey?: 'code' | 'name';

  onChange?(value: FResourceTypeInputProps['value'], selectedOptions: Option[]): void;
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
    const options: Option[] = handledData(data_resourceTypes, useKey);
    set_options(options);
  });

  AHooks.useUnmount(() => {

  });

  return (<Dropdown
    open={true}
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
        <div className={styles.item}>
          <span>主题</span>
        </div>
        <div className={styles.item}>
          <span>插件</span>
        </div>
        <div className={styles.item}>
          <span>阅读</span>
          <FComponentsLib.FIcons.FDown className={styles.itemRightIcon} />
          <div className={styles.itemChildren}>
            <div className={styles.item}>
              <span>主题</span>
            </div>
            <div className={styles.item}>
              <span>插件</span>
              <FComponentsLib.FIcons.FDown className={styles.itemRightIcon} />
              <div className={styles.itemChildren}>
                <div className={styles.item}>
                  <span>主题</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)}
  >
    <div className={styles.square} style={{ borderColor: isOpen ? '#2784FF' : '#D4D4D4' }}>
      <span>选择类型</span>
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


function handledData(data: ServerData[], useKey: 'code' | 'name'): Option[] {
  return data.map((d) => {
    return {
      value: d[useKey],
      label: d.name,
      children: handledData(d.children, useKey),
    };
  });
}

export async function codeToCodes(code: string): Promise<Option[]> {
  const { data: data_resourceTypes }: {
    data: ServerData[];
  } = await FServiceAPI.Resource.resourceTypes();
  const arr: Option[] = [];
  ha(code, data_resourceTypes, arr);
  return arr;
}

function ha(code: string, data: ServerData[], payload: Option[]) {
  const da: ServerData | undefined = data.find((d) => {
    return code.startsWith(d.code);
  });
  if (!da) {
    return;
  }
  payload.push({
    value: da.code,
    label: da.name,
  });
  ha(code, da.children, payload);
}
