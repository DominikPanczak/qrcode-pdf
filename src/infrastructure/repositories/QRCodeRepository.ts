import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';
import { QRCode } from '../../domain/entities/QRCode';
import { QRCodeAdapter } from '../adapters/QRCodeAdapter';
import { PDFAdapter } from '../adapters/PDFAdapter';

export class QRCodeRepository implements IQRCodeRepository {
    constructor(
        private readonly qrCodeAdapter: QRCodeAdapter,
        private readonly pdfAdapter: PDFAdapter
    ) {}

    async generateQRCode(value: string, size: { width: number; height: number }): Promise<string> {
        return await this.qrCodeAdapter.generateQRCode(value, size);
    }

    async generatePDF(qrCodes: QRCode[]): Promise<Buffer> {
        return await this.pdfAdapter.generatePDF(qrCodes);
    }
} 