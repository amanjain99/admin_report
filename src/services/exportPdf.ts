import type { QueryResponse, SingleStatData, ComparisonData, DistributionData, TrendData, ListData } from '../types';

/**
 * Export query responses to PDF format
 * Uses html2canvas to capture rendered elements and jsPDF to create PDF
 */
export async function exportToPDF(responses: QueryResponse[]): Promise<void> {
  // Dynamically import libraries
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Add title page
  pdf.setFontSize(28);
  pdf.setTextColor(41, 41, 41);
  pdf.text('Analytics Report', pageWidth / 2, 60, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, 75, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.text(`${responses.length} visualization${responses.length !== 1 ? 's' : ''} included`, pageWidth / 2, 90, { align: 'center' });

  // Add each response as a new page
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    pdf.addPage();
    
    let yPosition = margin;

    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(41, 41, 41);
    const titleLines = pdf.splitTextToSize(response.title, contentWidth);
    pdf.text(titleLines, margin, yPosition + 8);
    yPosition += titleLines.length * 8 + 5;

    // Add subtitle if present
    if (response.subtitle) {
      pdf.setFontSize(12);
      pdf.setTextColor(107, 114, 128);
      const subtitleLines = pdf.splitTextToSize(response.subtitle, contentWidth);
      pdf.text(subtitleLines, margin, yPosition + 5);
      yPosition += subtitleLines.length * 5 + 10;
    }

    // Add visualization data as text (since we can't render React components directly)
    yPosition += 10;
    pdf.setFontSize(11);
    pdf.setTextColor(55, 65, 81);
    
    const dataText = formatDataForPDF(response);
    const dataLines = pdf.splitTextToSize(dataText, contentWidth);
    
    for (const line of dataLines) {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    }

    // Add query text at bottom
    yPosition = Math.max(yPosition + 15, pageHeight - 40);
    pdf.setFontSize(10);
    pdf.setTextColor(156, 163, 175);
    pdf.text('Query:', margin, yPosition);
    pdf.setTextColor(107, 114, 128);
    const queryLines = pdf.splitTextToSize(response.query, contentWidth);
    pdf.text(queryLines, margin, yPosition + 5);
  }

  // Save the PDF
  const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
}

/**
 * Format response data for PDF text representation
 */
function formatDataForPDF(response: QueryResponse): string {
  const { type, data } = response;
  
  switch (type) {
    case 'single_stat': {
      const statData = data as SingleStatData;
      let text = `${statData.label}: ${statData.value}${statData.suffix || ''}`;
      if (statData.trend) {
        text += `\nTrend: ${statData.trend.direction === 'up' ? '↑' : statData.trend.direction === 'down' ? '↓' : '→'} ${statData.trend.value}%`;
      }
      return text;
    }
    
    case 'comparison': {
      const compData = data as ComparisonData;
      let text = 'Comparison Data:\n\n';
      compData.items.forEach((item, idx) => {
        text += `${idx + 1}. ${item.name}: ${item.value.toLocaleString()}\n`;
      });
      return text;
    }
    
    case 'distribution': {
      const distData = data as DistributionData;
      let text = 'Distribution:\n\n';
      const total = distData.total || distData.items.reduce((sum, item) => sum + item.value, 0);
      distData.items.forEach((item) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        text += `• ${item.name}: ${item.value.toLocaleString()} (${percent}%)\n`;
      });
      return text;
    }
    
    case 'trend': {
      const trendData = data as TrendData;
      let text = 'Trend Over Time:\n\n';
      trendData.points.forEach((point) => {
        text += `${point.label}: ${point.value.toLocaleString()}\n`;
      });
      return text;
    }
    
    case 'list': {
      const listData = data as ListData;
      let text = `${listData.valueLabel ? listData.valueLabel + ':\n\n' : 'Results:\n\n'}`;
      listData.items.forEach((item, idx) => {
        text += `${item.rank || idx + 1}. ${item.name}: ${item.value}`;
        if (item.subtext) text += ` (${item.subtext})`;
        text += '\n';
      });
      return text;
    }
    
    default:
      return 'Data visualization';
  }
}

