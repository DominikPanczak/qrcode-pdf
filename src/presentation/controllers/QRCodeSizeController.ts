import { QRCodeSizeService } from '../../application/services/QRCodeSizeService';
import { SizeQRCodeInput, SizePreviewData } from '../../domain/services/IQRCodeSizeService';
import { QRCodeSize as QRCodeSizeEnum } from '../../domain/value-objects/QRCodeSizes';

export class QRCodeSizeController {
    constructor(private readonly qrCodeSizeService: QRCodeSizeService) {}

    async generateSizeQRCodes(items: SizeQRCodeInput[]): Promise<SizePreviewData[]> {
        return await this.qrCodeSizeService.generateSizeQRCodes(items);
    }

    validateSizeLabels(sizeType: QRCodeSizeEnum, labels: { name: string; value: string }[]): boolean {
        return this.qrCodeSizeService.validateSizeLabels(sizeType, labels);
    }

    getSizeInfo(sizeType: QRCodeSizeEnum): any {
        return this.qrCodeSizeService.getSizeInfo(sizeType);
    }

    getAvailableSizes(): QRCodeSizeEnum[] {
        return this.qrCodeSizeService.getAvailableSizes();
    }

    getSizeByCode(code: string): any {
        return this.qrCodeSizeService.getSizeByCode(code);
    }

    async getSizesSummary(): Promise<{
        availableSizes: QRCodeSizeEnum[];
        sizesInfo: { [key: string]: any };
    }> {
        const availableSizes = this.getAvailableSizes();
        const sizesInfo: { [key: string]: any } = {};

        for (const sizeType of availableSizes) {
            sizesInfo[sizeType] = this.getSizeInfo(sizeType);
        }

        return {
            availableSizes,
            sizesInfo
        };
    }
} 