import { FUtil } from '@freelog/tools-lib';
import { report } from '@freelog/resource-policy-lang/dist';
import { ContractEntity } from '@freelog/resource-policy-lang/dist/tools/ContractTool';
const { compile } = require('@freelog/resource-policy-lang');

interface ICodeTranslationToTextParams {
  code: string;
  targetType: 'resource' | 'presentable';
}

export async function codeTranslationToText({ code, targetType }: ICodeTranslationToTextParams): Promise<{
  error: string[] | null;
  text?: string;
}> {
  try {
    const result = await compile(
      code,
      targetType,
      FUtil.Format.completeUrlByDomain('qi'),
      window.location.origin.endsWith('.freelog.com') ? 'prod' : 'dev',
    );
    const contract: ContractEntity = {
      audiences: result.state_machine.audiences,
      fsmStates: Object.entries<any>(result.state_machine.states)
        .map((st) => {
          return {
            name: st[0],
            serviceStates: st[1].serviceStates,
            events: st[1].transitions.map((ts: any) => {

              return {
                id: ts.code,
                name: ts.name,
                args: ts.args,
                state: ts.toState,
              };
            }),
          };
        }),
    };
    const rrr = report(contract);
    return {
      error: null,
      text: rrr.audienceInfos[0].content + rrr.content,
    };
  } catch (err) {
    return {
      error: [err.message],
    };
  }
}
