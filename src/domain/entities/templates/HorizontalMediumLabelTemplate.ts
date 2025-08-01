import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class HorizontalMediumLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 500, // Domyślna szerokość, będzie nadpisana przez dynamiczną
      height: 160, // Dopasowana wysokość: QR kod 150px + miejsce na etykiety
      qrCodeSize: { width: 80, height: 80 }, // Domyślny rozmiar M, będzie nadpisany
      qrCodePosition: { x: 0, y: 0 },
      labelsPosition: { x: 158, y: 10 }, // 150 + 8px margines
      labelSpacing: 8,
      fontSize: 8, // Większa czcionka dla większego template'a
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Horizontal Medium Label';
  }

  // Dynamiczne obliczenie szerokości na podstawie tekstu i rozmiaru QR M
  calculateDynamicWidth(labels: Label[], qrSize: { width: number; height: number }): number {
    const fontSize = 8;
    const charWidthEstimate = 4.0; // Większa czcionka = szersze znaki
    const qrMargin = 8; // Margines po prawej od QR kodu
    const rightMargin = 15; // Margines po prawej od tekstu
    
    // Rzeczywista szerokość QR kodu + margines
    const baseQrWidth = qrSize.width + qrMargin;
    
    // Znajdź najdłuższy tekst spośród wszystkich etykiet  
    const maxTextLength = Math.max(
      ...labels.map(label => `${label.name}: ${label.value}`.length)
    );
    
    const textWidth = maxTextLength * charWidthEstimate;
    const totalWidth = baseQrWidth + textWidth + rightMargin;
    
    // Minimum: QR + podstawowy tekst, maksimum 550px (bezpieczna szerokość dla A4)
    const minimumWidth = baseQrWidth + 100;
    const maxSafeWidth = 550; // Bezpieczna szerokość uwzględniająca marginesy strony
    return Math.max(minimumWidth, Math.min(maxSafeWidth, totalWidth));
  }

  // Zwraca konfigurację z dynamiczną szerokością i rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    const dynamicWidth = this.calculateDynamicWidth(labels, qrSize);
    
    // Dostosowanie wysokości template'a do rozmiaru QR kodu
    const templateHeight = Math.max(qrSize.height + 20, 160); // Minimum 160px
    
    // Dostosowanie pozycji etykiet do rozmiaru QR kodu
    const labelsX = qrSize.width + 8; // 8px margines od QR kodu
    
    return {
      ...config,
      width: dynamicWidth,
      height: templateHeight,
      qrCodeSize: qrSize, // Używamy rzeczywistego rozmiaru QR kodu
      labelsPosition: { x: labelsX, y: 10 }
    };
  }

  validateLabels(labels: Label[]): boolean {
    // Szablon obsługuje tylko rozmiar M
    if (labels.length > 4) {
      throw new Error('Max 4 etykiety dla tego szablonu');
    }
    return true;
  }

  getRequiredLabels(): string[] {
    return ['PRODUCT', 'BATCH', 'GTIN', 'LOT'];
  }

  getOptionalLabels(): string[] {
    return [];
  }

  formatLabels(labels: Label[]): Label[] {
    return labels.slice(0, 4).map(label => ({
      name: '',
      value: `${label.name}: ${label.value}`
    }));
  }
}