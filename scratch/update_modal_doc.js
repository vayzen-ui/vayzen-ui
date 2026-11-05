const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'projects', 'vayzen-docs', 'src', 'app', 'features', 'components-catalog', 'views', 'modal-doc', 'modal-doc.component.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Reemplazar la URL larga en sampleFiles[0]
content = content.replace(
  /url:\s*'data:application\/pdf;base64,[^']+'/,
  "url: '/docs/politica-seguridad-informacion-2026.pdf'"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('modal-doc.component.ts actualizado exitosamente');

