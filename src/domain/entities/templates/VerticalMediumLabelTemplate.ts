import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class VerticalMediumLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 180, // Szerokość dopasowana do QR kodu M + margines
      height: 250, // QR kod 150px + etykiety poniżej
      qrCodeSize: { width: 150, height: 150 }, // Domyślny rozmiar M, będzie nadpisany
      qrCodePosition: { x: 15, y: 10 }, // Wyśrodkowany
      labelsPosition: { x: 10, y: 170 }, // Poniżej QR kodu
      labelSpacing: 8,
      fontSize: 8,
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Vertical Medium Label';
  }

  // Zwraca konfigurację z rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    
    // Dostosowanie do rzeczywistego rozmiaru QR kodu
    const templateWidth = Math.max(qrSize.width + 30, 180); // Minimum 180px
    const templateHeight = qrSize.height + 100; // QR + miejsce na etykiety
    
    // Wyśrodkowanie QR kodu
    const qrX = Math.max((templateWidth - qrSize.width) / 2, 15);
    const labelsY = qrSize.height + 20; // Poniżej QR kodu
    
    return {
      ...config,
      width: templateWidth,
      height: templateHeight,
      qrCodeSize: qrSize,
      qrCodePosition: { x: qrX, y: 10 },
      labelsPosition: { x: 10, y: labelsY }
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
      name: label.name,
      value: label.value
    }));
  }
}