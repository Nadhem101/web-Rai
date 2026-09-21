// Generic tabular PDF export (landscape grid), shared by "Exporter PDF"
// buttons across the app — pages that already build their own richer PDF
// (flow chart fiches, the Préventif calendar) keep their own builder.

export async function exportRowsToPDF({ filename, title, subtitle, columns, rows }) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const PW = pdf.internal.pageSize.getWidth();
  const PH = pdf.internal.pageSize.getHeight();
  const MARGIN = 12;
  const HEADER_H = 22;
  const ROW_H = 7;
  const usableW = PW - MARGIN * 2;

  const totalWeight = columns.reduce((sum, c) => sum + (c.width || 20), 0);
  const colWidths = columns.map((c) => ((c.width || 20) / totalWeight) * usableW);

  const drawPageHeader = () => {
    pdf.setFillColor(15, 29, 53);
    pdf.rect(0, 0, PW, HEADER_H, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title || 'Export', MARGIN, 13);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(180, 200, 220);
    pdf.text(subtitle || `Exporté le ${new Date().toLocaleDateString('fr-FR')} — ${rows.length} ligne(s)`, MARGIN, 18.5);
  };

  const drawTableHeader = (y) => {
    pdf.setFillColor(226, 232, 240);
    pdf.rect(MARGIN, y, usableW, ROW_H, 'F');
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(MARGIN, y, usableW, ROW_H, 'S');
    pdf.setTextColor(30, 41, 59);
    pdf.setFontSize(7.5);
    pdf.setFont('helvetica', 'bold');
    let x = MARGIN;
    columns.forEach((c, i) => {
      const lines = pdf.splitTextToSize(String(c.header), colWidths[i] - 3);
      pdf.text(lines[0] || '', x + 1.5, y + 4.8);
      x += colWidths[i];
    });
    return y + ROW_H;
  };

  drawPageHeader();
  let y = HEADER_H + 6;
  y = drawTableHeader(y);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);

  rows.forEach((r, idx) => {
    if (y + ROW_H > PH - MARGIN) {
      pdf.addPage();
      y = MARGIN;
      y = drawTableHeader(y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
    }
    if (idx % 2 === 1) {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(MARGIN, y, usableW, ROW_H, 'F');
    }
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(MARGIN, y, usableW, ROW_H, 'S');
    pdf.setTextColor(51, 65, 85);
    let x = MARGIN;
    columns.forEach((c, i) => {
      const raw = r[c.key];
      const text = raw === null || raw === undefined || raw === '' ? '—' : String(raw);
      const lines = pdf.splitTextToSize(text, colWidths[i] - 3);
      pdf.text(lines[0] || '', x + 1.5, y + 4.8);
      x += colWidths[i];
    });
    y += ROW_H;
  });

  if (rows.length === 0) {
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    pdf.text('Aucune donnée à exporter.', MARGIN + 2, y + 6);
  }

  const pageCount = pdf.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p += 1) {
    pdf.setPage(p);
    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`WEB-RAI — Page ${p}/${pageCount}`, MARGIN, PH - 5);
  }

  pdf.save(filename);
}
