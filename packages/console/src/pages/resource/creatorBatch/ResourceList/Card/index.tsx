import * as React from 'react';
import styles from './index.less';
import FComponentsLib from '@freelog/components-lib';
import FCoverImage from '@/components/FCoverImage';
import FResourceNameInput from '@/components/FResourceNameInput';
import FResourceLabelEditor2 from '@/components/FResourceLabelEditor2';
import { Space } from 'antd';
import { FI18n, FUtil } from '@freelog/tools-lib';
import FTooltip from '@/components/FTooltip';
import fResourcePropertyEditor from '@/components/fResourcePropertyEditor';
import FResourceProperties from '@/components/FResourceProperties';

interface CardProps {
  order: number;
  info: {
    fileUID: string;
    fileName: string;
    sha1: string;
    cover: string;
    resourceName: string;
    resourceTitle: string;
    resourceLabels: string[];
    resourcePolicies: {
      title: string;
      text: string;
    }[];
    showMore: boolean;
    rawProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    additionalProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customConfigurations: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
    directDependencies: {
      id: string;
      name: string;
      type: 'resource' | 'object';
      versionRange?: string;
    }[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  };

  onChange?(value: CardProps['info']): void;

  onDelete?(): void;

  onAddPolicy?(): void;
}

function Card({ order, info, onChange, onDelete, onAddPolicy }: CardProps) {

  const [$showMore, set$showMore, get$showMore] = FUtil.Hook.useGetState<boolean>(false);

  return (<div className={styles.resourceContainer}>
    <div className={styles.resourceOrder}>
      <FComponentsLib.FContentText text={`资源${order}`} type={'highlight'} style={{ fontSize: 12 }} />
      <FComponentsLib.FTextBtn
        style={{ fontSize: 12 }}
        type={'danger'}
        onClick={() => {
          onDelete && onDelete();
        }}
      >
        <FComponentsLib.FIcons.FDelete style={{ fontSize: 12 }} />
        &nbsp;删除
      </FComponentsLib.FTextBtn>
    </div>
    <div style={{ height: 5 }} />
    <div className={styles.whiteCard}>
      <div className={styles.whiteCardLeft}>
        <FCoverImage
          src={info.cover}
          width={240}
          style={{ display: 'block' }}
        />
        <div style={{ height: 10 }} />
        <FComponentsLib.FTextBtn
          type={'primary'}>上传封面</FComponentsLib.FTextBtn>
      </div>
      <div className={styles.whiteCardRight}>
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'文件名'} type={'negative'} />
          <FComponentsLib.FContentText text={info.fileName} type={'normal'} style={{ width: 540 }} />
        </div>
        <div style={{ height: 15 }} />
        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'授权标识'} type={'negative'} />
          <FResourceNameInput
            userName={'freelog'}
            value={info.resourceName}
            onChange={(value) => {
              onChange && onChange({
                ...info,
                resourceName: value,
              });
            }}
          />
        </div>
        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'资源标题'} type={'negative'} />
          <FComponentsLib.FInput.FSingleLine
            lengthLimit={-1}
            value={info.resourceTitle}
            style={{
              height: 38,
              borderRadius: 4,
              border: '1px solid #D4D4D4',
              width: 540,
            }}
            onChange={(e) => {
              onChange && onChange({
                ...info,
                resourceTitle: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'资源标签'} type={'negative'} />
          <FResourceLabelEditor2
            value={info.resourceLabels}
            onChange={(value) => {
              onChange && onChange({
                ...info,
                resourceLabels: value,
              });
            }}
          />
        </div>
        <div style={{ height: 15 }} />

        <div className={styles.whiteCardRightRow}>
          <FComponentsLib.FContentText text={'资源策略'} type={'negative'} />
          <div style={{ width: 540 }}>
            <Space
              size={5}
              onClick={() => {
                onAddPolicy && onAddPolicy();
              }}
            >
              <FComponentsLib.FTextBtn><FComponentsLib.FIcons.FAdd /></FComponentsLib.FTextBtn>
              <FComponentsLib.FTextBtn>添加策略</FComponentsLib.FTextBtn>
            </Space>
          </div>
        </div>
      </div>
    </div>

    <div style={{ height: 10 }} />
    <Space size={10}>
      <FComponentsLib.FTextBtn
        onClick={() => {
          set$showMore(!get$showMore());
        }}
      >{$showMore ? '收起更多设置' : '更多设置'}</FComponentsLib.FTextBtn>
      <FComponentsLib.FContentText text={'可以为资源文件添加属性，或进行依赖资源的声明'} type={'negative'} />
    </Space>

    {
      $showMore && (<>
        <div style={{ height: 5 }} />
        <div className={styles.block}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FComponentsLib.FContentText text={'基础属性'} type={'highlight'} />
            {
              info.customProperties.length < 30 && (
                <FTooltip title={FI18n.i18nNext.t('resourceinfo_add_btn_info')}>
                  <div>
                    <FComponentsLib.FTextBtn
                      style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
                      type='primary'
                      onClick={async () => {
                        const dataSource: {
                          key: string;
                          name: string;
                          value: string;
                          description: string;
                        } | null = await fResourcePropertyEditor({
                          disabledKeys: [
                            ...info.rawProperties.map<string>((rp) => rp.key),
                            ...info.additionalProperties.map<string>((rp) => rp.key),
                            ...info.customProperties.map<string>((bp) => bp.key),
                            ...info.customConfigurations.map<string>((pp) => pp.key),
                          ],
                          disabledNames: [
                            ...info.rawProperties.map<string>((rp) => rp.name),
                            ...info.additionalProperties.map<string>((rp) => rp.name),
                            ...info.customProperties.map<string>((bp) => bp.name),
                            ...info.customConfigurations.map<string>((pp) => pp.name),
                          ],
                        });
                        // console.log(dataSource, 'dataSource9iojskldjflksdjflk');
                        if (!dataSource) {
                          return;
                        }
                        // await dispatch<OnChange_step2_customProperties_Action>({
                        //   type: 'resourceCreatorPage/onChange_step2_customProperties',
                        //   payload: {
                        //     value: [
                        //       ...resourceCreatorPage.step2_customProperties,
                        //       dataSource,
                        //     ],
                        //   },
                        // });
                      }}
                    >
                      <FComponentsLib.FIcons.FProperty style={{ fontSize: 14 }} />
                      <span>补充属性</span>
                    </FComponentsLib.FTextBtn>
                  </div>
                </FTooltip>)
            }

          </div>
          <div style={{ height: 20 }} />

          <FResourceProperties
            immutableData={info.rawProperties}
            onlyEditValueData={info.additionalProperties}
            alterableData={info.customProperties}
            onEdit_onlyEditValueData={async (value) => {
              // console.log(value, 'value sidjfoikjo sd value sdiofjlkj');
              const index: number = info.additionalProperties.findIndex((p) => {
                return p === value;
              });
              const dataSource: {
                key: string;
                name: string;
                value: string;
                description: string;
              } | null = await fResourcePropertyEditor({
                disabledKeys: [
                  ...info.rawProperties.map<string>((rp) => rp.key),
                  ...info.additionalProperties.map<string>((rp) => rp.key),
                  ...info.customProperties.map<string>((bp) => bp.key),
                  ...info.customConfigurations.map<string>((pp) => pp.key),
                ],
                disabledNames: [
                  ...info.rawProperties.map<string>((rp) => rp.name),
                  ...info.additionalProperties.map<string>((rp) => rp.name),
                  ...info.customProperties.map<string>((bp) => bp.name),
                  ...info.customConfigurations.map<string>((pp) => pp.name),
                ],
                defaultData: value,
                noneEditableFields: ['key', 'description', 'name'],
                valueAcceptNull: true,
              });
              if (!dataSource) {
                return;
              }
              // await dispatch<OnChange_step2_additionalProperties_Action>({
              //   type: 'resourceCreatorPage/onChange_step2_additionalProperties',
              //   payload: {
              //     value: resourceCreatorPage.step2_additionalProperties.map((v, i) => {
              //       if (i !== index) {
              //         return v;
              //       }
              //       return dataSource;
              //     }),
              //   },
              // });
            }}
            onEdit_alterableData={async (value) => {
              const index: number = info.customProperties.findIndex((p) => {
                return p === value;
              });
              const dataSource: {
                key: string;
                name: string;
                value: string;
                description: string;
              } | null = await fResourcePropertyEditor({
                disabledKeys: [
                  ...info.rawProperties.map<string>((rp) => rp.key),
                  ...info.additionalProperties.map<string>((rp) => rp.key),
                  ...info.customProperties.map<string>((bp) => bp.key),
                  ...info.customConfigurations.map<string>((pp) => pp.key),
                ],
                disabledNames: [
                  ...info.rawProperties.map<string>((rp) => rp.name),
                  ...info.additionalProperties.map<string>((rp) => rp.name),
                  ...info.customProperties.map<string>((bp) => bp.name),
                  ...info.customConfigurations.map<string>((pp) => pp.name),
                ],
                defaultData: value,
              });
              if (!dataSource) {
                return;
              }

              // await dispatch<OnChange_step2_customProperties_Action>({
              //   type: 'resourceCreatorPage/onChange_step2_customProperties',
              //   payload: {
              //     value: resourceCreatorPage.step2_customProperties.map((v, i) => {
              //       if (i !== index) {
              //         return v;
              //       }
              //       return dataSource;
              //     }),
              //   },
              // });
            }}
            onDelete_alterableData={async (value) => {
              // console.log(value, 'AAAAAAsdofijsdflksdjfldsjlkj');
              // await dispatch<OnChange_step2_customProperties_Action>({
              //   type: 'resourceCreatorPage/onChange_step2_customProperties',
              //   payload: {
              //     value: resourceCreatorPage.step2_customProperties.filter((v, i) => {
              //       return v.key !== value.key && v.name !== value.name;
              //     }),
              //   },
              // });
            }}
          />
        </div>
      </>)
    }


  </div>);
}

export default Card;
