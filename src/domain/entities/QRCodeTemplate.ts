import { QRCode } from './QRCode';
import { Label } from './QRCode';

export interface TemplateConfig {
    width: number;
    height: number;
    qrCodeSize: { width: number; height: number };
    qrCodePosition: { x: number; y: number };
    labelsPosition: { x: number; y: number };
    labelSpacing: number;
    fontSize: number;
    fontBold: boolean;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'corner-marks';
}

export abstract class QRCodeTemplate {
    protected config: TemplateConfig;

    constructor(config: TemplateConfig) {
        this.config = config;
    }

    abstract getTemplateName(): string;
    abstract validateLabels(labels: Label[]): boolean;
    abstract getRequiredLabels(): string[];
    abstract getOptionalLabels(): string[];

    getConfig(): TemplateConfig {
        return this.config;
    }

    calculateTotalHeight(qrCode: QRCode): number {
        const labelHeight = qrCode.labels.length * (this.config.fontSize + this.config.labelSpacing);
        return Math.max(this.config.height, this.config.qrCodeSize.height + labelHeight);
    }

    calculateTotalWidth(): number {
        return this.config.width;
    }

    // Opcjonalna metoda formatowania etykiet - może być nadpisana w konkretnych template'ach
    formatLabels(labels: Label[]): Label[] {
        return labels; // Domyślnie zwraca etykiety bez zmian
    }
} 