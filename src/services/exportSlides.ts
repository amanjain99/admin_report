import type { QueryResponse, SingleStatData, ComparisonData, DistributionData, TrendData, ListData } from '../types';

/**
 * Export query responses to PowerPoint slides format
 * Uses pptxgenjs to create presentation
 */
export async function exportToSlides(responses: QueryResponse[]): Promise<void> {
  // Dynamically import pptxgenjs
  const PptxGenJS = (await import('pptxgenjs')).default;
  
  const pptx = new PptxGenJS();
  
  // Set presentation properties
  pptx.author = 'Analytics Dashboard';
  pptx.title = 'Analytics Report';
  pptx.subject = 'Data Visualizations Export';
  
  // Define theme colors
  const colors = {
    primary: '10B981',    // emerald-500
    secondary: '6B7280',  // gray-500
    background: 'FFFFFF',
    text: '1F2937',       // gray-800
    textLight: '6B7280',  // gray-500
    accent: 'E91E8C',     // pink
  };

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: colors.background };
  
  // Title
  titleSlide.addText('Analytics Report', {
    x: 0.5,
    y: 2.5,
    w: 9,
    h: 1,
    fontSize: 44,
    fontFace: 'Arial',
    color: colors.text,
    bold: true,
    align: 'center',
  });
  
  // Date
  titleSlide.addText(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 0.5,
    fontSize: 18,
    fontFace: 'Arial',
    color: colors.textLight,
    align: 'center',
  });
  
  // Count
  titleSlide.addText(`${responses.length} visualization${responses.length !== 1 ? 's' : ''}`, {
    x: 0.5,
    y: 4.2,
    w: 9,
    h: 0.5,
    fontSize: 14,
    fontFace: 'Arial',
    color: colors.secondary,
    align: 'center',
  });

  // Decorative line
  titleSlide.addShape('rect', {
    x: 3.5,
    y: 4.8,
    w: 3,
    h: 0.05,
    fill: { color: colors.primary },
  });

  // Add a slide for each response
  for (const response of responses) {
    const slide = pptx.addSlide();
    slide.background = { color: colors.background };
    
    // Title
    slide.addText(response.title, {
      x: 0.5,
      y: 0.4,
      w: 9,
      h: 0.8,
      fontSize: 28,
      fontFace: 'Arial',
      color: colors.text,
      bold: true,
    });
    
    // Subtitle
    if (response.subtitle) {
      slide.addText(response.subtitle, {
        x: 0.5,
        y: 1.1,
        w: 9,
        h: 0.5,
        fontSize: 14,
        fontFace: 'Arial',
        color: colors.textLight,
      });
    }

    // Add content based on visualization type
    addVisualizationContent(slide, response, colors);
    
    // Footer with query
    slide.addText(`Query: "${response.query}"`, {
      x: 0.5,
      y: 5.2,
      w: 9,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: colors.secondary,
      italic: true,
    });
  }

  // Save the presentation
  const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.pptx`;
  await pptx.writeFile({ fileName: filename });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVisualizationContent(slide: any, response: QueryResponse, colors: Record<string, string>): void {
  const { type, data } = response;
  const startY = response.subtitle ? 1.7 : 1.4;
  
  switch (type) {
    case 'single_stat': {
      const statData = data as SingleStatData;
      
      // Large value
      slide.addText(`${statData.value}${statData.suffix || ''}`, {
        x: 0.5,
        y: startY + 0.5,
        w: 9,
        h: 1.5,
        fontSize: 72,
        fontFace: 'Arial',
        color: colors.primary,
        bold: true,
        align: 'center',
      });
      
      // Label
      slide.addText(statData.label, {
        x: 0.5,
        y: startY + 2,
        w: 9,
        h: 0.5,
        fontSize: 18,
        fontFace: 'Arial',
        color: colors.text,
        align: 'center',
      });
      
      // Trend if present
      if (statData.trend) {
        const trendText = `${statData.trend.direction === 'up' ? '↑' : statData.trend.direction === 'down' ? '↓' : '→'} ${statData.trend.value}%`;
        const trendColor = statData.trend.direction === 'up' ? '10B981' : statData.trend.direction === 'down' ? 'EF4444' : colors.secondary;
        slide.addText(trendText, {
          x: 0.5,
          y: startY + 2.6,
          w: 9,
          h: 0.4,
          fontSize: 16,
          fontFace: 'Arial',
          color: trendColor,
          align: 'center',
        });
      }
      break;
    }
    
    case 'comparison': {
      const compData = data as ComparisonData;
      const maxValue = Math.max(...compData.items.map(item => item.value));
      
      compData.items.forEach((item, idx) => {
        const barWidth = (item.value / maxValue) * 6;
        const yPos = startY + 0.3 + idx * 0.7;
        
        // Label
        slide.addText(item.name, {
          x: 0.5,
          y: yPos,
          w: 2.5,
          h: 0.5,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.text,
          valign: 'middle',
        });
        
        // Bar
        slide.addShape('rect', {
          x: 3,
          y: yPos + 0.1,
          w: barWidth,
          h: 0.35,
          fill: { color: item.color?.replace('#', '') || colors.primary },
        });
        
        // Value
        slide.addText(item.value.toLocaleString(), {
          x: 3 + barWidth + 0.1,
          y: yPos,
          w: 1.5,
          h: 0.5,
          fontSize: 11,
          fontFace: 'Arial',
          color: colors.textLight,
          valign: 'middle',
        });
      });
      break;
    }
    
    case 'distribution': {
      const distData = data as DistributionData;
      const total = distData.total || distData.items.reduce((sum, item) => sum + item.value, 0);
      const defaultColors = ['10B981', '3B82F6', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'];
      
      distData.items.forEach((item, idx) => {
        const percent = ((item.value / total) * 100).toFixed(1);
        const yPos = startY + 0.3 + idx * 0.6;
        const itemColor = item.color?.replace('#', '') || defaultColors[idx % defaultColors.length];
        
        // Color dot
        slide.addShape('ellipse', {
          x: 0.5,
          y: yPos + 0.15,
          w: 0.2,
          h: 0.2,
          fill: { color: itemColor },
        });
        
        // Label
        slide.addText(item.name, {
          x: 0.85,
          y: yPos,
          w: 4,
          h: 0.5,
          fontSize: 14,
          fontFace: 'Arial',
          color: colors.text,
          valign: 'middle',
        });
        
        // Value and percent
        slide.addText(`${item.value.toLocaleString()} (${percent}%)`, {
          x: 5,
          y: yPos,
          w: 2,
          h: 0.5,
          fontSize: 14,
          fontFace: 'Arial',
          color: colors.textLight,
          valign: 'middle',
          align: 'right',
        });
      });
      break;
    }
    
    case 'trend': {
      const trendData = data as TrendData;
      
      // Display as a simple table since we can't easily do line charts
      trendData.points.forEach((point, idx) => {
        const yPos = startY + 0.3 + idx * 0.5;
        
        slide.addText(point.label, {
          x: 0.5,
          y: yPos,
          w: 3,
          h: 0.4,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.text,
          valign: 'middle',
        });
        
        slide.addText(point.value.toLocaleString(), {
          x: 3.5,
          y: yPos,
          w: 2,
          h: 0.4,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.primary,
          bold: true,
          valign: 'middle',
        });
      });
      break;
    }
    
    case 'list': {
      const listData = data as ListData;
      
      listData.items.slice(0, 8).forEach((item, idx) => {
        const yPos = startY + 0.2 + idx * 0.45;
        
        // Rank
        slide.addText(`${item.rank || idx + 1}.`, {
          x: 0.5,
          y: yPos,
          w: 0.4,
          h: 0.4,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.primary,
          bold: true,
          valign: 'middle',
        });
        
        // Name
        slide.addText(item.name, {
          x: 1,
          y: yPos,
          w: 5,
          h: 0.4,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.text,
          valign: 'middle',
        });
        
        // Value
        slide.addText(String(item.value), {
          x: 6,
          y: yPos,
          w: 2,
          h: 0.4,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.textLight,
          valign: 'middle',
          align: 'right',
        });
      });
      break;
    }
    
    default:
      slide.addText('Visualization data', {
        x: 0.5,
        y: startY + 0.5,
        w: 9,
        h: 1,
        fontSize: 16,
        fontFace: 'Arial',
        color: colors.textLight,
        align: 'center',
      });
  }
}

