import PDFDocument from 'pdfkit';
import { QRCode } from '../../domain/entities/QRCode';

export class PDFAdapter {
    async generatePDF(qrCodes: QRCode[]): Promise<Buffer> {
        try {
            console.log('Rozpoczynam generowanie PDF...');
            const doc = new PDFDocument({ margin: 20 });
            const chunks: Buffer[] = [];

            return await new Promise((resolve, reject) => {
                this.setupDocumentListeners(doc, chunks, resolve, reject);
                this.addQrCodesToDocument(doc, qrCodes);
                doc.end();
            });
        } catch (error) {
            console.error('Błąd podczas generowania PDF:', error);
            throw error;
        }
    }

    private setupDocumentListeners(
        doc: PDFKit.PDFDocument, 
        chunks: Buffer[], 
        resolve: (value: Buffer | PromiseLike<Buffer>) => void, 
        reject: (reason?: any) => void
    ) {
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

    private addQrCodesToDocument(doc: PDFKit.PDFDocument, qrCodes: QRCode[]) {
        // Sortowanie QR kodów według rozmiaru
        const sortedQrCodes = qrCodes.sort((a, b) => a.size.width - b.size.width);

        // Ustawienia układu strony
        const pageMargin = 20;
        const qrSpacingX = 10; // Podstawowy odstęp między etykietami (margines linii cięcia jest dodawany osobno)
        const qrSpacingY = 10; // Zmniejszony odstęp pionowy między etykietami
        const maxRowWidth = doc.page.width - 2 * pageMargin;
        let x = pageMargin;
        let y = pageMargin;
        let maxRowHeight = 0;

        for (const qrCode of sortedQrCodes) {
            const { value, labels, size, template } = qrCode;
            
            // Sprawdzenie, czy zmieści się na bieżącej stronie - PRZED rysowaniem
            // Obliczamy rzeczywistą szerokość z uwzględnieniem marginesów linii cięcia
            let effectiveWidth = size.width;
            const rightCuttingMargin = 20; // Margines dla linii cięcia
            
            if (template && template.getTemplateName) {
                const templateName = template.getTemplateName();
                if (templateName === 'Horizontal Small Label' || 
                    templateName.startsWith('Horizontal') || 
                    templateName.startsWith('Vertical')) {
                    const templateWithConfig = template as any;
                    if (templateWithConfig.getConfigForLabels) {
                        effectiveWidth = templateWithConfig.getConfigForLabels(labels, size).width;
                        // Dodajemy margines linii cięcia jeśli są włączone
                        if (qrCode.showCuttingMarks) {
                            effectiveWidth += rightCuttingMargin;
                        }
                    } else if (template.getConfig) {
                        effectiveWidth = template.getConfig().width;
                        if (qrCode.showCuttingMarks) {
                            effectiveWidth += rightCuttingMargin;
                        }
                    }
                } else if (template.getConfig) {
                    effectiveWidth = template.getConfig().width;
                }
            }
            
            if (x + effectiveWidth > maxRowWidth) {
                x = pageMargin;
                y += maxRowHeight + qrSpacingY;
                maxRowHeight = 0;
            }
            
            console.log('DEBUG QRCode:', {
                labels,
                size,
                hasTemplate: !!template,
                templateName: template && template.getTemplateName ? template.getTemplateName() : undefined,
                templateConfig: template && template.getTemplateName && template.getTemplateName() === 'Horizontal Small Label' 
                    ? (template as any).getConfigForLabels ? (template as any).getConfigForLabels(labels, size) : template.getConfig()
                    : template && template.getConfig ? template.getConfig() : undefined,
                showCuttingMarks: qrCode.showCuttingMarks,
                actualPosition: { x, y },
                maxRowHeight,
                getTotalHeight: qrCode.getTotalHeight(),
                effectiveWidth,
                maxRowWidth
            });

            if (y + qrCode.getTotalHeight() > doc.page.height) {
                this.addNewPage(doc);
                x = pageMargin;
                y = pageMargin;
                maxRowHeight = 0;
            }



            // Margines wokół zawartości
            const contentMargin = 5;
            const contentX = x + contentMargin;
            const contentY = y + contentMargin;
            
            // Dodawanie kodu QR do PDF (z marginesem)
            this.addQrCodeToDocument(doc, value, contentX, contentY, size);

            // Rysowanie etykiet z wykorzystaniem konfiguracji szablonu
            let updatedY;
            if (template && template.getTemplateName) {
                const templateName = template.getTemplateName();
                const horizontalTemplate = template as any;
                const cfg = horizontalTemplate.getConfigForLabels ? horizontalTemplate.getConfigForLabels(labels, size) : template.getConfig();
                
                if (templateName.startsWith('Horizontal')) {
                    // Szablony poziome - etykiety po prawej stronie kodu QR
                    // Obliczamy dostępną szerokość uwzględniając ograniczenia strony
                    const labelsStartX = cfg.labelsPosition?.x ?? size.width + 4;
                    const maxAvailableWidth = maxRowWidth - x - labelsStartX - 2 * contentMargin;
                    const templateAvailableWidth = cfg.width - labelsStartX - 2 * contentMargin;
                    
                    // Używamy mniejszej z dwóch szerokości (ograniczenia strony vs szablon)
                    const availableWidth = Math.min(maxAvailableWidth, templateAvailableWidth);
                    
                    updatedY = this.addLabelsToDocument(
                        doc,
                        labels,
                        contentX + labelsStartX,
                        contentY + (cfg.labelsPosition?.y ?? 0),
                        Math.max(100, availableWidth), // minimum 100px dla czytelności
                        cfg.fontSize ?? 8,
                        false, // left align
                        templateName === 'Horizontal Small Label' // noWrap tylko dla small
                    );
                } else if (templateName.startsWith('Vertical')) {
                    // Szablony pionowe - etykiety poniżej kodu QR
                    const availableWidth = cfg.width - 2 * (cfg.labelsPosition?.x ?? 10); // szerokość szablonu minus marginesy
                    updatedY = this.addLabelsToDocument(
                        doc,
                        labels,
                        contentX + (cfg.labelsPosition?.x ?? 10),
                        contentY + (cfg.labelsPosition?.y ?? size.height + 20),
                        availableWidth,
                        cfg.fontSize ?? 8,
                        true, // center align dla vertical
                        false // wrap enabled
                    );
                } else {
                    // Inne szablony - domyślna logika
                    const labelY = contentY + size.height + 5;
                    updatedY = this.addLabelsToDocument(doc, labels, contentX, labelY, cfg.width ?? size.width);
                }
            } else {
                // Brak szablonu - domyślna logika
                const labelY = contentY + size.height + 5;
                updatedY = this.addLabelsToDocument(doc, labels, contentX, labelY, size.width);
            }
            
            // Obliczenie rzeczywistej wysokości zawartości
            const actualContentHeight = Math.max(
                size.height + 2 * contentMargin, // QR kod + marginesy
                updatedY - y // Wysokość do końca tekstu
            );

            // Rysowanie znaczników cięcia TYLKO gdy są włączone
            console.log('DEBUG Cutting marks check:', {
                hasTemplate: !!template,
                showCuttingMarks: qrCode.showCuttingMarks,
                shouldDraw: !!(template && qrCode.showCuttingMarks),
                actualContentHeight
            });
            
            if (template && qrCode.showCuttingMarks) {
                const horizontalTemplate = template as any;
                const cfg = horizontalTemplate.getConfigForLabels ? horizontalTemplate.getConfigForLabels(labels, size) : template.getConfig();
                if (cfg.borderColor && cfg.borderWidth && cfg.borderStyle === 'corner-marks') {
                    doc.save();
                    doc.lineWidth(cfg.borderWidth);
                    doc.strokeColor(cfg.borderColor);
                    
                    const markSize = 4; // Rozmiar znacznika
                    
                    // Znaczniki cięcia na krawędziach rzeczywistej zawartości
                    const borderX = x;
                    const borderY = y;
                    const rightMargin = 20; // Zwiększony margines po prawej stronie
                    
                    // Szerokość znaczników cięcia: cała szerokość template + margines po prawej
                    const borderWidth = cfg.width + rightMargin;
                    const borderHeight = actualContentHeight; // Używamy rzeczywistej wysokości!
                    
                    // Lewy górny narożnik
                    doc.moveTo(borderX, borderY + markSize).lineTo(borderX, borderY).lineTo(borderX + markSize, borderY);
                    
                    // Prawy górny narożnik  
                    doc.moveTo(borderX + borderWidth - markSize, borderY).lineTo(borderX + borderWidth, borderY).lineTo(borderX + borderWidth, borderY + markSize);
                    
                    // Prawy dolny narożnik
                    doc.moveTo(borderX + borderWidth, borderY + borderHeight - markSize).lineTo(borderX + borderWidth, borderY + borderHeight).lineTo(borderX + borderWidth - markSize, borderY + borderHeight);
                    
                    // Lewy dolny narożnik
                    doc.moveTo(borderX + markSize, borderY + borderHeight).lineTo(borderX, borderY + borderHeight).lineTo(borderX, borderY + borderHeight - markSize);
                    
                    doc.stroke();
                    doc.restore();
                }
            }

            // Aktualizacja maksymalnej wysokości wiersza - używamy wysokości template'a
            const templateHeight = qrCode.getTotalHeight();
            if (templateHeight > maxRowHeight) {
                maxRowHeight = templateHeight;
            }

            // Aktualizacja współrzędnych do następnego kodu QR
            x += effectiveWidth + qrSpacingX;
        }
    }

    private addQrCodeToDocument(doc: PDFKit.PDFDocument, dataUrl: string, x: number, y: number, size: { width: number; height: number }) {
        doc.image(dataUrl, x, y, { width: size.width, height: size.height });
    }

    private addLabelsToDocument(
        doc: PDFKit.PDFDocument, 
        labels: { name: string; value: string }[], 
        x: number, 
        y: number, 
        width: number,
        fontSizeOverride?: number,
        centerAlign: boolean = true,
        noWrap: boolean = false // Nowy parametr - bez zawijania tekstu
    ): number {
        // Dobór rozmiaru czcionki w zależności od rozmiaru QR lub override
        let fontSize = fontSizeOverride ?? 10;
        if (!fontSizeOverride) {
            if (width <= 80) fontSize = 6;
            else if (width <= 150) fontSize = 12;
            else if (width <= 200) fontSize = 16;
            else fontSize = 20;
        }

        labels.forEach(label => {
            const labelText = label.value;
            const adjustedWidth = width;

            if (noWrap) {
                // Tryb bez zawijania - każda etykieta w jednej linii
                // Najprostsze rozwiązanie - podstawowy text() bez opcji
                doc.fontSize(fontSize).fillColor('black').text(labelText, x, y, {
                    align: 'left'
                });
                y += fontSize + 2;
            } else {
                // Standardowy tryb z zawijaniem tekstu
                // Ręczne dzielenie długiego tekstu na mniejsze linie
                const words = labelText.split(' ');
                let line = '';

                words.forEach(word => {
                    const testLine = line + word + ' ';
                    const testLineWidth = doc.widthOfString(testLine);

                    if (testLineWidth > adjustedWidth) {
                        doc.fontSize(fontSize).fillColor('black').text(line, x, y, {
                            width: adjustedWidth,
                            align: 'left' // Zawsze wyrównanie do lewej
                        });
                        y += fontSize + 2;
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                });

                // Dodanie ostatniej linii
                if (line) {
                    doc.fontSize(fontSize).fillColor('black').text(line, x, y, {
                        width: adjustedWidth,
                                                    align: 'left' // Zawsze wyrównanie do lewej
                    });
                    y += fontSize + 2;
                }
            }
        });

        return y;
    }

    private addNewPage(doc: PDFKit.PDFDocument) {
        doc.addPage();
    }
} 