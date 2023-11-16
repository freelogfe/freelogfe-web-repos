export interface IResourceCreateVersionDraftType {
  versionInput: string;
  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  additionalProperties: {
    key: string;
    value: string;
  }[];
  customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  customConfigurations: {
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
