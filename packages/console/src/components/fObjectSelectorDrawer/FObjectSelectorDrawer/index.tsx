import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import FDropdownMenu from '@/components/FDropdownMenu';
// import { DownOutlined } from '@ant-design/icons';
import FInput from '@/components/FInput';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
// import * as AHooks from 'ahooks';
// import { ChangeAction } from '@/models/storageObjectDepSelector';
// import { FetchExhibitListAction } from '@/models/informalNodeManagerPage';
import FListFooter, { listStateAndListMore } from '@/components/FListFooter';

interface FObjectSelectorDrawerProps {
  onSelect?(obj: { bucketID: string; bucketName: string; objID: string; objName: string; sha1: string }): void;

  onClose?(): void;
}

interface FObjectSelectorDrawerStates {
  visible: boolean;
  selectOptions: { text: string; value: string; }[];
  selected: string;
  inputValue: string;
  objList: {
    bucketID: string;
    bucketName: string;
    objID: string;
    objName: string;
    sha1: string;
    resourceType: string[];
    updateTime: string;
  }[];
  objListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  objListMore: 'loading' | 'andMore' | 'noMore';
}

const initStates: FObjectSelectorDrawerStates = {
  visible: true,
  selectOptions: [{
    text: FI18n.i18nNext.t('importobject_filter_buckets_all'),
    value: '_all',
  }],
  selected: '_all',
  inputValue: '',
  objList: [],
  objListState: 'loading',
  objListMore: 'loading',
};

function FObjectSelectorDrawer({ onSelect, onClose }: FObjectSelectorDrawerProps) {

  const [visible, set_visible] = React.useState<FObjectSelectorDrawerStates['visible']>(initStates['visible']);
  const [selectOptions, set_selectOptions] = React.useState<FObjectSelectorDrawerStates['selectOptions']>(initStates['selectOptions']);
  const [selected, set_selected] = React.useState<FObjectSelectorDrawerStates['selected']>(initStates['selected']);
  const [inputValue, set_inputValue] = React.useState<FObjectSelectorDrawerStates['inputValue']>(initStates['inputValue']);
  const [objList, set_objList] = React.useState<FObjectSelectorDrawerStates['objList']>(initStates['objList']);
  const [objListState, set_objListState] = React.useState<FObjectSelectorDrawerStates['objListState']>(initStates['objListState']);
  const [objListMore, set_objListMore] = React.useState<FObjectSelectorDrawerStates['objListMore']>(initStates['objListMore']);

  React.useEffect(() => {
    loadData();
  }, [selected, inputValue]);

  async function initData() {
    const params1: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
      bucketType: 1,
    };

    const { data: data_bucketList } = await FServiceAPI.Storage.bucketList(params1);
    // console.log(data_bucketList, 'ddd9oiejflksdfjlk');

    set_selectOptions([
      {
        text: FI18n.i18nNext.t('importobject_filter_buckets_all'),
        value: '_all',
      },
      ...data_bucketList.map((bl: any) => {
        return {
          text: bl.bucketName,
          value: bl.bucketName,
        };
      }),
    ]);

    // loadData();
  }

  async function loadData() {
    const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
      bucketName: selected,
      // resourceType: selector.visibleOResourceType || undefined,
      isLoadingTypeless: 1,
      keywords: inputValue,
      skip: 0,
      limit: FUtil.Predefined.pageSize,
    };
    const { data } = await FServiceAPI.Storage.objectList(params);
    // console.log(data, 'data09woi3e4jfsldkfsdjlfksdjflkj');
    const { state, more } = listStateAndListMore({
      list_Length: objList.length,
      total_Length: data.totalItem,
      has_FilterCriteria: selected !== '_all' || inputValue !== '',
    });
    set_objListState(state);
    set_objListMore(more);
    set_objList(data.dataList.map((d: any) => {
      return {
        bucketID: d.bucketId,
        bucketName: d.bucketName,
        objID: d.objectId,
        objName: d.objectName,
        sha1: d.sha1,
        resourceType: d.resourceType,
        updateTime: '',
      };
    }));
  }

  return (<FDrawer
    title={'选择对象'}
    onClose={() => {
      set_visible(false);
    }}
    afterOpenChange={(visible) => {
      if (visible) {
        initData();
      } else {
        onClose && onClose();
      }
    }}
    open={visible}
    width={820}
  >
    <div className={styles.filter}>
      <FDropdownMenu
        options={selectOptions}
        onChange={(value) => {
          set_selected((prevState) => {
            return value;
          });
        }}
      >
        <a>{(selectOptions.find((rs) => rs.value === selected) as any).text}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      <FInput
        theme='dark'
        debounce={300}
        value={inputValue}
        onDebounceChange={(value) => {
          set_inputValue(value);
        }}
      />
    </div>
    {
      objList.map((obj) => {
        return (<div key={obj.objID} className={styles.bucket}>
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
              onSelect && onSelect(obj);
              set_visible(false);
            }}
          >选择</FComponentsLib.FRectBtn>
        </div>);
      })
    }
    <FListFooter
      state={objListMore}
      onClickLoadMore={() => {
        // dispatch<FetchExhibitListAction>({
        //   type: 'informalNodeManagerPage/fetchExhibitList',
        //   payload: {
        //     isRematch: false,
        //     isRestart: false,
        //   },
        // });
      }}
    />
  </FDrawer>);
}

export default FObjectSelectorDrawer;
