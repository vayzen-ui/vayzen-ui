import { Directive, TemplateRef } from '@angular/core';
import { VzMultiSelectOption } from './multi-select.types';

@Directive({
  selector: '[vzMultiSelectOption]',
  standalone: true,
})
export class VzMultiSelectOptionDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzMultiSelectOption<T>; selected: boolean }>) {}
}

@Directive({
  selector: '[vzMultiSelectTrigger]',
  standalone: true,
})
export class VzMultiSelectTriggerDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzMultiSelectOption<T>[]; open: boolean }>) {}
}

