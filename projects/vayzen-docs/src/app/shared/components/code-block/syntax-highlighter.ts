/**
 * Resaltador de sintaxis ligero y sin dependencias para Vayzen Docs.
 * Aplica el esquema de colores estilo Bootstrap Docs / GitHub Dark:
 * - Tags en coral/rojo (#ff7b72)
 * - Atributos en cian (#79c0ff)
 * - Bindings Angular [] () en púrpura (#d2a8ff) y ámbar (#ffa657)
 * - Strings/Valores en verde esmeralda (#7ee787)
 * - Comentarios en gris pizarra (#8b949e)
 * - Texto de contenido en blanco (#f0f6fc)
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function highlightCode(code: string, language = 'html'): string {
  if (!code) return '';
  const lang = (language || 'html').toLowerCase();

  switch (lang) {
    case 'html':
    case 'xml':
    case 'svg':
      return highlightHtml(code);
    case 'css':
    case 'scss':
      return highlightCss(code);
    case 'ts':
    case 'typescript':
    case 'js':
    case 'javascript':
      return highlightTs(code);
    case 'bash':
    case 'sh':
    case 'shell':
      return highlightBash(code);
    default:
      return escapeHtml(code);
  }
}

/**
 * Resaltado HTML / Templates Angular
 */
function highlightHtml(rawCode: string): string {
  const commentPlaceholder: string[] = [];

  // 1. Extraer comentarios HTML <!-- ... -->
  let code = rawCode.replace(/<!--[\s\S]*?-->/g, (match) => {
    const idx = commentPlaceholder.length;
    commentPlaceholder.push(`<span class="token-comment">${escapeHtml(match)}</span>`);
    return `___COMMENT_${idx}___`;
  });

  // 2. Tokenizar tags HTML y atributos
  // Coincide con <tag ...> o </tag>
  code = code.replace(/<(\/?[a-zA-Z0-9_\-]+)([\s\S]*?)(\/?>)/g, (_, tagName, attrs, closeBracket) => {
    let highlightedAttrs = '';

    if (attrs) {
      // Regex para atributos con o sin valor:
      // - Directivas o atributos sin valor: vzCardImage, hoverable
      // - Atributos estándar: class="foo"
      // - Bindings Angular: [borderedHeader]="false", (clicked)="onCardClick()"
      const attrRegex = /([\[\(]?[a-zA-Z0-9_\-\.\@]+[\)\]]?)(?:(=)(["'][^"']*["']))?/g;
      highlightedAttrs = attrs.replace(attrRegex, (attrMatch: string, name: string, eq: string, val: string) => {
        if (!name) return attrMatch;

        let nameClass = 'token-attr';
        if (name.startsWith('[(')) {
          nameClass = 'token-attr-twoway';
        } else if (name.startsWith('[')) {
          nameClass = 'token-attr-input';
        } else if (name.startsWith('(')) {
          nameClass = 'token-attr-output';
        } else if (name.startsWith('vz') || name.startsWith('*')) {
          nameClass = 'token-directive';
        }

        const nameSpan = `<span class="${nameClass}">${escapeHtml(name)}</span>`;

        if (eq && val !== undefined) {
          const eqSpan = `<span class="token-punctuation">=</span>`;
          const valSpan = `<span class="token-string">${escapeHtml(val)}</span>`;
          return `${nameSpan}${eqSpan}${valSpan}`;
        }

        return nameSpan;
      });
    }

    const openSpan = `<span class="token-tag-bracket">&lt;</span><span class="token-tag-name">${escapeHtml(tagName)}</span>`;
    const closeSpan = `<span class="token-tag-bracket">${escapeHtml(closeBracket)}</span>`;

    return `${openSpan}${highlightedAttrs}${closeSpan}`;
  });

  // 3. Resaltar interpolaciones Angular {{ ... }}
  code = code.replace(/\{\{([\s\S]*?)\}\}/g, (_, inner) => {
    return `<span class="token-interpolation">{{<span class="token-expr">${escapeHtml(inner)}</span>}}</span>`;
  });

  // 4. Restaurar comentarios
  code = code.replace(/___COMMENT_(\d+)___/g, (_, id) => {
    return commentPlaceholder[Number(id)] || '';
  });

  return code;
}

/**
 * Resaltado CSS / SCSS
 */
function highlightCss(rawCode: string): string {
  const commentPlaceholder: string[] = [];

  // Comentarios /* ... */
  let code = rawCode.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    const idx = commentPlaceholder.length;
    commentPlaceholder.push(`<span class="token-comment">${escapeHtml(match)}</span>`);
    return `___COMMENT_${idx}___`;
  });

  // Escapar HTML base
  code = escapeHtml(code);

  // Propiedades CSS y Variables custom --vz-*
  code = code.replace(/([a-zA-Z0-9_\-]+)\s*(:)/g, (match, prop, colon) => {
    const isVar = prop.startsWith('--');
    const pClass = isVar ? 'token-custom-prop' : 'token-prop';
    return `<span class="${pClass}">${prop}</span><span class="token-punctuation">${colon}</span>`;
  });

  // Selectores de clase y pseudoclases
  code = code.replace(/(\.[a-zA-Z0-9_\-]+|:host[a-zA-Z0-9_\-\(\):]*)/g, (match) => {
    return `<span class="token-selector">${match}</span>`;
  });

  // Valores numéricos con unidad o colores hex
  code = code.replace(/(#[a-fA-F0-9]{3,8}|\b\d+(\.\d+)?(px|rem|em|%|ms|s|deg)?\b)/g, (match) => {
    return `<span class="token-number">${match}</span>`;
  });

  // Restaurar comentarios
  code = code.replace(/___COMMENT_(\d+)___/g, (_, id) => {
    return commentPlaceholder[Number(id)] || '';
  });

  return code;
}

/**
 * Resaltado TypeScript / JavaScript
 */
function highlightTs(rawCode: string): string {
  const commentPlaceholder: string[] = [];
  const stringPlaceholder: string[] = [];

  // Comentarios // o /* */
  let code = rawCode.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
    const idx = commentPlaceholder.length;
    commentPlaceholder.push(`<span class="token-comment">${escapeHtml(match)}</span>`);
    return `___COMMENT_${idx}___`;
  });

  // Strings '...' o "..." o `...`
  code = code.replace(/('([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`)/g, (match) => {
    const idx = stringPlaceholder.length;
    stringPlaceholder.push(`<span class="token-string">${escapeHtml(match)}</span>`);
    return `___STRING_${idx}___`;
  });

  code = escapeHtml(code);

  // Palabras clave
  const keywords = /\b(import|from|export|default|class|interface|type|const|let|var|return|function|new|this|typeof|async|await|readonly|protected|public|private|as|implements|extends)\b/g;
  code = code.replace(keywords, '<span class="token-keyword">$1</span>');

  // Decoradores Angular
  code = code.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="token-decorator">$1</span>');

  // Tipos primitivos
  code = code.replace(/\b(string|number|boolean|void|any|null|undefined|true|false)\b/g, '<span class="token-builtin">$1</span>');

  // Restaurar strings y comentarios
  code = code.replace(/___STRING_(\d+)___/g, (_, id) => stringPlaceholder[Number(id)] || '');
  code = code.replace(/___COMMENT_(\d+)___/g, (_, id) => commentPlaceholder[Number(id)] || '');

  return code;
}

/**
 * Resaltado Bash / Terminal
 */
function highlightBash(rawCode: string): string {
  let code = escapeHtml(rawCode);
  code = code.replace(/^(#.*)$/gm, '<span class="token-comment">$1</span>');
  code = code.replace(/\b(npm|npx|ng|pnpm|yarn|git|cd|mkdir|rm)\b/g, '<span class="token-keyword">$1</span>');
  code = code.replace(/\b(install|build|serve|test|add|run)\b/g, '<span class="token-directive">$1</span>');
  code = code.replace(/(--[a-zA-Z0-9_\-]+)/g, '<span class="token-attr">$1</span>');
  return code;
}

