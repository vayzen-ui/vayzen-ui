const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');

async function createEnterprisePdf() {
  const pdfDoc = await PDFDocument.create();

  // Incorporar fuentes estándar
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Paleta de colores Vayzen Enterprise
  const cPrimary = rgb(0.145, 0.388, 0.921);      // #2563eb
  const cPrimaryDark = rgb(0.118, 0.231, 0.541);  // #1e3a8a
  const cPrimaryLight = rgb(0.933, 0.949, 0.988); // #eef2fa
  const cAccent = rgb(0.051, 0.584, 0.443);       // #0d9470 (Emerald)
  const cAccentLight = rgb(0.925, 0.988, 0.957);
  const cTextDark = rgb(0.059, 0.090, 0.165);     // #0f172a
  const cTextMuted = rgb(0.392, 0.455, 0.545);    // #64748b
  const cBorder = rgb(0.886, 0.910, 0.941);       // #e2e8f0
  const cCardBg = rgb(0.973, 0.980, 0.992);       // #f8fafc
  const cWhite = rgb(1, 1, 1);

  // ══════════════════════════════════════════════════════════════════
  // PÁGINA 1: POLÍTICA GENERAL Y GOBERNANZA DE CIBERSEGURIDAD
  // ══════════════════════════════════════════════════════════════════
  const page1 = pdfDoc.addPage([612, 792]); // Standard US Letter (points)
  const { width: p1W, height: p1H } = page1.getSize();

  // 1. Barra de acento superior
  page1.drawRectangle({
    x: 0,
    y: p1H - 8,
    width: p1W,
    height: 8,
    color: cPrimary,
  });

  page1.drawRectangle({
    x: 0,
    y: p1H - 12,
    width: p1W,
    height: 4,
    color: cAccent,
  });

  // 2. Encabezado institucional
  page1.drawRectangle({
    x: 40,
    y: p1H - 74,
    width: 48,
    height: 48,
    color: cPrimary,
    borderColor: cPrimaryDark,
    borderWidth: 1,
  });

  page1.drawText('VZN', {
    x: 48,
    y: p1H - 57,
    size: 16,
    font: fontBold,
    color: cWhite,
  });

  page1.drawText('VAYZEN ENTERPRISE SYSTEMS', {
    x: 98,
    y: p1H - 42,
    size: 12,
    font: fontBold,
    color: cTextDark,
  });

  page1.drawText('DIRECCION GENERAL DE TECNOLOGIAS Y GOBERNANZA DE DATOS', {
    x: 98,
    y: p1H - 55,
    size: 8,
    font: fontRegular,
    color: cTextMuted,
  });

  page1.drawText('Expediente: VZN-SEC-2026-X9  |  Clasificacion: CONFIDENCIAL A1  |  Vigencia: 2026-2030', {
    x: 98,
    y: p1H - 67,
    size: 7.5,
    font: fontOblique,
    color: cPrimaryDark,
  });

  // Badge institucional a la derecha
  page1.drawRectangle({
    x: p1W - 135,
    y: p1H - 64,
    width: 95,
    height: 24,
    color: cAccentLight,
    borderColor: cAccent,
    borderWidth: 0.8,
  });

  page1.drawText('CERTIFICADO VZN', {
    x: p1W - 125,
    y: p1H - 53,
    size: 7.5,
    font: fontBold,
    color: cAccent,
  });

  // Línea divisoria
  page1.drawLine({
    start: { x: 40, y: p1H - 85 },
    end: { x: p1W - 40, y: p1H - 85 },
    color: cBorder,
    thickness: 1,
  });

  // 3. Banner del Título del Documento
  page1.drawRectangle({
    x: 40,
    y: p1H - 140,
    width: p1W - 80,
    height: 44,
    color: cPrimaryLight,
    borderColor: rgb(0.75, 0.83, 0.95),
    borderWidth: 1,
  });

  page1.drawText('POLITICA INSTITUCIONAL DE CIBERSEGURIDAD Y PROTECCION DE ACTIVOS', {
    x: 52,
    y: p1H - 114,
    size: 11,
    font: fontBold,
    color: cPrimaryDark,
  });

  page1.drawText('Marco Operativo Homologado ISO/IEC 27001:2022  |  Resolucion de Directorio No. RD-2026-08', {
    x: 52,
    y: p1H - 128,
    size: 8,
    font: fontRegular,
    color: cTextMuted,
  });

  // 4. Tarjetas KPI de Estado (Dashboard Ejecutivo de Seguridad)
  const cardW = (p1W - 80 - 24) / 4;
  const kpis = [
    { label: 'DISPONIBILIDAD SLA', val: '99.99%', sub: 'Alta Conmutacion', color: cPrimary },
    { label: 'INFRAESTRUCTURA', val: 'Tier 4', sub: 'Certificacion ICREA', color: rgb(0.49, 0.23, 0.93) },
    { label: 'CUMPLIMIENTO', val: '100%', sub: 'Auditoria Externa', color: cAccent },
    { label: 'VULNERABILIDADES', val: '0 Críticas', sub: 'Cero Confianza', color: rgb(0.85, 0.25, 0.2) },
  ];

  kpis.forEach((kpi, idx) => {
    const kpiX = 40 + idx * (cardW + 8);
    page1.drawRectangle({
      x: kpiX,
      y: p1H - 195,
      width: cardW,
      height: 45,
      color: cCardBg,
      borderColor: cBorder,
      borderWidth: 0.8,
    });

    // Pequeño acento lateral en la tarjeta
    page1.drawRectangle({
      x: kpiX,
      y: p1H - 195,
      width: 3,
      height: 45,
      color: kpi.color,
    });

    page1.drawText(kpi.label, {
      x: kpiX + 8,
      y: p1H - 162,
      size: 6.5,
      font: fontBold,
      color: cTextMuted,
    });

    page1.drawText(kpi.val, {
      x: kpiX + 8,
      y: p1H - 177,
      size: 12,
      font: fontBold,
      color: cTextDark,
    });

    page1.drawText(kpi.sub, {
      x: kpiX + 8,
      y: p1H - 188,
      size: 6.5,
      font: fontRegular,
      color: cTextMuted,
    });
  });

  // 5. Tabla de Gobernanza y Metadatos
  const tableY = p1H - 265;
  page1.drawRectangle({
    x: 40,
    y: tableY,
    width: p1W - 80,
    height: 58,
    color: cWhite,
    borderColor: cBorder,
    borderWidth: 1,
  });

  // Cabecera de la tabla
  page1.drawRectangle({
    x: 40,
    y: tableY + 38,
    width: p1W - 80,
    height: 20,
    color: rgb(0.95, 0.96, 0.98),
  });

  page1.drawLine({
    start: { x: 40, y: tableY + 38 },
    end: { x: p1W - 40, y: tableY + 38 },
    color: cBorder,
    thickness: 1,
  });

  const cols = [
    { x: 48, label: 'PARAMETRO', w: 140 },
    { x: 190, label: 'ESTANDAR NORMATIVO', w: 140 },
    { x: 330, label: 'RESPONSABLE / AUDITOR', w: 130 },
    { x: 460, label: 'ESTATUS VAYZEN', w: 100 },
  ];

  cols.forEach((c) => {
    page1.drawText(c.label, {
      x: c.x,
      y: tableY + 44,
      size: 7,
      font: fontBold,
      color: cTextMuted,
    });
  });

  // Fila 1 de la tabla
  page1.drawText('Cifrado en Transito & Reposo', { x: 48, y: tableY + 24, size: 8, font: fontRegular, color: cTextDark });
  page1.drawText('AES-256-GCM / TLS 1.3 Strict', { x: 190, y: tableY + 24, size: 8, font: fontBold, color: cPrimaryDark });
  page1.drawText('Ing. Carlos Mendoza (SecOps)', { x: 330, y: tableY + 24, size: 8, font: fontRegular, color: cTextDark });
  page1.drawText('ACTIVO / CERTIFICADO', { x: 460, y: tableY + 24, size: 7.5, font: fontBold, color: cAccent });

  page1.drawLine({
    start: { x: 40, y: tableY + 18 },
    end: { x: p1W - 40, y: tableY + 18 },
    color: rgb(0.92, 0.94, 0.97),
    thickness: 0.8,
  });

  // Fila 2 de la tabla
  page1.drawText('Control de Identidad y Acceso', { x: 48, y: tableY + 6, size: 8, font: fontRegular, color: cTextDark });
  page1.drawText('FIDO2 / WebAuthn Biometrico', { x: 190, y: tableY + 6, size: 8, font: fontBold, color: cPrimaryDark });
  page1.drawText('Mtra. Laura Valdes (IAM)', { x: 330, y: tableY + 6, size: 8, font: fontRegular, color: cTextDark });
  page1.drawText('OBLIGATORIO 100%', { x: 460, y: tableY + 6, size: 7.5, font: fontBold, color: cPrimary });

  // 6. Artículos y Cláusulas Operativas
  const articlesY = tableY - 18;
  const articles = [
    {
      num: 'ARTICULO 1o.',
      title: 'PRINCIPIO DE MINIMO PRIVILEGIO Y ACCESO BASADO EN ROLES (RBAC)',
      body: 'Todo usuario o microservicio del ecosistema Vayzen tendra asignados estrictamente los privilegios indispensables para la ejecucion de sus tareas funcionales autorizadas. Queda terminantemente prohibido el empleo de credenciales genericas o compartidas entre distintas areas o entornos productivos.',
    },
    {
      num: 'ARTICULO 2o.',
      title: 'TRAZABILIDAD INMUTABLE Y REGISTRO DE AUDITORIA FORENSE (WORM)',
      body: 'Cualquier modificacion estructural, consulta masiva de datos sensibles o evento de autenticacion debera ser remitido en tiempo real a una bitacora centralizada e inmutable con garantia Write-Once-Read-Many (WORM), custodiada por un plazo no inferior a cinco (5) anos calendarios homologados.',
    },
    {
      num: 'ARTICULO 3o.',
      title: 'PROTECCION DE INTEGRIDAD EN PIPELINES DE DESPLIEGUE CONTINUO (CI/CD)',
      body: 'Todo paquete o modulo incorporado a produccion debe superar sin excepcion el analisis estatico de codigo (SAST), escaneo de dependencias en tiempo de construccion y estar debidamente firmado mediante certificados digitales corporativos X.509 de raiz institucional.',
    },
  ];

  let currArtY = articlesY;
  articles.forEach((art) => {
    page1.drawText(`${art.num} ${art.title}`, {
      x: 40,
      y: currArtY,
      size: 8.5,
      font: fontBold,
      color: cPrimaryDark,
    });

    page1.drawText(art.body, {
      x: 40,
      y: currArtY - 14,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.2, 0.25, 0.32),
      lineHeight: 11,
      maxWidth: p1W - 80,
    });

    currArtY -= 48;
  });

  // 7. Recuadro de Sello Digital y Validación Criptográfica
  const sealY = currArtY - 15;
  page1.drawRectangle({
    x: 40,
    y: sealY - 68,
    width: p1W - 80,
    height: 72,
    color: rgb(0.98, 0.99, 1),
    borderColor: rgb(0.8, 0.86, 0.96),
    borderWidth: 1,
  });

  // Caja de sello de verificación a la derecha
  page1.drawRectangle({
    x: p1W - 165,
    y: sealY - 60,
    width: 115,
    height: 56,
    color: cWhite,
    borderColor: cAccent,
    borderWidth: 1,
  });

  page1.drawText('SELLO DIGITAL VAYZEN', {
    x: p1W - 155,
    y: sealY - 16,
    size: 7,
    font: fontBold,
    color: cAccent,
  });

  page1.drawText('AUTENTICIDAD VERIFICADA', {
    x: p1W - 155,
    y: sealY - 26,
    size: 6.5,
    font: fontBold,
    color: cPrimaryDark,
  });

  page1.drawText('SAT-CERT: #8849-2B91\nSHA256: 8f4e2b9c71a3\nTIMBRADO: 2026-11-05', {
    x: p1W - 155,
    y: sealY - 37,
    size: 5.5,
    font: fontRegular,
    color: cTextMuted,
    lineHeight: 7.5,
  });

  // Texto legal a la izquierda
  page1.drawText('FIRMA ELECTRONICA AVANZADA Y CERTIFICADO DIGITAL VALIDADOR', {
    x: 52,
    y: sealY - 12,
    size: 8,
    font: fontBold,
    color: cTextDark,
  });

  page1.drawText('Firmado por: Lic. Arturo Hernandez Guzman  -  Director Corporativo de TI & Ciberseguridad\nAutorizado por: Mtra. Sofia Valdes Ramirez  -  Comisionada General de Auditoria & Cumplimiento\nCadena Original: ||2026-11-05T09:00:00Z|VZN-SEC-2026-X9|SHA256|7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ad||', {
    x: 52,
    y: sealY - 26,
    size: 6.5,
    font: fontRegular,
    color: cTextMuted,
    lineHeight: 10,
    maxWidth: p1W - 225,
  });

  // Pie de página oficial
  page1.drawLine({
    start: { x: 40, y: 35 },
    end: { x: p1W - 40, y: 35 },
    color: cBorder,
    thickness: 0.8,
  });

  page1.drawText('Vayzen UI Framework  |  Plataforma de Gestion Documental Segura  |  Expediente VZN-2026-0982', {
    x: 40,
    y: 22,
    size: 7,
    font: fontRegular,
    color: cTextMuted,
  });

  page1.drawText('Pagina 1 de 2', {
    x: p1W - 90,
    y: 22,
    size: 7,
    font: fontBold,
    color: cTextMuted,
  });

  // ══════════════════════════════════════════════════════════════════
  // PÁGINA 2: ANEXO TÉCNICO I - PROTOCOLOS Y TIEMPOS DE RESPUESTA
  // ══════════════════════════════════════════════════════════════════
  const page2 = pdfDoc.addPage([612, 792]);
  const { width: p2W, height: p2H } = page2.getSize();

  // Barra de acento
  page2.drawRectangle({
    x: 0,
    y: p2H - 6,
    width: p2W,
    height: 6,
    color: cPrimary,
  });

  // Encabezado P2
  page2.drawText('VAYZEN ENTERPRISE SYSTEMS  |  ANEXO TECNICO I', {
    x: 40,
    y: p2H - 35,
    size: 9,
    font: fontBold,
    color: cPrimaryDark,
  });

  page2.drawText('DOCUMENTO OFICIAL COMPLEMENTARIO DE GOBERNANZA OPERATIVA', {
    x: 40,
    y: p2H - 46,
    size: 7.5,
    font: fontRegular,
    color: cTextMuted,
  });

  page2.drawLine({
    start: { x: 40, y: p2H - 55 },
    end: { x: p2W - 40, y: p2H - 55 },
    color: cBorder,
    thickness: 1,
  });

  // Título Sección
  page2.drawText('MATRIZ DE ESCALACION ANTE INCIDENTES CRITICOS DE SEGURIDAD', {
    x: 40,
    y: p2H - 80,
    size: 11,
    font: fontBold,
    color: cTextDark,
  });

  page2.drawText('Tiempos de respuesta estandarizados (SLA) y responsabilidades por nivel de severidad.', {
    x: 40,
    y: p2H - 93,
    size: 8,
    font: fontRegular,
    color: cTextMuted,
  });

  // Tabla de Niveles de Severidad
  const t2Y = p2H - 240;
  page2.drawRectangle({
    x: 40,
    y: t2Y,
    width: p2W - 80,
    height: 135,
    color: cWhite,
    borderColor: cBorder,
    borderWidth: 1,
  });

  // Encabezado tabla P2
  page2.drawRectangle({
    x: 40,
    y: t2Y + 115,
    width: p2W - 80,
    height: 20,
    color: rgb(0.94, 0.96, 0.98),
  });

  const colsP2 = [
    { x: 50, label: 'NIVEL', w: 60 },
    { x: 120, label: 'DESCRIPCION DEL INCIDENTE', w: 180 },
    { x: 310, label: 'TIEMPO DETECCION', w: 90 },
    { x: 410, label: 'TIEMPO MITIGACION', w: 90 },
    { x: 510, label: 'ESCALACION', w: 60 },
  ];

  colsP2.forEach((c) => {
    page2.drawText(c.label, { x: c.x, y: t2Y + 121, size: 7, font: fontBold, color: cTextMuted });
  });

  const matrix = [
    {
      level: 'P1 - Critica',
      color: rgb(0.85, 0.2, 0.2),
      desc: 'Compromiso de datos sensibles o caida total de cluster',
      det: '< 5 minutos',
      mit: '< 45 minutos',
      esc: 'Direccion General',
    },
    {
      level: 'P2 - Alta',
      color: rgb(0.9, 0.5, 0.1),
      desc: 'Degradacion de servicio de autenticacion o API Gateway',
      det: '< 15 minutos',
      mit: '< 2 horas',
      esc: 'Comite de TI',
    },
    {
      level: 'P3 - Media',
      color: rgb(0.15, 0.45, 0.85),
      desc: 'Falla no bloqueante en subsistema secundario o reportes',
      det: '< 1 hora',
      mit: '< 8 horas',
      esc: 'Lider de Turno',
    },
    {
      level: 'P4 - Informativa',
      color: cAccent,
      desc: 'Intentos de acceso fallidos aislados o alertas menores',
      det: '< 4 horas',
      mit: '< 24 horas',
      esc: 'Auditor Junior',
    },
  ];

  matrix.forEach((row, i) => {
    const rowY = t2Y + 90 - i * 27;
    page2.drawLine({
      start: { x: 40, y: rowY + 20 },
      end: { x: p2W - 40, y: rowY + 20 },
      color: rgb(0.93, 0.94, 0.96),
      thickness: 0.8,
    });

    page2.drawText(row.level, { x: 50, y: rowY + 5, size: 7.5, font: fontBold, color: row.color });
    page2.drawText(row.desc, { x: 120, y: rowY + 5, size: 7.5, font: fontRegular, color: cTextDark, maxWidth: 180 });
    page2.drawText(row.det, { x: 310, y: rowY + 5, size: 7.5, font: fontBold, color: cTextDark });
    page2.drawText(row.mit, { x: 410, y: rowY + 5, size: 7.5, font: fontBold, color: cTextDark });
    page2.drawText(row.esc, { x: 510, y: rowY + 5, size: 7.5, font: fontRegular, color: cTextMuted });
  });

  // Notas finales y sello de cierre
  page2.drawRectangle({
    x: 40,
    y: p2H - 400,
    width: p2W - 80,
    height: 70,
    color: cCardBg,
    borderColor: cBorder,
    borderWidth: 1,
  });

  page2.drawText('CLAUSULA DE AUDITORIA Y REVISION CONTINUA', {
    x: 52,
    y: p2H - 350,
    size: 8.5,
    font: fontBold,
    color: cPrimaryDark,
  });

  page2.drawText('El presente anexo es de observancia obligatoria para todos los contratistas, desarrolladores y administradores del ecosistema Vayzen. Las pruebas de penetracion (pentesting) se ejecutan trimestralmente por terceros independientes acreditados bajo la norma CREST e ISO 27001.', {
    x: 52,
    y: p2H - 365,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.25, 0.3, 0.38),
    lineHeight: 11,
    maxWidth: p2W - 104,
  });

  // Pie de página P2
  page2.drawLine({
    start: { x: 40, y: 35 },
    end: { x: p2W - 40, y: 35 },
    color: cBorder,
    thickness: 0.8,
  });

  page2.drawText('Vayzen UI Framework  |  Plataforma de Gestion Documental Segura  |  Expediente VZN-2026-0982', {
    x: 40,
    y: 22,
    size: 7,
    font: fontRegular,
    color: cTextMuted,
  });

  page2.drawText('Pagina 2 de 2', {
    x: p2W - 90,
    y: 22,
    size: 7,
    font: fontBold,
    color: cTextMuted,
  });

  // ══════════════════════════════════════════════════════════════════
  // MARCA DE AGUA SÚPER MARCADA (OVERLAY EN AMBAS PÁGINAS)
  // ══════════════════════════════════════════════════════════════════
  function drawWatermark(page) {
    const { width, height } = page.getSize();
    const angle = degrees(45);

    // Marca de agua central grande y visible
    page.drawText('PDF DE EJEMPLO', {
      x: 75,
      y: 250,
      size: 62,
      font: fontBold,
      color: rgb(0.92, 0.22, 0.22),
      opacity: 0.32,
      rotate: angle,
    });

    page.drawText('DOCUMENTO DE MUESTRA  ·  USO EXCLUSIVO DE PRUEBAS', {
      x: 88,
      y: 215,
      size: 14,
      font: fontBold,
      color: rgb(0.92, 0.22, 0.22),
      opacity: 0.30,
      rotate: angle,
    });

    // Sello superior distintivo en ángulo
    page.drawRectangle({
      x: width - 185,
      y: height - 105,
      width: 145,
      height: 24,
      color: rgb(0.99, 0.92, 0.92),
      borderColor: rgb(0.85, 0.2, 0.2),
      borderWidth: 1.5,
      opacity: 0.95,
      rotate: degrees(-10),
    });

    page.drawText('PDF DE EJEMPLO', {
      x: width - 172,
      y: height - 94,
      size: 10,
      font: fontBold,
      color: rgb(0.85, 0.15, 0.15),
      opacity: 0.95,
      rotate: degrees(-10),
    });
  }

  drawWatermark(page1);
  drawWatermark(page2);

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '..', 'projects', 'vayzen-docs', 'public', 'docs', 'politica-seguridad-informacion-2026.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF generado exitosamente en:', outputPath);
  console.log('Tamano del PDF:', pdfBytes.length, 'bytes');

  // Tambien generamos la cadena base64 para uso inline si se prefiere
  const base64 = Buffer.from(pdfBytes).toString('base64');
  fs.writeFileSync(path.join(__dirname, 'pdf_base64.txt'), base64);
  console.log('Base64 guardado en scratch/pdf_base64.txt');
}

createEnterprisePdf().catch(console.error);

