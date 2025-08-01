import {QRCodeData} from "../interface/qrItem.interface";
import PDFDocument from "pdfkit";
import {QRCodeSize, QR_CODE_DIMENSIONS_WITH_DEFAULT as QR_CODE_DIMENSIONS} from "../domain/value-objects/QRCodeSizes";

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
        const sortedQrCodes = this.qrCodes.sort((a, b) => a.size.width - b.size.width);

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
            if (x + size.width > maxRowWidth) {
                x = pageMargin;
                y += maxRowHeight + qrSpacingY;
                maxRowHeight = 0;
            }

            if (y + size.height + labels.length * 20 + 20 > doc.page.height) {
                this.addNewPage(doc);
                x = pageMargin;
                y = pageMargin;
                maxRowHeight = 0;
            }

            // Dodawanie kodu QR do PDF
            this.addQrCodeToDocument(doc, value, x, y, size);

            // Dodanie etykiet poniżej kodu QR
            const labelY = y + size.height + 5;
            const updatedY = this.addLabelsToDocument(doc, labels, x, labelY, size.width);

            // Aktualizacja maksymalnej wysokości wiersza
            const totalHeight = updatedY - y;
            if (totalHeight > maxRowHeight) {
                maxRowHeight = totalHeight;
            }

            // Aktualizacja współrzędnych do następnego kodu QR
            x += size.width + qrSpacingX;
        }
    }

    addQrCodeToDocument(doc: PDFKit.PDFDocument, dataUrl: string, x: number, y: number, size: { width: number; height: number }) {
        doc.image(dataUrl, x, y, { width: size.width, height: size.height });
    }

    addLabelsToDocument(doc: PDFKit.PDFDocument, labels: { name: string; value: string }[], x: number, y: number, width: number): number {
        // Dobór rozmiaru czcionki w zależności od rozmiaru QR
        let fontSize = 10;
        switch (width) {
            case QR_CODE_DIMENSIONS[QRCodeSize.SMALL].width:
                fontSize = 6;
                break;
            case QR_CODE_DIMENSIONS[QRCodeSize.MEDIUM].width:
                fontSize = 8;
                break;
            case QR_CODE_DIMENSIONS[QRCodeSize.LARGE].width:
                fontSize = 12;
                break;
            case QR_CODE_DIMENSIONS[QRCodeSize.EXTRA_LARGE].width:
                fontSize = 16;
                break;
            default:
                fontSize = 8;
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