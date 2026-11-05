/**
 * Tipos e interfaces para VzFilePreviewerComponent (@vayzen-ui)
 */

export interface VzPreviewFile {
  name: string;
  size?: number;
  type?: string;
  url?: string;
  file?: File;
  badge?: string;
}

export type VzFileTypeCategory =
  | 'pdf'
  | 'image'
  | 'word'
  | 'excel'
  | 'code'
  | 'archive'
  | 'text'
  | 'other';

export interface VzRemoteFileOptions {
  name?: string;
  type?: string;
  size?: number;
}

