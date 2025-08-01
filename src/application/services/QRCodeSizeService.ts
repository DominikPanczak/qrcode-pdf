import { IQRCodeSizeService, SizeQRCodeInput, SizePreviewData } from '../../domain/services/IQRCodeSizeService';
import { QRCodeSizeFactory } from '../../domain/entities/sizes/QRCodeSizeFactory';
import { QRCodeSize } from '../../domain/entities/sizes/QRCodeSize';
import { QRCodeSize as QRCodeSizeEnum } from '../../domain/value-objects/QRCodeSizes';
import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';

export class QRCodeSizeService implements IQRCodeSizeService {
    constructor(private readonly qrCodeRepository: IQRCodeRepository) {}

    async generateSizeQRCodes(items: SizeQRCodeInput[]): Promise<SizePreviewData[]> {
        try {
            const sizeData: SizePreviewData[] = [];
            let currentX = 20;
            let currentY = 20;
            let currentPage = 1;
            const pageWidth = 595.28; // A4 width
            const pageHeight = 841.89; // A4 height

            for (const item of items) {
                const size = QRCodeSizeFactory.getSize(item.sizeType);
                
                // Walidacja liczby etykiet dla rozmiaru
                if (!this.validateSizeLabels(item.sizeType, item.labels)) {
                    console.warn(`Size ${item.sizeType} validation failed for item: ${item.value}`);
                }

                // Generowanie kodu QR
                const qrCodeDataUrl = await this.qrCodeRepository.generateQRCode(
                    item.value, 
                    { width: size.getWidth(), height: size.getHeight() }
                );

                // Sprawdzenie czy zmieści się na stronie
                const sizeWidth = size.calculateTotalWidth();
                const sizeHeight = size.calculateTotalHeight(item.labels.length);

                if (currentX + sizeWidth > pageWidth - 40) {
                    currentX = 20;
                    currentY += sizeHeight + 20;
                }

                if (currentY + sizeHeight > pageHeight - 40) {
                    currentPage++;
                    currentX = 20;
                    currentY = 20;
                }

                sizeData.push({
                    size,
                    qrCode: {
                        value: qrCodeDataUrl,
                        labels: item.labels,
                        size: { width: size.getWidth(), height: size.getHeight() }
                    },
                    position: {
                        x: currentX,
                        y: currentY,
                        page: currentPage
                    },
                    dimensions: {
                        width: sizeWidth,
                        height: sizeHeight
                    }
                });

                currentX += sizeWidth + 20;
            }

            return sizeData;
        } catch (error) {
            console.error('Błąd podczas generowania kodów QR z rozmiarami:', error);
            throw error;
        }
    }

    validateSizeLabels(sizeType: QRCodeSizeEnum, labels: { name: string; value: string }[]): boolean {
        const maxLabels = this.getMaxLabelsForSize(sizeType);
        return labels.length <= maxLabels;
    }

    getSizeInfo(sizeType: QRCodeSizeEnum): any {
        return QRCodeSizeFactory.getSizeInfo(sizeType);
    }

    getAvailableSizes(): QRCodeSizeEnum[] {
        return QRCodeSizeFactory.getAvailableSizes();
    }

    getSizeByCode(code: string): QRCodeSize {
        return QRCodeSizeFactory.getSizeByCode(code);
    }

    private getMaxLabelsForSize(sizeType: QRCodeSizeEnum): number {
        switch (sizeType) {
            case QRCodeSizeEnum.SMALL:
                return 3;
            case QRCodeSizeEnum.MEDIUM:
                return 5;
            case QRCodeSizeEnum.LARGE:
                return 8;
            case QRCodeSizeEnum.EXTRA_LARGE:
                return 12;
            default:
                return 5;
        }
    }
} 