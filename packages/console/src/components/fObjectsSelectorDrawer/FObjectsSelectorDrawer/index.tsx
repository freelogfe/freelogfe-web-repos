import * as React from 'react';
import styles from './index.less';
import FDrawer from '@/components/FDrawer';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI, FUtil } from '@freelog/tools-lib';
import FListFooter, { listStateAndListMore } from '@/components/FListFooter';
import * as AHooks from 'ahooks';
import { Checkbox, Space } from 'antd';
import { ChangeAction } from '@/models/storageHomePage';
// import { history } from '@@/core/history';
// import { OnClick_SaveBtn_Action } from '@/models/storageObjectEditor';

interface FObjectsSelectorDrawerProps {
  resourceTypeCode: string;

  onSelect?(objectIDs: string[]): void;

  onClose?(): void;
}

interface FObjectsSelectorDrawerStates {
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

const initStates: FObjectsSelectorDrawerStates = {
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

function FObjectsSelectorDrawer({ resourceTypeCode, onSelect, onClose }: FObjectsSelectorDrawerProps) {

  const [visible, set_visible] = React.useState<FObjectsSelectorDrawerStates['visible']>(initStates['visible']);
  const [selectOptions, set_selectOptions] = React.useState<FObjectsSelectorDrawerStates['selectOptions']>(initStates['selectOptions']);
  const [selected, set_selected] = React.useState<FObjectsSelectorDrawerStates['selected']>(initStates['selected']);
  const [inputValue, set_inputValue] = React.useState<FObjectsSelectorDrawerStates['inputValue']>(initStates['inputValue']);
  const [objList, set_objList] = React.useState<FObjectsSelectorDrawerStates['objList']>(initStates['objList']);
  const [objListState, set_objListState] = React.useState<FObjectsSelectorDrawerStates['objListState']>(initStates['objListState']);
  const [objListMore, set_objListMore] = React.useState<FObjectsSelectorDrawerStates['objListMore']>(initStates['objListMore']);
  const [$checkedObjectIDs, set$checkedObjectIDs, get$checkedObjectIDs] = FUtil.Hook.useGetState<string[]>([]);

  AHooks.useDebounceEffect(() => {
    loadData(true);
  }, [selected, inputValue], {
    wait: 300,
  });

  AHooks.useDebounceEffect(() => {
    const allIDs: string[] = objList.map((ol) => {
      return ol.objID;
    });

    set$checkedObjectIDs(get$checkedObjectIDs().filter((id) => {
      return allIDs.includes(id);
    }));

    // dispatch<ChangeAction>({
    //   type: 'storageHomePage/change',
    //   payload: {
    //     checkedObjectIDs: ,
    //   },
    // });

  }, [objList], {
    wait: 30,
  });

  async function initData() {
    const params1: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
      bucketType: 1,
    };

    const { data: data_bucketList } = await FServiceAPI.Storage.bucketList(params1);

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

  async function loadData(restart: boolean = false) {
    let objectList: FObjectsSelectorDrawerStates['objList'] = [];
    if (!restart) {
      objectList = [...objList];
      set_objListMore('loading');
    } else {
      set_objListState('loading');
    }

    const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
      bucketName: selected,
      // resourceType: resourceType[resourceType.length - 1],
      resourceTypeCode: resourceTypeCode,
      isLoadingTypeless: 1,
      keywords: inputValue,
      skip: objectList.length,
      limit: FUtil.Predefined.pageSize,
    };
    const { data }: {
      data: {
        dataList: {
          bucketId: string;
          bucketName: string;
          objectId: string;
          objectName: string;
          sha1: string;
          resourceType: string[];
          updateDate: string;
        }[];
        totalItem: number;
      }
    } = await FServiceAPI.Storage.objectList(params);
    // console.log(data, 'data sdiofj;sldkfjlsdjflksdjflkjlk');

    const newObjList: FObjectsSelectorDrawerStates['objList'] = [
      ...objectList,
      ...data.dataList.map((d) => {
        return {
          bucketID: d.bucketId,
          bucketName: d.bucketName,
          objID: d.objectId,
          objName: d.objectName,
          sha1: d.sha1,
          resourceType: d.resourceType,
          updateTime: FUtil.Format.formatDateTime(d.updateDate, true),
        };
      }),
    ];
    // console.log(data, 'data09woi3e4jfsldkfsdjlfksdjflkj');
    const { state, more } = listStateAndListMore({
      list_Length: newObjList.length,
      total_Length: data.totalItem,
      has_FilterCriteria: selected !== '_all' || inputValue !== '',
    });
    set_objListState(state);
    set_objListMore(more);
    set_objList(newObjList);
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
    topRight={<Space size={30}>
      <FComponentsLib.FTextBtn
        onClick={() => {
          set_visible(false);
        }}
        type='default'
      >取消</FComponentsLib.FTextBtn>
      <FComponentsLib.FRectBtn
        disabled={$checkedObjectIDs.length === 0}
        onClick={async () => {
          onSelect && onSelect(get$checkedObjectIDs());
          set_visible(false);
        }}
      >确定</FComponentsLib.FRectBtn>
    </Space>}
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
      <FComponentsLib.FInput.FSearch
        // theme='dark'
        // debounce={300}
        value={inputValue}
        onChange={(value) => {
          set_inputValue(value);
        }}
      />
    </div>
    {
      objList.map((obj) => {
        return (<div key={obj.objID} className={styles.bucket}>
          <Space size={20}>
            <Checkbox
              checked={$checkedObjectIDs.includes(obj.objID)}
              onChange={(e) => {
                if (e.target.checked) {
                  set$checkedObjectIDs([
                    ...get$checkedObjectIDs(),
                    obj.objID,
                  ]);
                  // dispatch<ChangeAction>({
                  //   type: 'storageHomePage/change',
                  //   payload: {
                  //     checkedObjectIDs: [
                  //       ...storageHomePage.checkedObjectIDs,
                  //       record.id,
                  //     ],
                  //   },
                  // });
                } else {
                  set$checkedObjectIDs(get$checkedObjectIDs().filter((id) => {
                    return id !== obj.objID;
                  }));
                  // dispatch<ChangeAction>({
                  //   type: 'storageHomePage/change',
                  //   payload: {
                  //     checkedObjectIDs: storageHomePage.checkedObjectIDs.filter((id) => {
                  //       return id !== record.id;
                  //     }),
                  //   },
                  // });
                }
              }}
            />
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
          </Space>
          <div />
          {/*<FComponentsLib.FRectBtn*/}
          {/*  type='secondary'*/}
          {/*  size='small'*/}
          {/*  onClick={() => {*/}
          {/*    onSelect && onSelect([]);*/}
          {/*    set_visible(false);*/}
          {/*  }}*/}
          {/*>选择</FComponentsLib.FRectBtn>*/}
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
        loadData(false);
      }}
    />
  </FDrawer>);
}

export default FObjectsSelectorDrawer;
