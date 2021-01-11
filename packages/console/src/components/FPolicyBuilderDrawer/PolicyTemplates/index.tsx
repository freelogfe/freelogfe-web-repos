import * as React from 'react';
import styles from './index.less';
import {FContentText} from '@/components/FText';
import {FDown} from "@/components/FIcons";
import {Space} from "antd";
import FUp from "@/components/FIcons/FUp";

interface PolicyTemplatesProps {
  onSelect?({title, text}: { title: string, text: string }): void;
}

const text1: string = `for public initial[active]:
  terminate`;

const text2: string =
  `for public:
  escrow account acct
  custom event acceptor.customEvent

  initial:
    recontractable
    proceed to auth on acct exceed 1 feather
  auth:
    presentable
    recontractable
    active
    proceed to refund on acct.confiscated
  refund:
    recontractable
    proceed to finish on acct.refunded
  finish:
    recontractable
    terminate`;

const policiesText: string[] = [];

function PolicyTemplates({onSelect}: PolicyTemplatesProps) {
  return (<Space
    direction="vertical"
    className={styles.styles}
    size={15}
  >
    <PolicyTemplate
      text={text1}
      title={'免费策略'}
      onSelect={() => onSelect && onSelect({text: text1, title: '免费策略'})}
    />
    <PolicyTemplate
      text={text2}
      title={'收费策略'}
      onSelect={() => onSelect && onSelect({text: text2, title: '收费策略'})}
    />
  </Space>);
}

export default PolicyTemplates;

interface PolicyTemplateProps {
  title: string;
  text: string;

  onSelect?(): void;
}

function PolicyTemplate({text, title, onSelect}: PolicyTemplateProps) {

  const [visibleText, setVisibleText] = React.useState<boolean>(false);

  return (<div>
    <div
      className={styles.header}
      onClick={() => setVisibleText(!visibleText)}
    >
      <Space size={10}>
        <FContentText text={title}/>
        <FContentText>{visibleText ? <FUp/> : <FDown/>}</FContentText>
      </Space>
      <a onClick={(e) => {
        e.stopPropagation();
        onSelect && onSelect();
      }}>选择</a>
    </div>

    {
      visibleText && (<>
        <div style={{height: 5}}/>
        <div className={styles.content}>
          <pre>{text}</pre>
        </div>
      </>)
    }

  </div>);
}
