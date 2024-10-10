import QRCode from 'qrcode';
import {QRCodeData, QRItem} from "../interface/qrItem.interface";
import {QR_SIZES, QRSize} from "../enum/qrSizes.enum";

export class QrGenerator {
    items: QRItem[];

    constructor(items: QRItem[]) {
        this.items = items;
    }

    async generateQrCodes(): Promise<QRCodeData[]> {
        try {
            // Sortowanie elementów po rozmiarze QR od najmniejszego do największego
            this.items.sort((a, b) => QR_SIZES[a.size][0] - QR_SIZES[b.size][0]);

            const qrCodes: QRCodeData[] = [];
            for (const item of this.items) {
                const { value, size, labels } = item;

                // Ustalanie rozmiaru kodu QR na podstawie parametru 'size'
                const qrSize = QR_SIZES[size] || QR_SIZES[QRSize.DEFAULT];

                // Generowanie kodu QR
                console.log(`Generowanie kodu QR dla: ${value}`);
                const qrCodeDataUrl = await QRCode.toDataURL(value);
                console.log(`Wygenerowano kod QR dla: ${value}`);

                qrCodes.push({ value: qrCodeDataUrl, labels, size: qrSize });
            }
            return qrCodes;
        } catch (error) {
            console.error('Błąd podczas generowania kodów QR:', error);
            throw error;
        }
    }
}

