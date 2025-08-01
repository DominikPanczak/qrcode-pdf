import QRCode from 'qrcode';
import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';

export class QRCodeAdapter implements IQRCodeRepository {
    async generateQRCode(value: string, size: { width: number; height: number }): Promise<string> {
        try {
            return await QRCode.toDataURL(value);
        } catch (error) {
            console.error('Błąd podczas generowania kodu QR:', error);
            throw error;
        }
    }

    async generatePDF(qrCodes: any[]): Promise<Buffer> {
        throw new Error('PDF generation should be handled by PDFAdapter');
    }
} 