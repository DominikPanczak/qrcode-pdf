import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class HorizontalLargeLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 500, // Domyślna szerokość, będzie nadpisana przez dynamiczną
      height: 210, // Dopasowana wysokość: QR kod 200px + miejsce na etykiety
      qrCodeSize: { width: 150, height: 150 }, // Domyślny rozmiar L, będzie nadpisany
      qrCodePosition: { x: 0, y: 0 },
      labelsPosition: { x: 208, y: 15 }, // 200 + 8px margines
      labelSpacing: 10,
      fontSize: 10, // Większa czcionka dla większego template'a
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Horizontal Large Label';
  }

  // Dynamiczne obliczenie szerokości na podstawie tekstu i rozmiaru QR L
  calculateDynamicWidth(labels: Label[], qrSize: { width: number; height: number }): number {
    const fontSize = 10;
    const charWidthEstimate = 5.0; // Większa czcionka = szersze znaki
    const qrMargin = 8; // Margines po prawej od QR kodu
    const rightMargin = 20; // Margines po prawej od tekstu
    
    // Rzeczywista szerokość QR kodu + margines
    const baseQrWidth = qrSize.width + qrMargin;
    
    // Znajdź najdłuższy tekst spośród wszystkich etykiet  
    const maxTextLength = Math.max(
      ...labels.map(label => `${label.name}: ${label.value}`.length)
    );
    
    const textWidth = maxTextLength * charWidthEstimate;
    const totalWidth = baseQrWidth + textWidth + rightMargin;
    
    // Minimum: QR + podstawowy tekst, maksimum 1200px
    const minimumWidth = baseQrWidth + 150;
    return Math.max(minimumWidth, Math.min(1200, totalWidth));
  }

  // Zwraca konfigurację z dynamiczną szerokością i rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    const dynamicWidth = this.calculateDynamicWidth(labels, qrSize);
    
    // Dostosowanie wysokości template'a do rozmiaru QR kodu
    const templateHeight = Math.max(qrSize.height + 20, 210); // Minimum 210px
    
    // Dostosowanie pozycji etykiet do rozmiaru QR kodu
    const labelsX = qrSize.width + 8; // 8px margines od QR kodu
    
    return {
      ...config,
      width: dynamicWidth,
      height: templateHeight,
      qrCodeSize: qrSize, // Używamy rzeczywistego rozmiaru QR kodu
      labelsPosition: { x: labelsX, y: 15 }
    };
  }

  validateLabels(labels: Label[]): boolean {
    // Szablon obsługuje tylko rozmiar L
    if (labels.length > 5) {
      throw new Error('Max 5 etykiet dla tego szablonu');
    }
    return true;
  }

  getRequiredLabels(): string[] {
    return ['PRODUCT', 'BATCH', 'GTIN', 'LOT', 'DATE'];
  }

  getOptionalLabels(): string[] {
    return [];
  }

  formatLabels(labels: Label[]): Label[] {
    return labels.slice(0, 5).map(label => ({
      name: '',
      value: `${label.name}: ${label.value}`
    }));
  }
}