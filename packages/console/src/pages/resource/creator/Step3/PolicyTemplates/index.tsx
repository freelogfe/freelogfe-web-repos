import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import { useGetState } from '@/utils/hooks';
import { FServiceAPI } from '@freelog/tools-lib';
import { Base64 } from 'js-base64';
import * as AHooks from 'ahooks';

interface PolicyTemplatesProps {
  onSelect?({ title, text }: { title: string, text: string }): void;
}

function PolicyTemplates({ onSelect }: PolicyTemplatesProps) {

  const [$policyTemplates, set$policyTemplates, get$policyTemplates] = useGetState<{
    id: string;
    title: string;
    code: string;
    translation: string;
  }[]>([]);

  const [$open, set$open, get$open] = useGetState<boolean>(false);

  AHooks.useMount(async () => {
    const { data }: {
      data: {
        template: string;
        title: string;
        _id: string;
      }[]
    } = await FServiceAPI.Policy.policyTemplates();
    // console.log(data, ' 98ioskdjfksdjlfsjdflksjdlkj');
    const allP: Array<Promise<any>> = data.map((d, i) => {
      const t: string = d.template.replace(/(\t|\r)/g, ' ');
      const e: string = Base64.encode(t);
      return FServiceAPI.Policy.policyTranslation({ contract: e });
    });

    const results: string[] = (await Promise.all(allP)).map((r) => {
      return r.data;
    });
    // console.log(results, '90ujsiodjflksaf09we3ujoiflsdjflksdjflksdjflksj');
    set$policyTemplates(data.map((d, i: number) => {
      return {
        id: d._id,
        title: d.title || ('标题' + i),
        code: d.template,
        translation: results[i],
      };
    }));
  });

  return (<div>
    <div className={styles.policyTemplates}>
      {
        $policyTemplates
          .filter((pt, pti) => {
            return $open || pti < 4;
          })
          .map((pt, pi) => {
            return (<a
              key={pi}
              className={styles.policyTemplate}
              onClick={() => {
                onSelect && onSelect({ text: pt.code, title: pt.title });
              }}
            >
              <FComponentsLib.FTitleText key={pt.id} text={pt.title} type={'h1'} />
              <div style={{ height: 15 }} />
              {/*<FComponentsLib.FContentText text={'公开（所有缔约方可签约）'} />*/}
              {
                pt.translation.split('\n').map((t, ti) => {
                  return (<FComponentsLib.FContentText text={t} key={ti} />);
                })
              }

              {/*<FComponentsLib.FContentText text={'免费试用1个星期，支付200羽币，可获得1个月授权。'} />*/}
            </a>);
          })
      }

    </div>
    <div style={{ height: 20 }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {
        !$open && (<FComponentsLib.FTextBtn
          style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          onClick={() => {
            set$open(true);
          }}
        >
          <span>更多策略模板</span>
          <FComponentsLib.FIcons.FDown style={{ fontSize: 14 }} />
        </FComponentsLib.FTextBtn>)
      }

      {
        $open && (<FComponentsLib.FTextBtn
          style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          onClick={() => {
            set$open(false);
          }}
        >
          <span>收起</span>
          <FComponentsLib.FIcons.FUp />
        </FComponentsLib.FTextBtn>)
      }

    </div>
  </div>);
}

export default PolicyTemplates;
