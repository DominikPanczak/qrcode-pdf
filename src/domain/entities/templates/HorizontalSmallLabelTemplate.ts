import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

export class HorizontalSmallLabelTemplate extends QRCodeTemplate {
  constructor() {
    super({
      width: 500, // Szerokość dla ~255 znaków (przy fontSize 5, około 2px na znak)
      height: 35, // Dopasowana wysokość: QR kod 32px + małe miejsce na etykiety
      qrCodeSize: { width: 32, height: 32 },
      qrCodePosition: { x: 0, y: 0 },
      labelsPosition: { x: 36, y: 3 },
      labelSpacing: 5, // Zmniejszony spacing
      fontSize: 6, // Zwiększona czcionka z 5 do 6
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks' // Dostępne znaczniki, ale kontrolowane przez showCuttingMarks
    });
  }

  getTemplateName() {
    return 'Horizontal Small Label';
  }

  // Dynamiczne obliczenie szerokości na podstawie tekstu i rzeczywistej szerokości QR
  calculateDynamicWidth(labels: Label[], qrSize: { width: number; height: number }): number {
    const fontSize = 6;
    const charWidthEstimate = 3.5; // Zwiększona szerokość znaku dla lepszego oszacowania
    const qrMargin = 4; // Margines po prawej od QR kodu
    const rightMargin = 10; // Margines po prawej od tekstu
    
    // Rzeczywista szerokość QR kodu + margines
    const baseQrWidth = qrSize.width + qrMargin;
    
    // Znajdź najdłuższy tekst spośród wszystkich etykiet  
    const maxTextLength = Math.max(
      ...labels.map(label => `${label.name}: ${label.value}`.length)
    );
    
    const textWidth = maxTextLength * charWidthEstimate;
    const totalWidth = baseQrWidth + textWidth + rightMargin;
    
    // Minimum: QR + podstawowy tekst, maksimum 800px
    const minimumWidth = baseQrWidth + 50; // QR + miejsce na podstawowy tekst
    return Math.max(minimumWidth, Math.min(800, totalWidth));
  }

  // Zwraca konfigurację z dynamiczną szerokością dla danych etykiet i rozmiaru QR
  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    return {
      ...config,
      width: this.calculateDynamicWidth(labels, qrSize)
    };
  }

  validateLabels(labels: Label[], size?: QRCodeSizeEnum): boolean {
    if (size && size !== QRCodeSizeEnum.SMALL) {
      throw new Error('Szablon poziomy jest dostępny tylko dla rozmiaru S!');
    }
    if (labels.length > 3) {
      throw new Error('Max 3 etykiety dla tego szablonu');
    }
    return true;
  }

  getRequiredLabels(): string[] {
    return ['SMP', 'LOT', 'GTIN'];
  }

  getOptionalLabels(): string[] {
    return [];
  }

  formatLabels(labels: Label[]): Label[] {
    return labels.slice(0, 3).map(label => ({
      name: '',
      value: `${label.name}: ${label.value}`
    }));
  }
} 