import { Directive, TemplateRef } from '@angular/core';
import { VzComboboxOption } from './combobox.types';

@Directive({
  selector: '[vzComboboxOption]',
  standalone: true,
})
export class VzComboboxOptionDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzComboboxOption<T>; selected: boolean }>) {}
}

@Directive({
  selector: '[vzComboboxTrigger]',
  standalone: true,
})
export class VzComboboxTriggerDirective<T = any> {
  constructor(public readonly template: TemplateRef<{ $implicit: VzComboboxOption<T> | null; open: boolean }>) {}
}

