import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class VerticalLargeLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 230, // Szerokość dopasowana do QR kodu L + margines
      height: 320, // QR kod 200px + etykiety poniżej
      qrCodeSize: { width: 200, height: 200 }, // Domyślny rozmiar L, będzie nadpisany
      qrCodePosition: { x: 15, y: 10 }, // Wyśrodkowany
      labelsPosition: { x: 10, y: 220 }, // Poniżej QR kodu
      labelSpacing: 10,
      fontSize: 10,
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks'
    });
  }

  getTemplateName() {
    return 'Vertical Large Label';
  }

  // Zwraca konfigurację z rzeczywistym rozmiarem QR kodu
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    
    // Dostosowanie do rzeczywistego rozmiaru QR kodu
    const templateWidth = Math.max(qrSize.width + 30, 230); // Minimum 230px
    const templateHeight = qrSize.height + 120; // QR + miejsce na etykiety
    
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
      name: label.name,
      value: label.value
    }));
  }
}