import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  VzCardContentDirective,
  VzCardDrawerDirective,
  VzCardHeaderDirective,
} from './card.directives';
import type {
  VzCardAccent,
  VzCardAccentPosition,
  VzCardComment,
  VzCardDensity,
  VzCardOrientation,
  VzCardTheme,
  VzCardVariant,
} from './card.types';

@Component({
  selector: 'vz-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.data-vz-theme]': "dark() || theme() === 'dark' ? 'dark' : (theme() ?? null)",
    '[attr.role]': "clickable() ? 'button' : null",
    '[attr.tabindex]': "clickable() && !disabled() ? 0 : null",
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)',
  },
})
export class VzCardComponent {
  // ── Inputs Base ──
  readonly variant = input<VzCardVariant>('elevated');
  readonly theme = input<VzCardTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly density = input<VzCardDensity>('comfortable');
  readonly orientation = input<VzCardOrientation>('vertical');
  readonly accent = input<VzCardAccent>('primary');
  readonly accentPosition = input<VzCardAccentPosition>('top');
  readonly borderedHeader = input<boolean>(true);
  readonly borderedFooter = input<boolean>(true);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly imageUrl = input<string>('');
  readonly imageAlt = input<string>('');
  readonly hoverable = input<boolean>(false);
  readonly clickable = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ── Inputs & Model del Panel Lateral (Drawer de Comentarios Integrado) ──
  readonly drawerOpen = model<boolean>(false);
  readonly comments = input<VzCardComment[] | undefined>(undefined);
  readonly drawerTitle = input<string>('Comentarios');
  readonly drawerBadge = input<string>('Comunidad Verificada');
  readonly drawerEmptyText = input<string>(
    'Aún no hay comentarios en este producto. ¡Sé el primero en preguntar!'
  );
  readonly commentPlaceholder = input<string>('Pregunta sobre este producto...');
  readonly buyerBadgeLabel = input<string>('Comprador');
  readonly showCommentForm = input<boolean>(true);

  // ── Outputs ──
  readonly clicked = output<MouseEvent | KeyboardEvent>();
  readonly commentAdded = output<string>();
  readonly drawerClosed = output<void>();

  // ── Estado Interno del Formulario de Comentarios ──
  protected readonly draftComment = signal<string>('');

  // ── Detección de Slots Proyectados ──
  private readonly headerSlot = contentChild(VzCardHeaderDirective);
  protected readonly hasHeaderSlot = computed(() => !!this.headerSlot());

  private readonly contentSlot = contentChild(VzCardContentDirective);
  protected readonly hasContentSlot = computed(() => !!this.contentSlot());

  private readonly customDrawerSlot = contentChild(VzCardDrawerDirective);
  protected readonly hasCustomDrawerSlot = computed(() => !!this.customDrawerSlot());

  // Semantics
  private readonly semanticAccents = ['primary', 'success', 'warning', 'danger', 'info'];

  protected readonly isSemanticAccent = computed(() => {
    return this.semanticAccents.includes(this.accent());
  });

  protected readonly hostClasses = computed(() => {
    const isAccent = this.variant() === 'accent';
    const isDarkTheme = this.dark() || this.theme() === 'dark';
    const isLightExplicit = !this.dark() && this.theme() === 'light';
    const isAutoTheme = !this.dark() && this.theme() === 'auto';
    const classes = [
      'vz-card',
      `vz-card--${this.variant()}`,
      `vz-card--${this.density()}`,
      `vz-card--${this.orientation()}`,
      isDarkTheme ? 'vz-card--dark' : '',
      isLightExplicit ? 'vz-card--light' : '',
      isAutoTheme ? 'vz-card--theme-auto' : '',
      isAccent && this.isSemanticAccent() ? `vz-card--accent-${this.accent()}` : '',
      isAccent ? `vz-card--accent-${this.accentPosition()}` : '',
      !this.borderedHeader() ? 'vz-card--seamless-header' : '',
      !this.borderedFooter() ? 'vz-card--seamless-footer' : '',
      this.hoverable() || this.clickable() ? 'is-hoverable' : '',
      this.clickable() ? 'is-clickable' : '',
      this.drawerOpen() ? 'vz-card--drawer-open' : '',
      this.loading() ? 'is-loading' : '',
      this.disabled() ? 'is-disabled' : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  protected readonly hostStyles = computed(() => {
    if (this.variant() === 'accent' && !this.isSemanticAccent() && this.accent()) {
      return { '--vz-card-accent-color': this.accent() };
    }
    return {};
  });

  protected closeDrawer(event?: Event): void {
    event?.stopPropagation();
    this.drawerOpen.set(false);
    this.drawerClosed.emit();
  }

  protected onCommentInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.draftComment.set(target?.value ?? '');
  }

  protected onCommentSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const text = this.draftComment().trim();
    if (!text) return;
    this.commentAdded.emit(text);
    this.draftComment.set('');
  }

  protected onClick(event: MouseEvent): void {
    if (this.disabled() || !this.clickable()) return;
    this.clicked.emit(event);
  }

  protected onKeydown(event: Event): void {
    if (this.disabled() || !this.clickable()) return;
    event.preventDefault();
    this.clicked.emit(event as KeyboardEvent);
  }
}
