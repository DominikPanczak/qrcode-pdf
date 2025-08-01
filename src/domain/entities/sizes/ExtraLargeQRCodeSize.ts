import { QRCodeSize, SizeConfig } from './QRCodeSize';

export class ExtraLargeQRCodeSize extends QRCodeSize {
    constructor() {
        const config: SizeConfig = {
            width: 200,
            height: 200,
            fontSize: 16,
            labelSpacing: 10,
            margin: 15
        };
        super(config);
    }

    getSizeName(): string {
        return 'Extra Large';
    }

    getSizeCode(): string {
        return 'XL';
    }

    // Specjalne metody dla bardzo dużego rozmiaru
    getExtraLargeFontSize(): number {
        return 16;
    }

    getMaxLabels(): number {
        return 12; // Maksymalnie 12 etykiet dla bardzo dużego rozmiaru
    }

    getTitleFontSize(): number {
        return 20; // Duża czcionka dla tytułów
    }

    getSubtitleFontSize(): number {
        return 16; // Średnia czcionka dla podtytułów
    }
} 