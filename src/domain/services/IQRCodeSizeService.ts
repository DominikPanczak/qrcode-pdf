import { QRCodeSize as QRCodeSizeEnum } from '../value-objects/QRCodeSizes';
import { QRCodeSize } from '../entities/sizes/QRCodeSize';

export interface SizeQRCodeInput {
    value: string;
    labels: { name: string; value: string }[];
    sizeType: QRCodeSizeEnum;
}

export interface SizePreviewData {
    size: QRCodeSize;
    qrCode: any;
    position: {
        x: number;
        y: number;
        page: number;
    };
    dimensions: {
        width: number;
        height: number;
    };
}

export interface IQRCodeSizeService {
    generateSizeQRCodes(items: SizeQRCodeInput[]): Promise<SizePreviewData[]>;
    validateSizeLabels(sizeType: QRCodeSizeEnum, labels: { name: string; value: string }[]): boolean;
    getSizeInfo(sizeType: QRCodeSizeEnum): any;
    getAvailableSizes(): QRCodeSizeEnum[];
    getSizeByCode(code: string): QRCodeSize;
} 