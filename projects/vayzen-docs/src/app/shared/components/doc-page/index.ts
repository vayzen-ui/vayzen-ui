import { DocHeaderComponent } from './doc-header.component';
import { DocSidebarComponent, DocTocItem } from './doc-sidebar.component';
import { DocApiTableComponent } from './doc-api-table.component';

export * from './doc-header.component';
export * from './doc-sidebar.component';
export * from './doc-api-table.component';

export const DOC_PAGE_SHARED_COMPONENTS = [
  DocHeaderComponent,
  DocSidebarComponent,
  DocApiTableComponent,
] as const;

