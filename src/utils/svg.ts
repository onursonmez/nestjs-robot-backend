interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface RosMsg {
  info: {
    width: number;
    height: number;
  };
  data: number[];
}

interface Map {
  rosMsg: RosMsg;
  isActive: boolean;
}

export const generateSvg = (activeMap: Map): string => {
  if (!activeMap) return '';

  const mapWidth = activeMap.rosMsg.info.width;
  const mapHeight = activeMap.rosMsg.info.height;
  const rects: string[] = [];

  // Hücreleri SVG'de çizme
  for (let i = 1; i <= mapWidth; i++) {
    for (let j = 1; j <= mapHeight; j++) {
      const index = (mapHeight - j) * mapWidth + i;
      const value = activeMap.rosMsg.data[index];

      // Renkler: beyaz (0), siyah (100), gri (bilinmeyen -1)
      let color = 'white'; // Boş alan
      if (value === 100) {
        color = 'black'; // Engel
      } else if (value === -1) {
        color = 'gray'; // Bilinmeyen alan
      }

      // Her hücreyi bir dikdörtgen olarak SVG'ye ekle
      if (color === 'black' || color === 'white') {
        rects.push(
          `<rect x="${i}" y="${j}" width="1" height="1" fill="${color}" />`
        );
      }
    }
  }

  // SVG içeriğini oluştur
  const svgContent = `
    <svg width="${mapWidth}" height="${mapHeight}">
      <rect width="${mapWidth}" height="${mapHeight}" fill="transparent" />
      ${rects.join('')}
    </svg>
  `;

  // SVG içeriğini optimize et ve döndür
  return optimizeSvg(svgContent);
};
  
  const optimizeSvg = (svgContent: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const rects = Array.from(doc.querySelectorAll('rect'));
  
    // Renklerine göre gruplandırma
    const groupedRects = rects.reduce((acc: Record<string, Element[]>, rect) => {
      const fill = rect.getAttribute('fill');
      if (!fill) return acc; // fill özelliği yoksa atla
      if (!acc[fill]) {
        acc[fill] = [];
      }
      acc[fill].push(rect);
      return acc;
    }, {});
  
    // Gruplanmış rect'leri birleştirme
    const optimizedRects = Object.keys(groupedRects).flatMap((fill) => {
      const rectsWithSameColor = groupedRects[fill];
      const mergedRects = mergeRects(rectsWithSameColor);
      return mergedRects.map((rect) => {
        const newRect = doc.createElementNS('http://www.w3.org/2000/svg', 'rect');
        newRect.setAttribute('x', rect.x.toString());
        newRect.setAttribute('y', rect.y.toString());
        newRect.setAttribute('width', rect.width.toString());
        newRect.setAttribute('height', rect.height.toString());
        newRect.setAttribute('fill', fill);
        return newRect;
      });
    });
  
    // Eski rect'leri kaldırma ve yeni rect'leri ekleme
    const svg = doc.querySelector('svg');
    if (!svg) throw new Error('SVG element not found');
    svg.innerHTML = '';
    optimizedRects.forEach((rect) => svg.appendChild(rect));
  
    // Optimize edilmiş SVG içeriğini döndürme
    return new XMLSerializer().serializeToString(doc);
  };
  
  const mergeRects = (rects: Element[]): Rect[] => {
    const mergedRects: Rect[] = [];
    let currentRect: Rect | null = null;
  
    rects.sort((a, b) => {
      const yDiff = parseInt(a.getAttribute('y') || '0') - parseInt(b.getAttribute('y') || '0');
      if (yDiff !== 0) return yDiff;
      return parseInt(a.getAttribute('x') || '0') - parseInt(b.getAttribute('x') || '0');
    });
  
    rects.forEach((rect) => {
      const x = parseInt(rect.getAttribute('x') || '0');
      const y = parseInt(rect.getAttribute('y') || '0');
      const width = parseInt(rect.getAttribute('width') || '0');
      const height = parseInt(rect.getAttribute('height') || '0');
  
      if (!currentRect) {
        currentRect = { x, y, width, height };
      } else if (
        currentRect.y === y &&
        currentRect.height === height &&
        currentRect.x + currentRect.width === x
      ) {
        currentRect.width += width;
      } else {
        mergedRects.push(currentRect);
        currentRect = { x, y, width, height };
      }
    });
  
    if (currentRect) {
      mergedRects.push(currentRect);
    }
  
    return mergedRects;
  };
  
