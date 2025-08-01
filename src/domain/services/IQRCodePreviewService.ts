import { QRCodeInput } from './IQRCodeService';
import { QRCode } from '../entities/QRCode';

export interface QRCodePreviewData {
    qrCode: QRCode;
    position: {
        x: number;
        y: number;
        page: number;
    };
    dimensions: {
        width: number;
        height: number;
        totalHeight: number;
    };
}

export interface PDFPreviewData {
    qrCodes: QRCodePreviewData[];
    totalPages: number;
    pageDimensions: {
        width: number;
        height: number;
    };
}

export interface IQRCodePreviewService {
    generatePreview(items: QRCodeInput[]): Promise<PDFPreviewData>;
    calculateLayout(items: QRCodeInput[]): Promise<QRCodePreviewData[]>;
} 