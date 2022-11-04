import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FDropdownMenu from '@/components/FDropdownMenu';
import { DownOutlined } from '@ant-design/icons';
import FInput from '@/components/FInput';
import FComponentsLib from '@freelog/components-lib';
import FDrawer from '@/components/FDrawer';
import { FUtil } from '@freelog/tools-lib';

interface fObjectSelectorDrawerProps {

}

function fObjectSelectorDrawer({}: fObjectSelectorDrawerProps = {}) {
  const root = ReactDOM.createRoot(document.getElementById('drawer-root') as HTMLDivElement);
  return root.render((<FObjectSelectorDrawer
    onSelect={(obj) => {
    }}
    onClose={() => {
      setTimeout(() => {
        root.unmount();
      }, 300);
    }}
  />));
}

export default fObjectSelectorDrawer;

interface FObjectSelectorDrawerProps {
  onSelect?({ objID, objName, sha1 }: { objID: string; objName: string; sha1: string }): void;

  onClose?(): void;
}

interface FObjectSelectorDrawerStates {
  visible: boolean;
  selectOptions: { text: string; value: string; }[];
  selected: string;
  inputValue: string;
  objList: {
    objID: string;
    objName: string;
    sha1: string;
    resourceType: string[];
    updateTime: string;
  }[];
}

const initStates: FObjectSelectorDrawerStates = {
  visible: true,
  selectOptions: [{
    text: '全部Bucket',
    value: '_all',
  }],
  selected: '_all',
  inputValue: '',
  objList: [],
};

function FObjectSelectorDrawer({ onSelect }: FObjectSelectorDrawerProps) {

  const [visible, set_visible] = React.useState<FObjectSelectorDrawerStates['visible']>(initStates['visible']);
  const [selectOptions, set_selectOptions] = React.useState<FObjectSelectorDrawerStates['selectOptions']>(initStates['selectOptions']);
  const [selected, set_selected] = React.useState<FObjectSelectorDrawerStates['selected']>(initStates['selected']);
  const [inputValue, set_inputValue] = React.useState<FObjectSelectorDrawerStates['inputValue']>(initStates['inputValue']);
  const [objList, set_objList] = React.useState<FObjectSelectorDrawerStates['objList']>(initStates['objList']);


  return (<FDrawer
    title={'选择对象'}
    onClose={() => {
      set_visible(false);
    }}
    visible={visible}
    width={820}
  >
    <div className={styles.filter}>
      <FDropdownMenu
        options={selectOptions}
        onChange={(value) => {
        }}
      >
        <a>{(selectOptions.find((rs) => rs.value === selected) as any).text} <DownOutlined
          style={{ marginLeft: 8 }} /></a>
      </FDropdownMenu>
      <FInput
        theme='dark'
        debounce={300}
        value={inputValue}
        onDebounceChange={(value) => {

        }}
      />
    </div>
    {
      objList.map((obj) => {
        return (<div id={obj.objID} className={styles.bucket}>
          <div>
            <div className={styles.title}>
              <div>
                <FComponentsLib.FContentText
                  singleRow={true}
                  text={obj.objName}
                />
              </div>
            </div>
            <div style={{ height: 2 }} />
            <FComponentsLib.FContentText
              type={'additional2'}
              text={(obj.resourceType.length > 0 ? `资源类型 ${FUtil.Format.resourceTypeKeyArrToResourceType(obj.resourceType)}` : '未设置类型') + ` | 更新时间 ${obj.updateTime}`}
            />
          </div>
          <FComponentsLib.FRectBtn
            type='secondary'
            size='small'
            onClick={() => {

            }}
          >选择</FComponentsLib.FRectBtn>
        </div>);
      })
    }

  </FDrawer>);
}
