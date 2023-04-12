export interface IResourceCreateVersionDraft {
  versionInput: string;
  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  baseProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customOptionsData: {
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
  descriptionEditorInput: string;
}
