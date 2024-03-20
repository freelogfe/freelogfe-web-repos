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
    // open={true}
    // @ts-ignore
    onOpenChange={(o: boolean) => {
      set$open(o);
    }}
    overlay={(<div className={styles.menu}>
      <FMenu
        onClick={onChange}
        options={options}
      />
    </div>)}>
    {
      text && (<div className={styles.text}>
        {text}
        {
          $open
            ? (<FComponentsLib.FIcons.FUp style={{ fontSize: 12 }} />)
            : (<FComponentsLib.FIcons.FDown style={{ fontSize: 12 }} />)
        }
      </div>)
    }
    {
      !text && children
    }
  </FComponentsLib.FDropdown>);
}

export default FDropdownMenu;
