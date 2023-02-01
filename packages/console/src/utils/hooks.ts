import * as React from 'react';

export function useGetState<T>(initVal: T): [T, (newVal: T) => void, () => T] {
  const [state, setState] = React.useState<T>(initVal);
  const ref = React.useRef<T>(initVal);

  function setStateCopy(newVal: T): void {
    ref.current = newVal;
    setState(newVal);
  }

  function getState(): T {
    return ref.current;
  }

  return [state, setStateCopy, getState];
}
