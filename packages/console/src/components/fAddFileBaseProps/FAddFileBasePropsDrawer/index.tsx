import * as React from 'react';
import styles from './index.less';
import { ResourceVersionCreatorPageModelState } from '@/models/resourceVersionCreatorPage';
import FBasePropsEditorDrawer from '@/components/FBasePropsEditorDrawer';

interface FAddFileBasePropsDrawerProps {
  onOk?(): void;

  onClose?(): void;
}

function FAddFileBasePropsDrawer({ onOk, onClose }: FAddFileBasePropsDrawerProps) {

  const [visible, set_visible] = React.useState<boolean>(true);

  return (<FBasePropsEditorDrawer
    visible={resourceVersionCreatorPage.basePropertiesEditorVisible}
    dataSource={resourceVersionCreatorPage.basePropertiesEditorData}
    disabledKeys={[
      ...resourceVersionCreatorPage.rawProperties.map<string>((rp) => rp.key),
      ...resourceVersionCreatorPage.baseProperties.map<string>((bp) => bp.key),
      ...resourceVersionCreatorPage.customOptionsData.map<string>((pp) => pp.key),
    ]}
    onChange={(value) => {
      onChange({
        basePropertiesEditorData: value,
      });
    }}
    onCancel={() => {
      onChange({
        basePropertiesEditorData: [],
        basePropertiesEditorVisible: false,
      });
    }}
    onConfirm={() => {
      onChange({
        basePropertiesEditorData: [],
        basePropertiesEditorVisible: false,
        baseProperties: [
          ...resourceVersionCreatorPage.baseProperties,
          ...resourceVersionCreatorPage.basePropertiesEditorData.map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((bped) => {
            return {
              key: bped.key,
              value: bped.value,
              description: bped.description,
            };
          }),
        ],
      });
    }}
  />);
}

export default FAddFileBasePropsDrawer;
