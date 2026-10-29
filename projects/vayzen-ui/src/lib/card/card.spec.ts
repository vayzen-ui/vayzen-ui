import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VzCardComponent } from './card.component';
import { VZ_CARD_DIRECTIVES } from './card.directives';

@Component({
  standalone: true,
  imports: [VzCardComponent, ...VZ_CARD_DIRECTIVES],
  template: `
    <vz-card>
      <div vzCardHeader>
        <h4 vzCardTitle>Título Slotted</h4>
        <span vzCardSubtitle>Subtítulo Slotted</span>
        <div vzCardActions><button type="button">Acción</button></div>
      </div>
      <div vzCardContent>
        <div vzCardEyebrow>
          <span vzCardBadge variant="primary">TECNOLOGÍA</span>
          <span vzCardRating>4.95</span>
        </div>
        <div vzCardMeta>
          <span vzCardMetaItem tone="success">Verificado</span>
        </div>
        <hr vzCardDivider />
        <div vzCardTags>
          <span vzCardTag tone="success">Efectivo</span>
        </div>
        <div vzCardInfoRow>
          <span>CDMX</span>
        </div>
        Contenido Slotted
      </div>
      <div vzCardFooter>
        <a vzCardLink href="javascript:void(0)">kintab.app</a>
        Pie Slotted
      </div>
    </vz-card>
  `,
})
class TestSlottedCardComponent {}

describe('VzCardComponent', () => {
  it('se crea con valores por defecto (elevated, comfortable, vertical)', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.classList.contains('vz-card--elevated')).toBe(true);
    expect(el.classList.contains('vz-card--comfortable')).toBe(true);
    expect(el.classList.contains('vz-card--vertical')).toBe(true);
  });

  it('aplica las clases de variante correctamente', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('variant', 'outlined');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--outlined')).toBe(true);

    fixture.componentRef.setInput('variant', 'flat');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--flat')).toBe(true);

    fixture.componentRef.setInput('variant', 'accent');
    fixture.componentRef.setInput('accent', 'success');
    fixture.componentRef.setInput('accentPosition', 'top');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--accent')).toBe(true);
    expect(fixture.nativeElement.classList.contains('vz-card--accent-success')).toBe(true);
    expect(fixture.nativeElement.classList.contains('vz-card--accent-top')).toBe(true);
  });

  it('soporta orientación horizontal', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--horizontal')).toBe(true);
  });

  it('aplica clases de header y footer sin bordes cuando se desactivan', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('borderedHeader', false);
    fixture.componentRef.setInput('borderedFooter', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--seamless-header')).toBe(true);
    expect(fixture.nativeElement.classList.contains('vz-card--seamless-footer')).toBe(true);
  });

  it('aplica color de acento personalizado mediante variable CSS', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('variant', 'accent');
    fixture.componentRef.setInput('accent', '#e11d48');
    fixture.detectChanges();
    const styleAttr = fixture.nativeElement.getAttribute('style') || '';
    expect(styleAttr).toContain('--vz-card-accent-color: #e11d48');
  });

  it('aplica las clases de densidad correctamente', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--compact')).toBe(true);

    fixture.componentRef.setInput('density', 'spacious');
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('vz-card--spacious')).toBe(true);
  });

  it('renderiza título y subtítulo declarativos', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('title', 'Mi Tarjeta');
    fixture.componentRef.setInput('subtitle', 'Detalle breve');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.vz-card__title');
    const subEl = fixture.nativeElement.querySelector('.vz-card__subtitle');

    expect(titleEl?.textContent?.trim()).toBe('Mi Tarjeta');
    expect(subEl?.textContent?.trim()).toBe('Detalle breve');
  });

  it('soporta estructura componible mediante slots y directivas (básicas y completas)', () => {
    const fixture = TestBed.createComponent(TestSlottedCardComponent);
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('.vz-card__title');
    const subEl = fixture.nativeElement.querySelector('.vz-card__subtitle');
    const contentEl = fixture.nativeElement.querySelector('.vz-card__content');
    const footerEl = fixture.nativeElement.querySelector('.vz-card__footer');
    const badgeEl = fixture.nativeElement.querySelector('.vz-card__badge--primary');
    const ratingEl = fixture.nativeElement.querySelector('.vz-card__rating');
    const metaItemEl = fixture.nativeElement.querySelector('.vz-card__meta-item--success');
    const tagEl = fixture.nativeElement.querySelector('.vz-card__tag--success');
    const linkEl = fixture.nativeElement.querySelector('.vz-card__link');

    expect(titleEl?.textContent?.trim()).toBe('Título Slotted');
    expect(subEl?.textContent?.trim()).toBe('Subtítulo Slotted');
    expect(contentEl).toBeTruthy();
    expect(footerEl).toBeTruthy();
    expect(badgeEl?.textContent?.trim()).toBe('TECNOLOGÍA');
    expect(ratingEl?.textContent?.trim()).toBe('4.95');
    expect(metaItemEl?.textContent?.trim()).toBe('Verificado');
    expect(tagEl?.textContent?.trim()).toBe('Efectivo');
    expect(linkEl?.textContent?.trim()).toBe('kintab.app');
  });

  it('emite clicked cuando clickable es true y se hace clic', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    let clicked = false;
    fixture.componentInstance.clicked.subscribe(() => (clicked = true));

    fixture.nativeElement.click();
    expect(clicked).toBe(true);
  });

  it('no emite clicked si está deshabilitado', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('clickable', true);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let clicked = false;
    fixture.componentInstance.clicked.subscribe(() => (clicked = true));

    fixture.nativeElement.click();
    expect(clicked).toBe(false);
  });

  it('renderiza skeleton loader cuando loading es true', () => {
    const fixture = TestBed.createComponent(VzCardComponent);
    fixture.componentRef.setInput('title', 'Mi Tarjeta');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.vz-card__skeleton');
    const titleEl = fixture.nativeElement.querySelector('.vz-card__title');

    expect(skeleton).toBeTruthy();
    expect(titleEl).toBeFalsy();
  });
});
