import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-block',
  standalone: true,
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');
  readonly title = input<string>('');

  protected readonly languageUpper = computed(() => (this.language() || '').toUpperCase());
  protected readonly copied = signal<boolean>(false);

  protected async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = this.code();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
