import { QRCodeSize, SizeConfig } from './QRCodeSize';

export class SmallQRCodeSize extends QRCodeSize {
    constructor() {
        const config: SizeConfig = {
            width: 32,
            height: 32,
            fontSize: 6,
            labelSpacing: 3,
            margin: 5
        };
        super(config);
    }

    getSizeName(): string {
        return 'Small';
    }

    getSizeCode(): string {
        return 'S';
    }

    // Specjalne metody dla małego rozmiaru
    getCompactFontSize(): number {
        return 5;
    }

    getMaxLabels(): number {
        return 3; // Maksymalnie 3 etykiety dla małego rozmiaru
    }
} 