import { IQRCodeTemplateService, TemplateQRCodeInput, TemplatePreviewData } from '../../domain/services/IQRCodeTemplateService';
import { TemplateType, TemplateFactory } from '../../domain/entities/templates/TemplateFactory';
import { QRCodeTemplate } from '../../domain/entities/QRCodeTemplate';
import { QRCode } from '../../domain/entities/QRCode';
import { IQRCodeRepository } from '../../domain/repositories/IQRCodeRepository';

export class QRCodeTemplateService implements IQRCodeTemplateService {
    constructor(private readonly qrCodeRepository: IQRCodeRepository) {}

    async generateTemplateQRCodes(items: TemplateQRCodeInput[]): Promise<TemplatePreviewData[]> {
        try {
            const templateData: TemplatePreviewData[] = [];
            let currentX = 20;
            let currentY = 20;
            let currentPage = 1;
            const pageWidth = 595.28; // A4 width
            const pageHeight = 841.89; // A4 height

            for (const item of items) {
                const template = TemplateFactory.getTemplate(item.templateType);
                
                // Walidacja etykiet
                if (!template.validateLabels(item.labels)) {
                    console.warn(`Template ${item.templateType} validation failed for item: ${item.value}`);
                }

                // Generowanie kodu QR
                const qrCodeDataUrl = await this.qrCodeRepository.generateQRCode(
                    item.value, 
                    template.getConfig().qrCodeSize
                );

                // Formatowanie etykiet przez template jeśli ma taką metodę
                const formattedLabels = template.formatLabels ? template.formatLabels(item.labels) : item.labels;
                
                // Sprawdzenie czy zmieści się na stronie
                const templateWidth = template.calculateTotalWidth();
                const mockQRCode = QRCode.create(
                    qrCodeDataUrl,
                    formattedLabels,
                    template.getConfig().qrCodeSize,
                    template,
                    item.showCuttingMarks
                );
                const templateHeight = template.calculateTotalHeight(mockQRCode);

                if (currentX + templateWidth > pageWidth - 40) {
                    currentX = 20;
                    currentY += templateHeight + 20;
                }

                if (currentY + templateHeight > pageHeight - 40) {
                    currentPage++;
                    currentX = 20;
                    currentY = 20;
                }

                templateData.push({
                    template,
                    qrCode: QRCode.create(
                        qrCodeDataUrl,
                        formattedLabels,
                        template.getConfig().qrCodeSize,
                        template,
                        item.showCuttingMarks
                    ),
                    position: {
                        x: currentX,
                        y: currentY,
                        page: currentPage
                    },
                    dimensions: {
                        width: templateWidth,
                        height: templateHeight
                    }
                });

                currentX += templateWidth + 20;
            }

            return templateData;
        } catch (error) {
            console.error('Błąd podczas generowania kodów QR z szablonami:', error);
            throw error;
        }
    }

    validateTemplateLabels(templateType: TemplateType, labels: { name: string; value: string }[]): boolean {
        const template = TemplateFactory.getTemplate(templateType);
        return template.validateLabels(labels);
    }

    getTemplateInfo(templateType: TemplateType): any {
        return TemplateFactory.getTemplateInfo(templateType);
    }

    getAvailableTemplates(): TemplateType[] {
        return TemplateFactory.getAvailableTemplates();
    }
} 