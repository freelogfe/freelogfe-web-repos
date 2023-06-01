import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { FI18n } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';

interface FResourceLabelEditorProps {

}

function FResourceLabelEditor({}: FResourceLabelEditorProps) {
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
      <label className={styles.selectedLabel}>
        <span>标签1标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
      <label className={styles.selectedLabel}>
        <span>标签2标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
      <label className={styles.selectedLabel}>
        <span>标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
      <label className={styles.selectedLabel}>
        <span>标签1标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
      <label className={styles.selectedLabel}>
        <span>标签2标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
      <label className={styles.selectedLabel}>
        <span>标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1</span>
        <FComponentsLib.FIcons.FClose style={{ fontSize: 12 }} />
      </label>
    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐标签:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      <FTooltip title={'参与即赢2000元现金奖励'} placement={'top'}>
        <label className={styles.Label}>
          标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
        </label>
      </FTooltip>
      <label className={[styles.Label, styles.selected].join(' ')}>
        标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
      </label>
      <label className={[styles.Label, styles.selected].join(' ')}>
        标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
      </label>
    </div>

    <div style={{ height: 25 }} />

    <FComponentsLib.FContentText text={'推荐活动:'} type={'additional2'} />
    <div style={{ height: 10 }} />
    <div className={styles.Labels}>
      <label className={styles.Label}>
        标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
      </label>
      <label className={[styles.Label, styles.selected].join(' ')}>
        标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
      </label>
      <label className={[styles.Label, styles.selected].join(' ')}>
        标签3标签1标签1标签1标签1标签1标签1标签1标签1标签1
      </label>
    </div>
  </div>);
}

export default FResourceLabelEditor;
