import * as React from 'react';
import styles from './index.less';
import FDropdownMenu from '@/components/FDropdownMenu';
import { Space } from 'antd';
import {
  ChangeAction,
  ChangeVersionAction,
  ExhibitInfoPageModelState,
  OnBlur_Side_CustomOptions_ValueInput_Action,
  OnBlur_Side_InheritOptions_ValueInput_Action,
  OnChange_Side_CustomOptions_ValueInput_Action,
  OnChange_Side_InheritOptions_ValueInput_Action,
  OnClick_Side_CustomOptions_DeleteBtn_Action,
  OnClick_Side_InheritOptions_ResetBtn_Action,
  OnConfirm_AddCustomOptionsDrawer_Action,
  OnConfirm_CustomOptionDrawer_Action,
} from '@/models/exhibitInfoPage';
import FSelect from '@/components/FSelect';
// import FInput from '@/components/FInput';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import FTooltip from '@/components/FTooltip';
import fConfirmModal from '@/components/fConfirmModal';
import { FI18n } from '@freelog/tools-lib';
import FComponentsLib from '@freelog/components-lib';
import FOverflowTooltip from '@/components/FOverflowTooltip';
import fResourceOptionEditor from '@/components/fResourceOptionEditor';
import FResourcePropertyAndOptionTipPopover from '@/components/FResourcePropertyAndOptionTipPopover';

interface SettingProps {
  dispatch: Dispatch;
  exhibitInfoPage: ExhibitInfoPageModelState;
}

function Setting({ dispatch, exhibitInfoPage }: SettingProps) {

  const ref = React.useRef<any>(null);

  return (<>
    <FComponentsLib.FContentText text={FI18n.i18nNext.t('advanced_setting')} type='highlight' />
    <div style={{ height: 20 }} />

    <FComponentsLib.FTitleText text={FI18n.i18nNext.t('exhibit_version')} type='h4' />
    <div style={{ height: 15 }} />
    <FDropdownMenu
      options={[...exhibitInfoPage.side_AllVersions].reverse().map((av: string) => ({ value: av, text: av }))}
      onChange={(value) => {
        dispatch<ChangeVersionAction>({
          type: 'exhibitInfoPage/changeVersion',
          payload: value,
        });
      }}
    >
      <Space style={{ cursor: 'pointer' }} size={15}><FComponentsLib.FContentText
        text={exhibitInfoPage.side_Version} /><FComponentsLib.FIcons.FSwap /></Space>
    </FDropdownMenu>

    {
      exhibitInfoPage.side_SettingUnfold && (<>
        <div style={{ height: 30 }} />

        <FComponentsLib.FTitleText text={FI18n.i18nNext.t('resource_property')} type='h4' />
        <div style={{ height: 15 }} />
        <div className={styles.attr}>
          <table>
            <tbody>
            {
              exhibitInfoPage.side_RawProperties.map((rp) => {
                return (<tr key={rp.key}>
                  {/*<td><FComponentsLib.FContentText text={pb.key} /></td>*/}
                  <td>
                    <FResourcePropertyAndOptionTipPopover
                      info={{
                        key: rp.key,
                        name: rp.name,
                        description: rp.description,
                      }}
                      type={'property'}
                    >
                      <div><FComponentsLib.FContentText
                        text={rp.name}
                        style={{ maxWidth: 90 }}
                        singleRow
                      /></div>
                    </FResourcePropertyAndOptionTipPopover>
                    {/*<FOverflowTooltip*/}
                    {/*  text={rp.name}*/}
                    {/*  style={{*/}
                    {/*    fontWeight: 400,*/}
                    {/*    lineHeight: '20px',*/}
                    {/*    color: '#222',*/}
                    {/*    fontSize: 14,*/}
                    {/*    maxWidth: 90,*/}
                    {/*  }}*/}
                    {/*/>*/}
                  </td>
                  {/*<td><FComponentsLib.FContentText text={pb.value} /></td>*/}
                  <td>
                    <FOverflowTooltip
                      text={rp.value}
                      style={{
                        fontWeight: 400,
                        lineHeight: '20px',
                        color: '#222',
                        fontSize: 14,
                        maxWidth: 90,
                      }}
                    />

                  </td>
                </tr>);
              })
            }
            {
              exhibitInfoPage.side_BaseProperties.map((pb) => {
                return (<tr key={pb.key}>
                  {/*<td><FComponentsLib.FContentText text={pb.key} /></td>*/}
                  <td>
                    {/*<FOverflowTooltip*/}
                    {/*  text={pb.name}*/}
                    {/*  style={{*/}
                    {/*    fontWeight: 400,*/}
                    {/*    lineHeight: '20px',*/}
                    {/*    color: '#222',*/}
                    {/*    fontSize: 14,*/}
                    {/*    maxWidth: 90,*/}
                    {/*  }}*/}
                    {/*/>*/}
                    <FResourcePropertyAndOptionTipPopover
                      info={{
                        key: pb.key,
                        name: pb.name,
                        description: pb.description,
                      }}
                      type={'property'}
                    >
                      <div><FComponentsLib.FContentText
                        text={pb.name}
                        style={{ maxWidth: 90 }}
                        singleRow
                      /></div>
                    </FResourcePropertyAndOptionTipPopover>
                  </td>
                  {/*<td><FComponentsLib.FContentText text={pb.value} /></td>*/}
                  <td><FOverflowTooltip
                    text={pb.value}
                    style={{
                      fontWeight: 400,
                      lineHeight: '20px',
                      color: '#222',
                      fontSize: 14,
                      maxWidth: 90,
                    }}
                  />
                  </td>
                </tr>);
              })
            }
            </tbody>
          </table>
        </div>
        <div style={{ height: 30 }} />

        <FComponentsLib.FTitleText
          text={FI18n.i18nNext.t('custom_option')}
          type='h4'
        />

        <div style={{ height: 15 }} />

        <div className={styles.options} ref={ref}>
          {
            exhibitInfoPage.side_InheritOptions.map((io, index) => {
              return (<div key={io.key}>
                <div className={styles.optionTitle}>
                  <FResourcePropertyAndOptionTipPopover
                    info={{
                      key: io.key,
                      name: io.name,
                      description: io.description,
                    }}
                    type={'option'}
                  >
                    <div><FComponentsLib.FContentText
                      text={io.name} singleRow style={{ maxWidth: 160 }} /></div>
                  </FResourcePropertyAndOptionTipPopover>

                  {/*<Space size={10}>*/}
                  {/*  <FComponentsLib.FContentText text={io.name} />*/}
                  {/*  {*/}
                  {/*    io.description && (<FTooltip*/}
                  {/*      title={io.description}*/}
                  {/*      color={'#fff'}*/}
                  {/*    >*/}
                  {/*      <FComponentsLib.FIcons.FInfo*/}
                  {/*        style={{ cursor: 'pointer', fontSize: 14 }}*/}
                  {/*      />*/}
                  {/*    </FTooltip>)*/}
                  {/*  }*/}
                  {/*</Space>*/}

                  <FTooltip title={FI18n.i18nNext.t('tip_reset_value')}>
                    <div>
                      <FComponentsLib.FTextBtn
                        onClick={() => {
                          // onChangeCustomAttrs({ key: pc.key, value: pc.defaultValue || '' }, true);
                          dispatch<OnClick_Side_InheritOptions_ResetBtn_Action>({
                            type: 'exhibitInfoPage/onClick_Side_InheritOptions_ResetBtn',
                            payload: {
                              index: index,
                            },
                          });
                        }}
                      ><FComponentsLib.FIcons.FRedo /></FComponentsLib.FTextBtn>
                    </div>
                  </FTooltip>
                </div>
                <div style={{ height: 5 }} />
                {
                  io.type === 'select'
                    ? (<FSelect
                      className={styles.FSelect}
                      getPopupContainer={() => {
                        // console.log(ref.current, 'ref.currentiosdjflksdjflksjdklf sdaoifj;sldkfjlkj');
                        return ref.current;
                      }}
                      value={io.valueInput}
                      dataSource={io.options.map((d) => ({ value: d, title: d }))}
                      onChange={(value: string) => {
                        // onChangeCustomAttrs({ key: pc.key, value: value }, true);
                        dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                            value: value,
                          },
                        });
                      }}
                      onBlur={() => {
                        dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                          type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                          payload: {
                            index: index,
                          },
                        });
                      }}
                    />)
                    : (<div>
                      {/*<FInput*/}
                      {/*  className={styles.FInput}*/}
                      {/*  value={io.valueInput}*/}
                      {/*  // errorText={io.valueInputError}*/}
                      {/*  placeholder={'输入自定义选项'}*/}
                      {/*  onChange={(e) => {*/}
                      {/*    // onChangeCustomAttrs({ key: pc.key, value: e.target.value });*/}
                      {/*    dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({*/}
                      {/*      type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',*/}
                      {/*      payload: {*/}
                      {/*        index: index,*/}
                      {/*        value: e.target.value,*/}
                      {/*      },*/}
                      {/*    });*/}
                      {/*  }}*/}
                      {/*  onBlur={() => {*/}
                      {/*    dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({*/}
                      {/*      type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',*/}
                      {/*      payload: {*/}
                      {/*        index: index,*/}
                      {/*      },*/}
                      {/*    });*/}
                      {/*  }}*/}
                      {/*/>*/}
                      <FComponentsLib.FInput.FSingleLine
                        lengthLimit={-1}
                        className={styles.FInput}
                        value={io.valueInput}
                        // errorText={io.valueInputError}
                        placeholder={'输入自定义选项'}
                        onChange={(e) => {
                          // onChangeCustomAttrs({ key: pc.key, value: e.target.value });
                          dispatch<OnChange_Side_InheritOptions_ValueInput_Action>({
                            type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput',
                            payload: {
                              index: index,
                              value: e.target.value,
                            },
                          });
                        }}
                        onBlur={() => {
                          dispatch<OnBlur_Side_InheritOptions_ValueInput_Action>({
                            type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput',
                            payload: {
                              index: index,
                            },
                          });
                        }}
                      />
                      {
                        io.valueInputError !== '' && (<div style={{ color: '#EE4040' }}>{io.valueInputError}</div>)
                      }

                    </div>)
                }
              </div>);
            })
          }
          {
            exhibitInfoPage.side_CustomOptions.map((co, index) => {
              return (<div key={co.key}>
                <div className={styles.optionTitle}>
                  <FResourcePropertyAndOptionTipPopover
                    info={{
                      key: co.key,
                      name: co.name,
                      description: co.description,
                    }}
                    type={'option'}
                  >
                    <div><FComponentsLib.FContentText
                      text={co.name} singleRow style={{ maxWidth: 160 }} /></div>
                  </FResourcePropertyAndOptionTipPopover>
                  {/*<Space size={10}>*/}
                  {/*  <FComponentsLib.FContentText text={co.name} />*/}
                  {/*  {*/}
                  {/*    co.description && (<FTooltip*/}
                  {/*      title={co.description}*/}
                  {/*      color={'#fff'}*/}
                  {/*    >*/}
                  {/*      <FComponentsLib.FIcons.FInfo*/}
                  {/*        style={{ cursor: 'pointer', fontSize: 14 }}*/}
                  {/*      />*/}
                  {/*    </FTooltip>)*/}
                  {/*  }*/}
                  {/*</Space>*/}
                  <Space size={10}>
                    <FTooltip title={FI18n.i18nNext.t('tips_edit')}>
                      <div>
                        <FComponentsLib.FTextBtn
                          // theme="primary"
                          onClick={async () => {

                            const dataSource: {
                              key: string;
                              name: string;
                              type: 'input' | 'select';
                              input: string;
                              select: string[];
                              description: string;
                            } | null = await fResourceOptionEditor({
                              disabledKeys: [
                                ...exhibitInfoPage.side_RawProperties.map((ba) => ba.key),
                                ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.key),
                                ...exhibitInfoPage.side_InheritOptions.map((io) => io.key),
                                ...exhibitInfoPage.side_CustomOptions.map((co) => co.key),
                              ],
                              disabledNames: [
                                // ...exhibitInfoPage.side_RawProperties.map((ba) => ba.name),
                                ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.name),
                                ...exhibitInfoPage.side_InheritOptions.map((io) => io.name),
                                ...exhibitInfoPage.side_CustomOptions.map((co) => co.name),
                              ],
                              //co
                              defaultData: {
                                key: co.key,
                                name: co.name,
                                type: 'input',
                                input: co.value,
                                select: [],
                                description: co.description,
                              },
                              hideTypeSelect: true,
                            });

                            if (!dataSource) {
                              return;
                            }

                            dispatch<OnConfirm_CustomOptionDrawer_Action>({
                              type: 'exhibitInfoPage/onConfirm_CustomOptionDrawer',
                              payload: {
                                value: {
                                  key: dataSource.key,
                                  name: dataSource.name,
                                  value: dataSource.input,
                                  description: dataSource.description,
                                  valueType: 'input',
                                },
                              },
                            });
                          }}
                        ><FComponentsLib.FIcons.FEdit /></FComponentsLib.FTextBtn>
                      </div>
                    </FTooltip>
                    <FTooltip title={FI18n.i18nNext.t('tip_delete_custom_option')}>
                      <div>
                        <FComponentsLib.FIcons.FDelete
                          style={{ color: '#EE4040', cursor: 'pointer' }}
                          onClick={() => {
                            fConfirmModal({
                              message: '一旦删除则无法恢复，确认删除吗？',
                              onOk() {
                                dispatch<OnClick_Side_CustomOptions_DeleteBtn_Action>({
                                  type: 'exhibitInfoPage/onClick_Side_CustomOptions_DeleteBtn',
                                  payload: {
                                    index: index,
                                  },
                                });
                              },
                            });
                          }}
                        />
                      </div>
                    </FTooltip>
                  </Space>
                </div>
                <div style={{ height: 5 }} />
                {/*<FInput*/}
                {/*  placeholder={FI18n.i18nNext.t('hint_value_null')}*/}
                {/*  className={styles.FInput}*/}
                {/*  value={co.valueInput}*/}
                {/*  // errorText={co.valueInputError}*/}
                {/*  onChange={(e) => {*/}
                {/*    // console.log(e, 'eEEEEeeeeeEEE');*/}
                {/*    dispatch<OnChange_Side_CustomOptions_ValueInput_Action>({*/}
                {/*      type: 'exhibitInfoPage/onChange_Side_CustomOptions_ValueInput',*/}
                {/*      payload: {*/}
                {/*        index: index,*/}
                {/*        value: e.target.value,*/}
                {/*      },*/}
                {/*    });*/}
                {/*  }}*/}
                {/*  onBlur={() => {*/}
                {/*    dispatch<OnBlur_Side_CustomOptions_ValueInput_Action>({*/}
                {/*      type: 'exhibitInfoPage/onBlur_Side_CustomOptions_ValueInput',*/}
                {/*      payload: {*/}
                {/*        index: index,*/}
                {/*      },*/}
                {/*    });*/}
                {/*  }}*/}
                {/*/>*/}
                <FComponentsLib.FInput.FSingleLine
                  lengthLimit={-1}
                  placeholder={FI18n.i18nNext.t('hint_value_null')}
                  className={styles.FInput}
                  value={co.valueInput}
                  // errorText={co.valueInputError}
                  onChange={(e) => {
                    // console.log(e, 'eEEEEeeeeeEEE');
                    dispatch<OnChange_Side_CustomOptions_ValueInput_Action>({
                      type: 'exhibitInfoPage/onChange_Side_CustomOptions_ValueInput',
                      payload: {
                        index: index,
                        value: e.target.value,
                      },
                    });
                  }}
                  onBlur={() => {
                    dispatch<OnBlur_Side_CustomOptions_ValueInput_Action>({
                      type: 'exhibitInfoPage/onBlur_Side_CustomOptions_ValueInput',
                      payload: {
                        index: index,
                      },
                    });
                  }}
                />
                {
                  co.valueInputError !== '' && (<div style={{ color: '#EE4040' }}>{co.valueInputError}</div>)
                }
              </div>);
            })
          }
        </div>
        <div style={{ height: 20 }} />
        <Space
          className={styles.addCustomTitle}
          onClick={async () => {

            const dataSource: {
              key: string;
              name: string;
              type: 'input' | 'select';
              input: string;
              select: string[];
              description: string;
            } | null = await fResourceOptionEditor({
              disabledKeys: [
                ...exhibitInfoPage.side_RawProperties.map((ba) => ba.key),
                ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.key),
                ...exhibitInfoPage.side_InheritOptions.map((io) => io.key),
                ...exhibitInfoPage.side_CustomOptions.map((co) => co.key),
              ],
              disabledNames: [
                // ...exhibitInfoPage.side_RawProperties.map((ba) => ba.name),
                ...exhibitInfoPage.side_BaseProperties.map((ba) => ba.name),
                ...exhibitInfoPage.side_InheritOptions.map((io) => io.name),
                ...exhibitInfoPage.side_CustomOptions.map((co) => co.name),
              ],
              hideTypeSelect: true,
            });

            if (!dataSource) {
              return;
            }

            dispatch<OnConfirm_AddCustomOptionsDrawer_Action>({
              type: 'exhibitInfoPage/onConfirm_AddCustomOptionsDrawer',
              payload: {
                value: {
                  key: dataSource.key,
                  name: dataSource.name,
                  // type: 'input' | 'select';
                  input: dataSource.input,
                  // select: string[];
                  description: dataSource.description,
                },
              },
            });
          }}
        >
          <FComponentsLib.FCircleBtn
            // theme="text"
            size='small'
          />
          <span
            style={{ cursor: 'pointer', display: 'inline-block' }}
            onClick={() => {
              // dispatch<OnClick_Side_AddCustomOptionsBtn_Action>({
              //   type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn',
              // });
            }}
          >{FI18n.i18nNext.t('create_custom_options')}</span>
        </Space>
      </>)
    }

    <div style={{ height: 30 }} />
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FComponentsLib.FTextBtn
        type='default'
        onClick={() => {
          dispatch<ChangeAction>({
            type: 'exhibitInfoPage/change',
            payload: {
              side_SettingUnfold: !exhibitInfoPage.side_SettingUnfold,
            },
          });
        }}
      >{exhibitInfoPage.side_SettingUnfold ? <>{FI18n.i18nNext.t('btn_show_less')}
        <FComponentsLib.FIcons.FDoubleUp /></> : <>更多 <FComponentsLib.FIcons.FDoubleDown /></>}</FComponentsLib.FTextBtn>
    </div>
  </>);
}

export default connect(({ exhibitInfoPage }: ConnectState) => ({
  exhibitInfoPage,
}))(Setting);
