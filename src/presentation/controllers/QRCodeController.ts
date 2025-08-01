import { QRCodeService } from '../../application/services/QRCodeService';
import { QRCodeInput } from '../../domain/services/IQRCodeService';
import { QRCode } from '../../domain/entities/QRCode';

export class QRCodeController {
    constructor(private readonly qrCodeService: QRCodeService) {}

    async generateQRCodes(items: QRCodeInput[]): Promise<QRCode[]> {
        return await this.qrCodeService.generateQRCodes(items);
    }

    async generatePDF(qrCodes: QRCode[]): Promise<Buffer> {
        return await this.qrCodeService.generatePDF(qrCodes);
    }

    async generateQRCodesAndPDF(items: QRCodeInput[]): Promise<{ qrCodes: QRCode[]; pdfBuffer: Buffer }> {
        const qrCodes = await this.generateQRCodes(items);
        const pdfBuffer = await this.generatePDF(qrCodes);
        
        return { qrCodes, pdfBuffer };
    }
} 