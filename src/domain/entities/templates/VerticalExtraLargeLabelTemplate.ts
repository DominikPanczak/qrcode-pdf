import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class VerticalExtraLargeLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 450, // Szerokość dopasowana do QR kodu XL + margines
      height: 550, // QR kod 400px + etykiety poniżej
      qrCodeSize: { width: 400, height: 400 }, // Domyślny rozmiar XL, będzie nadpisany
      qrCodePosition: { x: 25, y: 15 }, // Wyśrodkowany
      labelsPosition: { x: 15, y: 430 }, // Poniżej QR kodu
      labelSpacing: 12,
      fontSize: 12,
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 1.0,
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Vertical Extra Large Label';
  }

  // Zwraca konfigurację z rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    
    // Dostosowanie do rzeczywistego rozmiaru QR kodu
    const templateWidth = Math.max(qrSize.width + 50, 450); // Minimum 450px
    const templateHeight = qrSize.height + 150; // QR + miejsce na etykiety
    
    // Wyśrodkowanie QR kodu
    const qrX = Math.max((templateWidth - qrSize.width) / 2, 25);
    const labelsY = qrSize.height + 30; // Poniżej QR kodu
    
    return {
      ...config,
      width: templateWidth,
      height: templateHeight,
      qrCodeSize: qrSize,
      qrCodePosition: { x: qrX, y: 15 },
      labelsPosition: { x: 15, y: labelsY }
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
      name: label.name,
      value: label.value
    }));
  }
}