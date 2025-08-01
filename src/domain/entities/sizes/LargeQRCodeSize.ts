import { QRCodeSize, SizeConfig } from './QRCodeSize';

export class LargeQRCodeSize extends QRCodeSize {
    constructor() {
        const config: SizeConfig = {
            width: 150,
            height: 150,
            fontSize: 12,
            labelSpacing: 8,
            margin: 10
        };
        super(config);
    }

    getSizeName(): string {
        return 'Large';
    }

    getSizeCode(): string {
        return 'L';
    }

    // Specjalne metody dla dużego rozmiaru
    getLargeFontSize(): number {
        return 12;
    }

    getMaxLabels(): number {
        return 8; // Maksymalnie 8 etykiet dla dużego rozmiaru
    }

    getBoldFontSize(): number {
        return 14; // Większa czcionka dla nagłówków
    }
} 