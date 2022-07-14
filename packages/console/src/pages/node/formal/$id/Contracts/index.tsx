import * as React from 'react';
import styles from './index.less';
import Sider from '@/pages/node/formal/$id/Sider';
import { FTitleText } from '@/components/FText';
import FDropdown from '@/components/FDropdown';
import FMenu from '@/components/FMenu';
import categoryData from '@/utils/category';
import { DownOutlined } from '@ant-design/icons';
import FDropdownMenu from '@/components/FDropdownMenu';
import { OnChange_Exhibit_InputFilter_Action, OnChange_Exhibit_SelectedStatus_Action } from '@/models/nodeManagerPage';
import { FDown } from '@/components/FIcons';
import FInput from '@/components/FInput';

interface ContractsProps {

}

function Contracts({}: ContractsProps) {
  return (<>
    <Helmet>
      <title>{`展品管理 · ${nodeManagerPage.nodeName} - Freelog`}</title>
    </Helmet>
    <FLeftSiderLayout
      type={nodeManagerPage.exhibit_ListState === 'noData' ? 'empty' : 'table'}
      sider={<Sider />}
      header={
        <div className={styles.header}>
          <FTitleText type="h1" text={`展品管理 (${nodeManagerPage.exhibit_ListTotal})`} />
          <Space size={80}>
            <div>
              <span>{FI18n.i18nNext.t('resource_type')}：</span>
              <FDropdown
                overlay={
                  <FMenu
                    options={[
                      {
                        value: '-1',
                        text: '全部',
                      },
                      ...categoryData.first.map((i, index) => {
                        return {
                          value: index + '',
                          text: i,
                        };
                      }),
                    ]}
                    value={category.first}
                    onClick={(value) => {
                      setCategory({
                        ...category,
                        first: value,
                        second: category.first === value ? category.second : '-1',
                      });
                      //onChangeResourceType && onChangeResourceType(value)
                    }}
                  />
                }
              >
                  <span style={{ cursor: 'pointer' }}>
                    {categoryData.first[category.first] || '全部'}
                    <DownOutlined style={{ marginLeft: 8 }} />
                  </span>
              </FDropdown>

              {category.first > 1 ? (
                <>
                  <span className="ml-30">子类型：</span>
                  <FDropdown
                    overlay={
                      <FMenu
                        // @ts-ignore
                        options={[
                          {
                            value: '-1',
                            text: '全部',
                          },
                          // @ts-ignore
                          ...categoryData.second[category.first].map((i, index) => {
                            return {
                              value: index + '',
                              text: i,
                            };
                          }),
                        ]}
                        onClick={(value) => {
                          setCategory({
                            ...category,
                            second: value,
                          });
                          // onChangeResourceType && onChangeResourceType(value)
                        }}
                      />
                    }
                  >
                      <span style={{ cursor: 'pointer' }}>
                        {
                          // @ts-ignore
                          categoryData.second[category.first][category.second] || '全部'
                        }
                        <DownOutlined style={{ marginLeft: 8 }} />
                      </span>
                  </FDropdown>
                </>
              ) : null}
            </div>
            <div>
              <span>状态：</span>
              <FDropdownMenu
                options={nodeManagerPage.exhibit_ResourceStateOptions}
                onChange={(value) => {
                  dispatch<OnChange_Exhibit_SelectedStatus_Action>({
                    type: 'nodeManagerPage/onChange_Exhibit_SelectedStatus',
                    payload: {
                      value: value,
                    },
                  });
                }}
              >
                  <span style={{ cursor: 'pointer' }}>
                    {
                      nodeManagerPage.exhibit_ResourceStateOptions.find((rso) => {
                        return rso.value === nodeManagerPage.exhibit_SelectedStatus.toString();
                      })?.text
                    }
                    <FDown style={{ marginLeft: 10 }} />
                  </span>
              </FDropdownMenu>
            </div>
            <div>
              <FInput
                className={styles.input}
                theme="dark"
                value={nodeManagerPage.exhibit_InputFilter}
                debounce={300}
                onDebounceChange={(value) => {
                  dispatch<OnChange_Exhibit_InputFilter_Action>({
                    type: 'nodeManagerPage/onChange_Exhibit_InputFilter',
                    payload: {
                      value: value,
                    },
                  });
                }}
              />
            </div>
          </Space>
        </div>
      }
    >
    </FLeftSiderLayout>);
}

export default Contracts;
