import { QRCode } from '../../domain/entities/QRCode';
import { QRCodeSize as QRCodeSizeEnum, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_SIZES } from '../../domain/value-objects/QRCodeSizes';
import { IQRCodePreviewService, QRCodePreviewData, PDFPreviewData } from '../../domain/services/IQRCodePreviewService';
import { QRCodeInput } from '../../domain/services/IQRCodeService';
import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';

export class QRCodePreviewService implements IQRCodePreviewService {
    constructor(private readonly qrCodeRepository: IQRCodeRepository) {}

    async generatePreview(items: QRCodeInput[]): Promise<PDFPreviewData> {
        try {
            const qrCodes = await this.generateQRCodes(items);
            const layoutData = await this.calculateLayout(items);
            
            return {
                qrCodes: layoutData,
                totalPages: this.calculateTotalPages(layoutData),
                pageDimensions: {
                    width: 595.28, // A4 width in points
                    height: 841.89  // A4 height in points
                }
            };
        } catch (error) {
            console.error('Błąd podczas generowania podglądu:', error);
            throw error;
        }
    }

    async calculateLayout(items: QRCodeInput[]): Promise<QRCodePreviewData[]> {
        const qrCodes = await this.generateQRCodes(items);
        const sortedQrCodes = qrCodes.sort((a, b) => a.size.width - b.size.width);
        
        const pageMargin = 20;
        const qrSpacingX = 10;
        const qrSpacingY = 10;
        const maxRowWidth = 595.28 - 2 * pageMargin; // A4 width
        const maxPageHeight = 841.89 - 2 * pageMargin; // A4 height
        
        let x = pageMargin;
        let y = pageMargin;
        let maxRowHeight = 0;
        let currentPage = 1;
        const layoutData: QRCodePreviewData[] = [];

        for (const qrCode of sortedQrCodes) {
            // Sprawdzenie, czy zmieści się na bieżącej stronie
            if (x + qrCode.size.width > maxRowWidth) {
                x = pageMargin;
                y += maxRowHeight + qrSpacingY;
                maxRowHeight = 0;
            }

            if (y + qrCode.getTotalHeight() > maxPageHeight) {
                currentPage++;
                x = pageMargin;
                y = pageMargin;
                maxRowHeight = 0;
            }

            layoutData.push({
                qrCode,
                position: {
                    x,
                    y,
                    page: currentPage
                },
                dimensions: {
                    width: qrCode.size.width,
                    height: qrCode.size.height,
                    totalHeight: qrCode.getTotalHeight()
                }
            });

            // Aktualizacja maksymalnej wysokości wiersza
            const totalHeight = qrCode.getTotalHeight();
            if (totalHeight > maxRowHeight) {
                maxRowHeight = totalHeight;
            }

            // Aktualizacja współrzędnych do następnego kodu QR
            x += qrCode.size.width + qrSpacingX;
        }

        return layoutData;
    }

    private async generateQRCodes(items: QRCodeInput[]): Promise<QRCode[]> {
        // Sortowanie elementów po rozmiarze QR od najmniejszego do największego
        const sortedItems = items.sort((a, b) => 
            QR_CODE_SIZES[a.size].width - QR_CODE_SIZES[b.size].width
        );

        const qrCodes: QRCode[] = [];
        
        for (const item of sortedItems) {
            const { value, size, labels } = item;
            const qrSize = QR_CODE_SIZES[size] || QR_CODE_SIZES[QRCodeSizeEnum.DEFAULT];
            
            const qrCodeDataUrl = await this.qrCodeRepository.generateQRCode(value, qrSize);
            
            const qrCode = QRCode.create(qrCodeDataUrl, labels, qrSize);
            qrCodes.push(qrCode);
        }
        
        return qrCodes;
    }

    private calculateTotalPages(layoutData: QRCodePreviewData[]): number {
        if (layoutData.length === 0) return 0;
        return Math.max(...layoutData.map(item => item.position.page));
    }
} 