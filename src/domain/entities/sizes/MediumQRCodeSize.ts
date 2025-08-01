import { QRCodeSize, SizeConfig } from './QRCodeSize';

export class MediumQRCodeSize extends QRCodeSize {
    constructor() {
        const config: SizeConfig = {
            width: 80,
            height: 80,
            fontSize: 8,
            labelSpacing: 5,
            margin: 8
        };
        super(config);
    }

    getSizeName(): string {
        return 'Medium';
    }

    getSizeCode(): string {
        return 'M';
    }

    // Specjalne metody dla średniego rozmiaru
    getStandardFontSize(): number {
        return 8;
    }

    getMaxLabels(): number {
        return 5; // Maksymalnie 5 etykiet dla średniego rozmiaru
    }
} 