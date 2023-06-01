import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n, FServiceAPI } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import * as AHooks from 'ahooks';

interface FResourceLabelEditorProps {
  value: string[];
  resourceType: string;
  onChange?: (values: string[]) => void;
}

interface FResourceLabelEditorStates {
  labels1: {
    id: string;
    name: string;
    description: string;
  }[];
  labels2: {
    id: string;
    name: string;
    description: string;
  }[];
}

const initState: FResourceLabelEditorStates = {
  labels1: [],
  labels2: [],
};

function FResourceLabelEditor({ value, resourceType, onChange }: FResourceLabelEditorProps) {

  const [state, setState] = AHooks.useSetState<FResourceLabelEditorStates>(initState);

  AHooks.useMount(async () => {
    if (resourceType === '') {
      return;
    }
    const { data: data_availableTags }: {
      data: {
        tagId: string;
        tagType: 1 | 2;
        tagName: string;
      }[];
    } = await FServiceAPI.Resource.availableTags({
      resourceType: resourceType,
    });
    // console.log(data, '*****LJLKJLKJ');
    setState({
      labels1: data_availableTags
        .filter((d) => {
          return d.tagType === 1;
        })
        .map((d) => {
          return {
            id: d.tagId,
            name: d.tagName,
            description: '',
          };
        }),
      labels2: data_availableTags
        .filter((d) => {
          return d.tagType === 2;
        })
        .map((d) => {
          return {
            id: d.tagId,
            name: d.tagName,
            description: '',
          };
        }),
    });
  });

  return (<div>
    <FComponentsLib.FInput.FSingleLine
      lengthLimit={-1}
      value={''}
      placeholder={FI18n.i18nNext.t('hint_add_resource_tag')}
      className={[styles.Input].join(' ')}
    />
    <div style={{ height: 5 }} />
    <div className={styles.errorTip}>请输入</div>
    <div style={{ height: 20 }} />
    <div className={styles.selectedLabels}>
      {
        value.map((v) => {
          return (<label key={v} className={styles.selectedLabel}>
            <span>{v}</span>
            <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
          </label>);
        })
      }


    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐标签:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      {
        state.labels1.map((l) => {
          return (<FTooltip
            title={l.description}
            placement={'top'}
            key={l.id}
            visible={l.description === '' ? false : undefined}
          >
            <label className={[styles.Label, value.includes(l.name) ? styles.selected : ''].join(' ')}>{l.name}</label>
          </FTooltip>);
        })
      }
    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐活动:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      {
        state.labels2.map((l) => {
          return (<FTooltip
            title={l.description}
            placement={'top'}
            key={l.id}
            visible={l.description === '' ? false : undefined}
          >
            <label className={[styles.Label, value.includes(l.name) ? styles.selected : ''].join(' ')}>#{l.name}#</label>
          </FTooltip>);
        })
      }
    </div>
  </div>);
}

export default FResourceLabelEditor;
