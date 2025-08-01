import { QRCode } from '../../domain/entities/QRCode';
import { QRCodeSize as QRCodeSizeEnum, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_SIZES } from '../../domain/value-objects/QRCodeSizes';
import { IQRCodeService, QRCodeInput } from '../../domain/services/IQRCodeService';
import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';

export class QRCodeService implements IQRCodeService {
    constructor(private readonly qrCodeRepository: IQRCodeRepository) {}

    async generateQRCodes(items: QRCodeInput[]): Promise<QRCode[]> {
        try {
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
        } catch (error) {
            console.error('Błąd podczas generowania kodów QR:', error);
            throw error;
        }
    }

    async generatePDF(qrCodes: QRCode[]): Promise<Buffer> {
        try {
            return await this.qrCodeRepository.generatePDF(qrCodes);
        } catch (error) {
            console.error('Błąd podczas generowania PDF:', error);
            throw error;
        }
    }
} 