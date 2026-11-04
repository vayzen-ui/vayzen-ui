import { Directive, TemplateRef } from '@angular/core';
import { VzSelectOption } from './select.types';

@Directive({
  selector: '[vzSelectOption]',
  standalone: true,
})
export class VzSelectOptionDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzSelectOption<T>; selected: boolean }>) {}
}

@Directive({
  selector: '[vzSelectTrigger]',
  standalone: true,
})
export class VzSelectTriggerDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzSelectOption<T> | null; open: boolean }>) {}
}

