import { QRCode } from '../entities/QRCode';
import { QRCodeSize as QRCodeSizeEnum } from '../value-objects/QRCodeSizes';

export interface QRCodeInput {
    value: string;
    labels: { name: string; value: string }[];
    size: QRCodeSizeEnum;
}

export interface IQRCodeService {
    generateQRCodes(items: QRCodeInput[]): Promise<QRCode[]>;
    generatePDF(qrCodes: QRCode[]): Promise<Buffer>;
} 