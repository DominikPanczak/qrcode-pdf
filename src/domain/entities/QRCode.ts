import { QRCodeTemplate } from './QRCodeTemplate';

export interface Label {
    name: string;
    value: string;
}

export interface QRCodeSize {
    width: number;
    height: number;
}

export class QRCode {
    constructor(
        public readonly value: string,
        public readonly labels: Label[],
        public readonly size: QRCodeSize,
        public readonly template?: QRCodeTemplate,
        public readonly showCuttingMarks?: boolean // Opcja pokazywania znaczników cięcia
    ) {}

    static create(value: string, labels: Label[], size: QRCodeSize, template?: QRCodeTemplate, showCuttingMarks?: boolean): QRCode {
        return new QRCode(value, labels, size, template, showCuttingMarks);
    }

    getTotalHeight(): number {
        // Jeśli mamy template, używamy jego wysokości + marginesy
        if (this.template && this.template.getConfig) {
            const templateConfig = this.template.getConfig();
            const contentMargin = 5;
            return templateConfig.height + 2 * contentMargin; // Template height + marginesy
        }
        
        // Fallback dla zwykłych QR kodów bez template'a
        const labelHeight = this.labels.length * 20; // Przybliżona wysokość etykiet
        return this.size.height + labelHeight + 10; // 10px padding
    }

    getTotalWidth(): number {
        return this.size.width;
    }
} 