import * as React from 'react';

import styles from './index.less';
import FMenu, { FMenuProps } from '../FMenu';
import FComponentsLib from '@freelog/components-lib';
import { FUtil } from '@freelog/tools-lib';

interface FDropdownMenuProps extends FMenuProps {
  children?: React.ReactNode;
  text?: React.ReactNode;
  onChange?: (value: string) => void;
}

function FDropdownMenu({ options, children, text, onChange }: FDropdownMenuProps) {
  const [$open, set$open, get$open] = FUtil.Hook.useGetState<boolean>(false);
  return (<FComponentsLib.FDropdown
    // @ts-ignore
    onOpenChange={(o: boolean) => {
      // console.log(o, 'siodfjlksdjflksdjfljdslfjlkj');
      set$open(o);
    }}
    overlay={<FMenu
      onClick={onChange}
      options={options} />}>
    {
      text ?
        (<div className={styles.text}>
          {text}
          {
            $open
              ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
              : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
          }

        </div>)
        : children
    }
  </FComponentsLib.FDropdown>);
}

export default FDropdownMenu;
