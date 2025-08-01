import { QRCodePreviewService } from '../../application/services/QRCodePreviewService';
import { QRCodeInput } from '../../domain/services/IQRCodeService';
import { PDFPreviewData } from '../../domain/services/IQRCodePreviewService';

export class QRCodePreviewController {
    constructor(private readonly qrCodePreviewService: QRCodePreviewService) {}

    async generatePreview(items: QRCodeInput[]): Promise<PDFPreviewData> {
        return await this.qrCodePreviewService.generatePreview(items);
    }

    async getPreviewAsJSON(items: QRCodeInput[]): Promise<string> {
        const preview = await this.generatePreview(items);
        return JSON.stringify(preview, null, 2);
    }

    async getPreviewSummary(items: QRCodeInput[]): Promise<{
        totalQRCodes: number;
        totalPages: number;
        pageDimensions: { width: number; height: number };
        qrCodesPerPage: { [page: number]: number };
    }> {
        const preview = await this.generatePreview(items);
        
        const qrCodesPerPage: { [page: number]: number } = {};
        preview.qrCodes.forEach(item => {
            const page = item.position.page;
            qrCodesPerPage[page] = (qrCodesPerPage[page] || 0) + 1;
        });

        return {
            totalQRCodes: preview.qrCodes.length,
            totalPages: preview.totalPages,
            pageDimensions: preview.pageDimensions,
            qrCodesPerPage
        };
    }
} 