import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { buildPageList } from '../table.utils';

export interface VzPaginationLabels {
  showing: string;
  of: string;
  perPage: string;
  first: string;
  previous: string;
  next: string;
  last: string;
  page: string;
  navigation: string;
}

export const VZ_PAGINATION_DEFAULT_LABELS: VzPaginationLabels = {
  showing: 'Mostrando',
  of: 'de',
  perPage: 'Filas por página',
  first: 'Primera página',
  previous: 'Página anterior',
  next: 'Página siguiente',
  last: 'Última página',
  page: 'Página',
  navigation: 'Paginación',
};

@Component({
  selector: 'vz-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VzPaginationComponent {
  readonly page = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly total = input<number>(0);
  readonly pageSizes = input<number[]>([10, 25, 50, 100]);
  readonly showInfo = input<boolean>(true);
  readonly showSizeSelector = input<boolean>(true);
  readonly labels = input<Partial<VzPaginationLabels>>({});

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  protected readonly lbl = computed(() => ({ ...VZ_PAGINATION_DEFAULT_LABELS, ...this.labels() }));
  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));
  protected readonly current = computed(() => Math.min(Math.max(1, this.page()), this.totalPages()));
  protected readonly pages = computed(() => buildPageList(this.current(), this.totalPages()));
  protected readonly rangeStart = computed(() => (this.total() === 0 ? 0 : (this.current() - 1) * this.pageSize() + 1));
  protected readonly rangeEnd = computed(() => Math.min(this.current() * this.pageSize(), this.total()));
  protected readonly sizeOptions = computed(() => {
    const sizes = this.pageSizes();
    return sizes.includes(this.pageSize()) ? sizes : [...sizes, this.pageSize()].sort((a, b) => a - b);
  });

  protected go(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    if (target !== this.current()) {
      this.pageChange.emit(target);
    }
  }

  protected onSizeChange(event: Event): void {
    this.pageSizeChange.emit(Number((event.target as HTMLSelectElement).value));
  }
}
