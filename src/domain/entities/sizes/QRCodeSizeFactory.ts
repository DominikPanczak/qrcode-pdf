import { QRCodeSize } from './QRCodeSize';
import { SmallQRCodeSize } from './SmallQRCodeSize';
import { MediumQRCodeSize } from './MediumQRCodeSize';
import { LargeQRCodeSize } from './LargeQRCodeSize';
import { ExtraLargeQRCodeSize } from './ExtraLargeQRCodeSize';
import { QRCodeSize as QRCodeSizeEnum } from '../../value-objects/QRCodeSizes';

// Alias dla kompatybilności wstecznej - będzie usunięty w przyszłości
export const SizeType = QRCodeSizeEnum;

export class QRCodeSizeFactory {
    private static sizes: Map<QRCodeSizeEnum, QRCodeSize> = new Map();

    static {
        this.sizes.set(QRCodeSizeEnum.SMALL, new SmallQRCodeSize());
        this.sizes.set(QRCodeSizeEnum.MEDIUM, new MediumQRCodeSize());
        this.sizes.set(QRCodeSizeEnum.LARGE, new LargeQRCodeSize());
        this.sizes.set(QRCodeSizeEnum.EXTRA_LARGE, new ExtraLargeQRCodeSize());
    }

    static getSize(type: QRCodeSizeEnum): QRCodeSize {
        const size = this.sizes.get(type);
        if (!size) {
            throw new Error(`Size ${type} not found`);
        }
        return size;
    }

    static getAllSizes(): Map<QRCodeSizeEnum, QRCodeSize> {
        return new Map(this.sizes);
    }

    static getAvailableSizes(): QRCodeSizeEnum[] {
        return Array.from(this.sizes.keys());
    }

    static getSizeInfo(type: QRCodeSizeEnum): {
        name: string;
        code: string;
        dimensions: { width: number; height: number };
        fontSize: number;
        maxLabels: number;
    } {
        const size = this.getSize(type);
        return {
            name: size.getSizeName(),
            code: size.getSizeCode(),
            dimensions: {
                width: size.getWidth(),
                height: size.getHeight()
            },
            fontSize: size.getFontSize(),
            maxLabels: this.getMaxLabelsForSize(type)
        };
    }

    private static getMaxLabelsForSize(type: QRCodeSizeEnum): number {
        switch (type) {
            case QRCodeSizeEnum.SMALL:
                return 3;
            case QRCodeSizeEnum.MEDIUM:
                return 5;
            case QRCodeSizeEnum.LARGE:
                return 8;
            case QRCodeSizeEnum.EXTRA_LARGE:
                return 12;
            default:
                return 5;
        }
    }

    static getSizeByCode(code: string): QRCodeSize {
        const sizeType = Object.values(QRCodeSizeEnum).find(type => type === code);
        if (!sizeType) {
            throw new Error(`Size code ${code} not found`);
        }
        return this.getSize(sizeType as QRCodeSizeEnum);
    }
} 