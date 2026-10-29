import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CodeBlockComponent } from '../code-block/code-block.component';

export type WorkbenchCanvasBg = 'dots' | 'white' | 'slate';

@Component({
  selector: 'app-workbench',
  standalone: true,
  imports: [CodeBlockComponent],
  templateUrl: './workbench.component.html',
  styleUrl: './workbench.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchComponent {
  readonly title = input<string>('Diseñador en vivo');
  readonly code = input<string>('');
  readonly lastEvent = input<string>('');

  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly canvasBg = signal<WorkbenchCanvasBg>('dots');
}

