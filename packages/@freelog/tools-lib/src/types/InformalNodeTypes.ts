
interface ICandidate {
  name: string;
  versionRange?: string;
  type: 'resource' | 'object';
}

export type OperationAndActionRecords  = {
  type: 'add' | 'alter' | 'set_labels' | 'online' | 'set_title' | 'set_cover' | 'add_attr' | 'delete_attr' | 'replace' | 'activate_theme';
  data: {
    exhibitName: string;

    candidate?: ICandidate;

    tags?: string[];
    coverImage?: string;
    title?: string;
    onlineStatus?: boolean;

    attrDescription?: string;
    attrKey?: string;
    attrValue?: string;

    replaced?: ICandidate;
    replacer?: ICandidate;
    scopes?: ICandidate[][];
  };
}[];
