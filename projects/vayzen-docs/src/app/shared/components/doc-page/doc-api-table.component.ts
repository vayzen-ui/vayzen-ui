import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DocApiRow {
  name: string;
  type?: string;
  default?: string;
  description: string;
}

@Component({
  selector: 'app-doc-api-table',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'display: block; width: 100%; margin-bottom: 1.5rem;',
  },
  template: `
    @if (title()) {
      <h3 class="subsection-title">{{ title() }}</h3>
    }
    <div class="table-container">
      <table class="doc-table">
        <thead>
          <tr>
            @for (col of columns(); track col) {
              <th>{{ col }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track $index) {
            <tr>
              @for (cell of row; track $index; let cIdx = $index) {
                <td>
                  @if (cIdx === 0 || cIdx === 1 || (row.length === 4 && cIdx === 2)) {
                    <code>{{ cell }}</code>
                  } @else {
                    <span>{{ cell }}</span>
                  }
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocApiTableComponent {
  readonly title = input<string | undefined>(undefined);
  readonly columns = input<string[]>(['Nombre', 'Tipo', 'Defecto', 'Descripción']);
  readonly rows = input.required<string[][]>();
}

