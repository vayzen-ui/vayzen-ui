import { Directive } from '@angular/core';

/**
 * Directiva para proyectar una cabecera totalmente personalizada en <vz-modal>.
 * Uso: <ng-template vzModalHeader>...</ng-template> o <div vzModalHeader>...</div>
 */
@Directive({
  selector: '[vzModalHeader]',
  standalone: true,
})
export class VzModalHeaderDirective {}

/**
 * Directiva para proyectar el título en <vz-modal>.
 * Uso: <span vzModalTitle>Mi Título Personalizado</span>
 */
@Directive({
  selector: '[vzModalTitle]',
  standalone: true,
})
export class VzModalTitleDirective {}

/**
 * Directiva para proyectar el cuerpo o contenido principal en <vz-modal>.
 * Uso: <div vzModalBody>...</div>
 */
@Directive({
  selector: '[vzModalBody]',
  standalone: true,
})
export class VzModalBodyDirective {}

/**
 * Directiva para proyectar un pie de modal personalizado en <vz-modal>.
 * Reemplaza todo el footer por defecto.
 * Uso: <div vzModalFooter>...</div>
 */
@Directive({
  selector: '[vzModalFooter]',
  standalone: true,
})
export class VzModalFooterDirective {}

/**
 * Directiva para proyectar botones de acción en el pie de modal por defecto.
 * Uso: <div vzModalActions>...</div>
 */
@Directive({
  selector: '[vzModalActions]',
  standalone: true,
})
export class VzModalActionsDirective {}

