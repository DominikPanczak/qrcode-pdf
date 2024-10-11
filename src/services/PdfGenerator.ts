import {QRCodeData} from "../interface/qrItem.interface";
import PDFDocument from "pdfkit";
import {QR_SIZES, QRSize} from "../enum/qrSizes.enum";

export class PdfGenerator {
    qrCodes: QRCodeData[];

    constructor(qrCodes: QRCodeData[]) {
        this.qrCodes = qrCodes;
    }

    async generatePdf(): Promise<Buffer> {
        try {
            console.log('Rozpoczynam generowanie PDF...');
            // Tworzenie nowego dokumentu PDF
            const doc = new PDFDocument({ margin: 20 }); // Zwiększenie marginesu do 20
            const chunks: Buffer[] = [];

            return await new Promise((resolve, reject) => {
                this.setupDocumentListeners(doc, chunks, resolve, reject);
                this.addQrCodesToDocument(doc);
                doc.end();
            });
        } catch (error) {
            console.error('Błąd podczas generowania PDF:', error);
            throw error;
        }
    }

    setupDocumentListeners(doc: PDFKit.PDFDocument, chunks: Buffer[], resolve: (value: Buffer | PromiseLike<Buffer>) => void, reject: (reason?: any) => void) {
        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            console.log('PDF został wygenerowany pomyślnie.');
            resolve(pdfBuffer);
        });

        doc.on('error', (error) => {
            console.error('Błąd podczas generowania PDF:', error);
            reject(error);
        });
    }

    addQrCodesToDocument(doc: PDFKit.PDFDocument) {
        // Sortowanie QR kodów według rozmiaru
        const sortedQrCodes = this.qrCodes.sort((a, b) => a.size[0] - b.size[0]);

        // Ustawienia układu strony
        const pageMargin = 20;
        const qrSpacingX = 10;
        const qrSpacingY = 10;
        const maxRowWidth = doc.page.width - 2 * pageMargin;
        let x = pageMargin;
        let y = pageMargin;
        let maxRowHeight = 0;

        for (const [index, qrCode] of sortedQrCodes.entries()) {
            const { value, labels, size } = qrCode;

            // Sprawdzenie, czy zmieści się na bieżącej stronie, jeśli nie - dodaj nową stronę
            if (x + size[0] > maxRowWidth) {
                x = pageMargin;
                y += maxRowHeight + qrSpacingY;
                maxRowHeight = 0;
            }

            if (y + size[1] + labels.length * 20 + 20 > doc.page.height) {
                this.addNewPage(doc);
                x = pageMargin;
                y = pageMargin;
                maxRowHeight = 0;
            }

            // Dodawanie kodu QR do PDF
            this.addQrCodeToDocument(doc, value, x, y, size);

            // Dodanie etykiet poniżej kodu QR
            const labelY = y + size[1] + 5;
            const updatedY = this.addLabelsToDocument(doc, labels, x, labelY, size[0]);

            // Aktualizacja maksymalnej wysokości wiersza
            const totalHeight = updatedY - y;
            if (totalHeight > maxRowHeight) {
                maxRowHeight = totalHeight;
            }

            // Aktualizacja współrzędnych do następnego kodu QR
            x += size[0] + qrSpacingX;
        }
    }

    addQrCodeToDocument(doc: PDFKit.PDFDocument, dataUrl: string, x: number, y: number, size: [number, number]) {
        doc.image(dataUrl, x, y, { width: size[0], height: size[1] });
    }

    addLabelsToDocument(doc: PDFKit.PDFDocument, labels: { name: string; value: string }[], x: number, y: number, width: number): number {
        // Dobór rozmiaru czcionki w zależności od rozmiaru QR
        let fontSize =10;
        switch (width) {
            case QR_SIZES[QRSize.S][0]:
                fontSize = 8;
                break;
            case QR_SIZES[QRSize.M][0]:
                fontSize = 12;
                break;
            case QR_SIZES[QRSize.L][0]:
                fontSize = 16;
                break;
            case QR_SIZES[QRSize.XL][0]:
                fontSize = 20;
                break;
            default:
                fontSize = 10;
        }

        labels.forEach(label => {
            const labelText = `${label.name}: ${label.value}`;
            const adjustedWidth = width; // Dopasowanie szerokości tekstu do szerokości QR kodu

            // Ręczne dzielenie długiego tekstu na mniejsze linie
            const words = labelText.split(' ');
            let line = '';

            words.forEach(word => {
                const testLine = line + word + ' ';
                const testLineWidth = doc.widthOfString(testLine);

                if (testLineWidth > adjustedWidth) {
                    doc.fontSize(fontSize).fillColor('black').text(line, x, y, {
                        width: adjustedWidth,
                        align: 'center'
                    });
                    y += fontSize + 5;
                    line = word + ' ';
                } else {
                    line = testLine;
                }
            });

            // Dodanie ostatniej linii
            if (line) {
                doc.fontSize(fontSize).fillColor('black').text(line, x, y, {
                    width: adjustedWidth,
                    align: 'center'
                });
                y += fontSize + 5;
            }
        });

        return y;
    }

    addNewPage(doc: PDFKit.PDFDocument) {
        doc.addPage();
    }
}