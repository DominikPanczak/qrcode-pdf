import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class HorizontalExtraLargeLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 500, // Domyślna szerokość, będzie nadpisana przez dynamiczną
      height: 410, // Dopasowana wysokość: QR kod 400px + miejsce na etykiety
      qrCodeSize: { width: 200, height: 200 }, // Domyślny rozmiar XL, będzie nadpisany
      qrCodePosition: { x: 0, y: 0 },
      labelsPosition: { x: 408, y: 20 }, // 400 + 8px margines
      labelSpacing: 12,
      fontSize: 12, // Większa czcionka dla największego template'a
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 1.0, // Grubsza linia dla większego template'a
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Horizontal Extra Large Label';
  }

  // Dynamiczne obliczenie szerokości na podstawie tekstu i rozmiaru QR XL
  calculateDynamicWidth(labels: Label[], qrSize: { width: number; height: number }): number {
    const fontSize = 12;
    const charWidthEstimate = 6.0; // Największa czcionka = najszersze znaki
    const qrMargin = 8; // Margines po prawej od QR kodu
    const rightMargin = 25; // Margines po prawej od tekstu
    
    // Rzeczywista szerokość QR kodu + margines
    const baseQrWidth = qrSize.width + qrMargin;
    
    // Znajdź najdłuższy tekst spośród wszystkich etykiet  
    const maxTextLength = Math.max(
      ...labels.map(label => `${label.name}: ${label.value}`.length)
    );
    
    const textWidth = maxTextLength * charWidthEstimate;
    const totalWidth = baseQrWidth + textWidth + rightMargin;
    
    // Minimum: QR + podstawowy tekst, maksimum 1500px
    const minimumWidth = baseQrWidth + 200;
    return Math.max(minimumWidth, Math.min(1500, totalWidth));
  }

  // Zwraca konfigurację z dynamiczną szerokością i rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    const dynamicWidth = this.calculateDynamicWidth(labels, qrSize);
    
    // Dostosowanie wysokości template'a do rozmiaru QR kodu
    const templateHeight = Math.max(qrSize.height + 30, 410); // Minimum 410px
    
    // Dostosowanie pozycji etykiet do rozmiaru QR kodu
    const labelsX = qrSize.width + 8; // 8px margines od QR kodu
    
    return {
      ...config,
      width: dynamicWidth,
      height: templateHeight,
      qrCodeSize: qrSize, // Używamy rzeczywistego rozmiaru QR kodu
      labelsPosition: { x: labelsX, y: 20 }
    };
  }

  validateLabels(labels: Label[]): boolean {
    // Szablon obsługuje tylko rozmiar XL
    if (labels.length > 6) {
      throw new Error('Max 6 etykiet dla tego szablonu');
    }
    return true;
  }

  getRequiredLabels(): string[] {
    return ['PRODUCT', 'BATCH', 'GTIN', 'LOT', 'DATE', 'LOCATION'];
  }

  getOptionalLabels(): string[] {
    return [];
  }

  formatLabels(labels: Label[]): Label[] {
    return labels.slice(0, 6).map(label => ({
      name: '',
      value: `${label.name}: ${label.value}`
    }));
  }
}