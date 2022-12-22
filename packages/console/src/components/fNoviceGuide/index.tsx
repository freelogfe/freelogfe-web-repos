import * as React from 'react';
import styles from './index.less';
import * as ReactDOM from 'react-dom/client';
import FNoviceGuider from '@/components/FNoviceGuider';

const NOVICE_GUIDE_LOCALSTORAGE_KEY = 'NoviceGuide';

type ContentKey = 'dashboardPage';
type ContentValue = 'finished';

type NoviceGuideLocalStorageContent = {
  [k in ContentKey]?: ContentValue;
};

export function getNoviceGuide_LocalStorage_Content(key: ContentKey) {
  const contentString: string = self.localStorage.getItem(NOVICE_GUIDE_LOCALSTORAGE_KEY) || '{}';
  const content: NoviceGuideLocalStorageContent = JSON.parse(contentString);
  return content[key];
}

export function setNoviceGuide_LocalStorage_Content(key: ContentKey, value: ContentValue) {
  const contentString: string = self.localStorage.getItem(NOVICE_GUIDE_LOCALSTORAGE_KEY) || '{}';
  const content: NoviceGuideLocalStorageContent = JSON.parse(contentString);
  const newContentString: string = JSON.stringify({
    ...content,
    [key]: value,
  });
  self.localStorage.setItem(NOVICE_GUIDE_LOCALSTORAGE_KEY, newContentString);
}

interface fNoviceGuideProps {
  windowInfo: {
    top: number;
    left: number;
    width: number;
    height: number;
  };

  title: string;
  step: number;
  total: number;
}

let root: any;

function fNoviceGuide({ windowInfo, title, step, total }: fNoviceGuideProps): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    root = ReactDOM.createRoot(document.getElementById('novice-guide-root') as HTMLDivElement);
    return root.render(<FNoviceGuider
      windowInfo={windowInfo}
      title={title}
      step={step}
      total={total}
      onClickNext={() => {
        resolve(true);
        root.unmount();
      }}
      onClickSkip={() => {
        resolve(false);
        root.unmount();
      }}
    />);
  });
}

export default fNoviceGuide;

export function clear() {
  root?.unmount();
}


