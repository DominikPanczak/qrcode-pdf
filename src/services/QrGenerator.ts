import QRCode from 'qrcode';
import {QRCodeData, QRItem} from "../interface/qrItem.interface";
import {QRCodeSize, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_DIMENSIONS} from "../domain/value-objects/QRCodeSizes";

export class QrGenerator {
    items: QRItem[];

    constructor(items: QRItem[]) {
        this.items = items;
    }

    async generateQrCodes(): Promise<QRCodeData[]> {
        try {
            // Sortowanie elementów po rozmiarze QR od najmniejszego do największego
            this.items.sort((a, b) => QR_CODE_DIMENSIONS[a.size].width - QR_CODE_DIMENSIONS[b.size].width);

            const qrCodes: QRCodeData[] = [];
            for (const item of this.items) {
                const { value, size, labels } = item;

                // Ustalanie rozmiaru kodu QR na podstawie parametru 'size'
                const qrSize = QR_CODE_DIMENSIONS[size] || QR_CODE_DIMENSIONS[QRCodeSize.DEFAULT];

                const qrCodeDataUrl = await QRCode.toDataURL(value);

                qrCodes.push({ value: qrCodeDataUrl, labels, size: qrSize });
            }
            return qrCodes;
        } catch (error) {
            console.error('Błąd podczas generowania kodów QR:', error);
            throw error;
        }
    }
}

