// Domain
export { QRCode } from './domain/entities/QRCode';
export { QRCodeSize, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_DIMENSIONS, QR_CODE_CONFIGS_WITH_DEFAULT as QR_CODE_CONFIGS, QRCodeSizeHelper } from './domain/value-objects/QRCodeSizes';
// Backward compatibility exports
export { QRCodeSize as QRCodeSizeEnum, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_SIZES } from './domain/value-objects/QRCodeSizes';
export { IQRCodeRepository } from './domain/repositories/IQRCodeRepository';
export { IQRCodeService, QRCodeInput } from './domain/services/IQRCodeService';

// Application
export { QRCodeService } from './application/services/QRCodeService';

// Infrastructure
export { QRCodeRepository } from './infrastructure/repositories/QRCodeRepository';
export { QRCodeAdapter } from './infrastructure/adapters/QRCodeAdapter';
export { PDFAdapter } from './infrastructure/adapters/PDFAdapter';
export { Container } from './infrastructure/di/container';

// Presentation
export { QRCodeController } from './presentation/controllers/QRCodeController';

// Facade for backward compatibility
import { Container } from './infrastructure/di/container';
import { QRCodeController } from './presentation/controllers/QRCodeController';
import { QRCodePreviewController } from './presentation/controllers/QRCodePreviewController';
import { QRCodeService } from './application/services/QRCodeService';
import { QRCodePreviewService } from './application/services/QRCodePreviewService';
import { QRCodeInput } from './domain/services/IQRCodeService';
import { QRCode } from './domain/entities/QRCode';
import { PDFPreviewData } from './domain/services/IQRCodePreviewService';

export class QRCodeFacade {
    private static container = Container.getInstance();
    private static controller = new QRCodeController(
        this.container.get<QRCodeService>('QRCodeService')
    );
    private static previewController = new QRCodePreviewController(
        this.container.get<QRCodePreviewService>('QRCodePreviewService')
    );

    static async generateQRCodes(items: QRCodeInput[]) {
        return await this.controller.generateQRCodes(items);
    }

    static async generatePDF(qrCodes: QRCode[]) {
        return await this.controller.generatePDF(qrCodes);
    }

    static async generateQRCodesAndPDF(items: QRCodeInput[]) {
        return await this.controller.generateQRCodesAndPDF(items);
    }

    // Nowe metody dla podglądu
    static async generatePreview(items: QRCodeInput[]): Promise<PDFPreviewData> {
        return await this.previewController.generatePreview(items);
    }

    static async getPreviewAsJSON(items: QRCodeInput[]): Promise<string> {
        return await this.previewController.getPreviewAsJSON(items);
    }

    static async getPreviewSummary(items: QRCodeInput[]): Promise<{
        totalQRCodes: number;
        totalPages: number;
        pageDimensions: { width: number; height: number };
        qrCodesPerPage: { [page: number]: number };
    }> {
        return await this.previewController.getPreviewSummary(items);
    }
} 