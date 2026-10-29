import { TestBed } from '@angular/core/testing';
import { CodeBlockComponent } from './code-block.component';
import { highlightCode } from './syntax-highlighter';

describe('CodeBlockComponent', () => {
  it('resalta correctamente la sintaxis HTML estilo Bootstrap', () => {
    const fixture = TestBed.createComponent(CodeBlockComponent);
    fixture.componentRef.setInput('code', '<vz-card variant="elevated">Hola</vz-card>');
    fixture.componentRef.setInput('language', 'html');
    fixture.detectChanges();

    const codeEl = fixture.nativeElement.querySelector('code');
    expect(codeEl).toBeTruthy();
    expect(codeEl.innerHTML).toContain('token-tag-name');
    expect(codeEl.innerHTML).toContain('token-attr');
    expect(codeEl.innerHTML).toContain('token-string');
  });

  it('resalta comentarios HTML', () => {
    const html = highlightCode('<!-- Mi Comentario -->', 'html');
    expect(html).toContain('token-comment');
  });

  it('resalta variables CSS', () => {
    const css = highlightCode('--vz-card-bg: #ffffff;', 'css');
    expect(css).toContain('token-custom-prop');
    expect(css).toContain('token-number');
  });
});

