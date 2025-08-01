import { QRCode } from '../entities/QRCode';
 
export interface IQRCodeRepository {
    generateQRCode(value: string, size: { width: number; height: number }): Promise<string>;
    generatePDF(qrCodes: QRCode[]): Promise<Buffer>;
} 