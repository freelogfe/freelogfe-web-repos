import * as React from 'react';
import styles from './index.less';
import FSelect from '@/components/FSelect';
// import { OnChange_Resource_Type_Action, ResourceCreatorPageModelState } from '@/models/resourceCreatorPage';
import FAutoComplete from '@/components/FAutoComplete';
import { Space } from 'antd';
import { FI18n } from '@freelog/tools-lib';

const resource_TypeData: {
  value: string;
  parentValue: string;
}[] = [
  // { value: '请选择大类', parentValue: '' },
  { value: '主题', parentValue: '#' },
  { value: '插件', parentValue: '#' },
  { value: '阅读', parentValue: '#' },
  { value: '音频', parentValue: '#' },
  { value: '图片', parentValue: '#' },
  { value: '视频', parentValue: '#' },
  { value: '游戏', parentValue: '#' },
  { value: '文章', parentValue: '阅读' },
  { value: '演示文稿', parentValue: '阅读' },
  { value: '音效', parentValue: '音频' },
  { value: '音乐', parentValue: '音频' },
  { value: '播客节目', parentValue: '音频' },
  { value: '照片', parentValue: '图片' },
  { value: '插画', parentValue: '图片' },
  // { value: '播客节目', parentValue: '图片' },
  { value: '动态影像', parentValue: '视频' },
  { value: '实拍片段', parentValue: '视频' },
  { value: '短视频', parentValue: '视频' },
  { value: '长视频', parentValue: '视频' },
  { value: '红白机', parentValue: '游戏' },
];

type Data = {
  value: string;
  valueError: string;
  // options: string[];
}[];

interface FResourceTypeInputProps {
  dataSource: Data;

  onChange?(value: Data): void;
}

function FResourceTypeInput({ dataSource, onChange }: FResourceTypeInputProps) {

  // const [formArr, setFormArr] = React.useState<null[]>(Array(dataSource.length).fill(null));
  //
  // React.useEffect(() => {
  //   setFormArr(Array(dataSource.length).fill(null));
  //   console.log(dataSource.length, 'dataSource.length09iow3jlsdkfjlsdkjfl')
  // }, [dataSource.length]);

  function onChangeData(value: string, index: number) {
    let valueError: string = '';
    if (value === '') {
      valueError = '请输入资源类型';
    } else if (value.length > 20) {
      valueError = '不多于20个字符';
    }

    let resource_Type: Data = dataSource.slice(0, index + 1);
    resource_Type = resource_Type.map((i, j) => {
      // [payload.index]['value'] = payload.value;
      if (j !== index) {
        return i;
      }
      return {
        ...i,
        value: value,
        valueError,
      };
    });
    // console.log(resource_Type, 'resource_Typeresource_Typeresource_Typeresource_Type89io3qwefsdlkf');

    const nextOptions = resource_TypeData.filter((i) => {
      return i.parentValue === value;
    });
    // console.log(nextOptions, 'nextOptions290iojweokfjsdlkj');
    if (nextOptions.length > 0) {
      resource_Type = [
        ...resource_Type,
        {
          value: '',
          valueError: '',
        },
      ];
    }

    onChange && onChange(resource_Type);
  }

  return (<Space size={10}>
    {
      Array(dataSource.length).fill(null)
        .map((_, i) => {
          if (i === 0) {
            return (<FSelect
              key={i}
              // key={resourceCreatorPage.resource_Type[0].value}
              dataSource={resource_TypeData
                .filter((rt) => {
                  return rt.parentValue === '#';
                })
                .map((o) => {
                  return {
                    value: o.value,
                    title: o.value,
                  };
                })}
              value={dataSource[i].value || undefined}
              onChange={(value) => {
                onChangeData(value, i);
              }}
              className={styles.FSelect}
              placeholder={'请选择大类'}
            />);
          }
          return (<FAutoComplete
            key={i}
            options={resource_TypeData
              .filter((rt) => {
                return rt.parentValue === dataSource[i - 1].value;
              })
              .map((o) => {
                return {
                  value: o.value,
                  label: o.value,
                };
              })}
            value={dataSource[i].value}
            errorText={dataSource[i].valueError}
            onChange={(value) => {
              onChangeData(value, i);
            }}
            className={styles.FSelect}
            placeholder={FI18n.i18nNext.t('hint_choose_resource_type')}
          />);
        })
    }

  </Space>);
}

export default FResourceTypeInput;
