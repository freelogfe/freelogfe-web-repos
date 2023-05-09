import * as React from 'react';
import styles from './index.less';
import { Space } from 'antd';
import FTooltip from '../FTooltip';
import fConfirmModal from '@/components/fConfirmModal';
import FComponentsLib from '@freelog/components-lib';
import FOverflowTooltip from '@/components/FOverflowTooltip';

interface FBasePropertiesCardsProps {
  rawProperties: {
    theKey: string;
    value: string;
  }[];
  baseProperties: {
    theKey: string;
    description: string;
    value: string;
  }[];

  onEdit?(theKey: string): void;

  onDelete?(theKey: string): void;
}

function FBasePropertiesCards({ rawProperties, baseProperties, onEdit, onDelete }: FBasePropertiesCardsProps) {
  return (<div className={styles.styles}>
    {
      rawProperties.map((rp) => {
        return (<div className={styles.rawProperties} key={rp.theKey}>
          <div>
            <div style={{ height: 5 }} />
            {/*<FComponentsLib.FContentText text={rp.theKey} type='additional2' />*/}
            <FOverflowTooltip
              text={rp.theKey}
              style={{
                lineHeight: '18px',
                color: '#999',
                fontSize: 12,
              }}
            />
            <div style={{ height: 10 }} />
            {/*<FComponentsLib.FContentText singleRow text={rp.value} />*/}
            <FOverflowTooltip
              text={rp.value}
              style={{
                fontWeight: 400,
                lineHeight: '20px',
                color: '#222',
                fontSize: 14,
              }}
            />
          </div>
        </div>);
      })
    }

    {
      baseProperties.map((bp) => {
        return (<div className={styles.baseProperty} key={bp.theKey}>
          <div>
            <div>
              <Space size={5}>
                {/*<FComponentsLib.FContentText*/}
                {/*  text={bp.theKey}*/}
                {/*  type='additional2'*/}
                {/*  singleRow*/}
                {/*  style={{*/}
                {/*    maxWidth: 80,*/}
                {/*  }}*/}
                {/*/>*/}
                <FOverflowTooltip
                  text={bp.theKey}
                  style={{
                    lineHeight: '18px',
                    color: '#999',
                    fontSize: 12,
                    maxWidth: 80,
                  }}
                />
                {bp.description && (
                  <FTooltip title={bp.description}><FComponentsLib.FIcons.FInfo
                    style={{ cursor: 'pointer', fontSize: 14 }} /></FTooltip>)}
              </Space>
              <div style={{ height: 10 }} />
              {/*<FComponentsLib.FContentText*/}
              {/*  singleRow*/}
              {/*  text={bp.value}*/}
              {/*  style={{ maxWidth: 110 }}*/}
              {/*/>*/}
              <FOverflowTooltip
                text={bp.value}
                style={{
                  fontWeight: 400,
                  lineHeight: '20px',
                  color: '#222',
                  fontSize: 14,
                  maxWidth: 110,
                }}
              />
            </div>
            <Space size={10} className={styles.Operation}>
              {
                onEdit && (<FTooltip title={'编辑'}>
                  <div>
                    <FComponentsLib.FCircleBtn
                      type='minor'
                      onClick={() => {
                        onEdit(bp.theKey);
                      }}
                    />
                  </div>
                </FTooltip>)
              }

              {
                onDelete && (<FTooltip title={'删除'}>
                  <div>
                    <FComponentsLib.FCircleBtn
                      type='danger'
                      onClick={() => {
                        fConfirmModal({
                          message: '一旦删除则无法恢复，确认删除吗？',
                          onOk() {
                            onDelete(bp.theKey);
                          },
                        });
                      }}
                    />
                  </div>
                </FTooltip>)
              }

            </Space>
          </div>
        </div>);
      })
    }

  </div>);
}

export default FBasePropertiesCards;
