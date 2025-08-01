import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

interface UniversalHorizontalTemplateConfig {
  maxLabels?: number;              // Maksymalna liczba etykiet (domyślnie bez limitu)
  fontSize?: number;               // Rozmiar czcionki (domyślnie dynamiczny)
  labelSpacing?: number;           // Odstęp między etykietami (domyślnie 8)
  qrMargin?: number;              // Margines od QR kodu do etykiet (domyślnie 8)
  rightMargin?: number;           // Margines prawy (domyślnie 15)
  charWidthEstimate?: number;     // Szacowana szerokość znaku (domyślnie 4.0)
  minWidth?: number;              // Minimalna szerokość (domyślnie zależna od QR)
  maxWidth?: number;              // Maksymalna szerokość (domyślnie 1000)
  verticalSpacing?: number;       // Odstęp pionowy między etykietami (domyślnie 2)
}

export class UniversalHorizontalTemplate extends QRCodeTemplate {
  protected templateConfig: UniversalHorizontalTemplateConfig;

  constructor(config: UniversalHorizontalTemplateConfig = {}) {
    super({
      width: 500,                // Będzie nadpisane przez dynamiczną szerokość
      height: 160,               // Będzie dostosowane do rozmiaru QR
      qrCodeSize: { width: 150, height: 150 }, // Będzie nadpisane
      qrCodePosition: { x: 0, y: 0 },
      labelsPosition: { x: 158, y: 10 },
      labelSpacing: config.labelSpacing ?? 8,
      fontSize: config.fontSize ?? 8,
      fontBold: false,
      borderColor: '#000000',
      borderWidth: 0.5,
      borderStyle: 'corner-marks'
    });

    this.templateConfig = {
      maxLabels: config.maxLabels,
      fontSize: config.fontSize,
      labelSpacing: config.labelSpacing ?? 8,
      qrMargin: config.qrMargin ?? 8,
      rightMargin: config.rightMargin ?? 15,
      charWidthEstimate: config.charWidthEstimate ?? 4.0,
      minWidth: config.minWidth,
      maxWidth: config.maxWidth ?? 1000,
      verticalSpacing: config.verticalSpacing ?? 2
    };
  }

  getTemplateName() {
    return 'Universal Horizontal Label';
  }

  calculateDynamicWidth(labels: Label[], qrSize: { width: number; height: number }): number {
    const fontSize = this.templateConfig.fontSize ?? this.calculateFontSize(qrSize.width);
    const charWidthEstimate = this.templateConfig.charWidthEstimate!;
    const qrMargin = this.templateConfig.qrMargin!;
    const rightMargin = this.templateConfig.rightMargin!;
    
    // Rzeczywista szerokość QR kodu + margines
    const baseQrWidth = qrSize.width + qrMargin;
    
    // Znajdź najdłuższy tekst spośród wszystkich etykiet
    const maxTextLength = Math.max(
      ...labels.map(label => {
        // Jeśli etykieta ma nazwę, dodajemy ": " do długości
        const labelPrefix = label.name ? `${label.name}: ` : '';
        return (labelPrefix + label.value).length;
      })
    );
    
    const textWidth = maxTextLength * charWidthEstimate;
    const totalWidth = baseQrWidth + textWidth + rightMargin;
    
    // Minimum: QR + podstawowy tekst, maksimum z konfiguracji
    const minimumWidth = this.templateConfig.minWidth ?? (baseQrWidth + 100);
    return Math.max(minimumWidth, Math.min(this.templateConfig.maxWidth!, totalWidth));
  }

  private calculateFontSize(qrWidth: number): number {
    if (qrWidth <= 80) return 6;
    if (qrWidth <= 150) return 8;
    if (qrWidth <= 200) return 10;
    return 12;
  }

  getConfigForLabels(labels: Label[], qrSize: { width: number; height: number }): TemplateConfig {
    const config = this.getConfig();
    const dynamicWidth = this.calculateDynamicWidth(labels, qrSize);
    
    // Dostosowanie wysokości template'a do rozmiaru QR kodu i ilości etykiet
    const fontSize = this.templateConfig.fontSize ?? this.calculateFontSize(qrSize.width);
    const totalLabelsHeight = labels.length * (fontSize + this.templateConfig.verticalSpacing!);
    const templateHeight = Math.max(qrSize.height, totalLabelsHeight) + 20; // 20px na marginesy
    
    // Dostosowanie pozycji etykiet do rozmiaru QR kodu
    const labelsX = qrSize.width + this.templateConfig.qrMargin!;
    
    return {
      ...config,
      width: dynamicWidth,
      height: templateHeight,
      qrCodeSize: qrSize,
      labelsPosition: { x: labelsX, y: 10 },
      fontSize
    };
  }

  validateLabels(labels: Label[]): boolean {
    // Dla rozmiaru S (80x80) automatycznie ograniczamy do 3 etykiet
    const qrSize = this.getConfig().qrCodeSize;
    if (qrSize.width <= 80 && labels.length > 3) {
      console.warn(`Uwaga: Dla małego rozmiaru QR (${qrSize.width}x${qrSize.height}) można wyświetlić maksymalnie 3 etykiety. Nadmiarowe etykiety zostaną pominięte.`);
    }
    return true;
  }

  formatLabels(labels: Label[]): Label[] {
    // Dla rozmiaru S (80x80) automatycznie ograniczamy do 3 etykiet
    const qrSize = this.getConfig().qrCodeSize;
    const limitedLabels = qrSize.width <= 80 
      ? labels.slice(0, 3) 
      : labels;

    return limitedLabels.map(label => {
      if (!label.name) return label;
      return {
        name: '',
        value: `${label.name}: ${label.value}`
      };
    });
  }

  getRequiredLabels(): string[] {
    // Uniwersalny template nie wymusza żadnych konkretnych etykiet
    return [];
  }

  getOptionalLabels(): string[] {
    // Wszystkie etykiety są opcjonalne
    return [
      'PRODUCT', 'BATCH', 'GTIN', 'LOT', 'EXP', 'SERIAL', 
      'DATE', 'CODE', 'ID', 'NAME', 'DESC', 'INFO',
      'MANUFACTURER', 'SUPPLIER', 'CUSTOMER', 'LOCATION',
      'STATUS', 'CATEGORY', 'GROUP', 'TYPE', 'MODEL',
      'VERSION', 'REVISION', 'REFERENCE', 'NOTES'
    ];
  }
}