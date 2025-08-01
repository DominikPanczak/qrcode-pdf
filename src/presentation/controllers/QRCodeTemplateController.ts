import { QRCodeTemplateService } from '../../application/services/QRCodeTemplateService';
import { TemplateQRCodeInput, TemplatePreviewData } from '../../domain/services/IQRCodeTemplateService';
import { TemplateType } from '../../domain/entities/templates/TemplateFactory';

export class QRCodeTemplateController {
    constructor(private readonly qrCodeTemplateService: QRCodeTemplateService) {}

    async generateTemplateQRCodes(items: TemplateQRCodeInput[]): Promise<TemplatePreviewData[]> {
        return await this.qrCodeTemplateService.generateTemplateQRCodes(items);
    }

    validateTemplateLabels(templateType: TemplateType, labels: { name: string; value: string }[]): boolean {
        return this.qrCodeTemplateService.validateTemplateLabels(templateType, labels);
    }

    getTemplateInfo(templateType: TemplateType): any {
        return this.qrCodeTemplateService.getTemplateInfo(templateType);
    }

    getAvailableTemplates(): TemplateType[] {
        return this.qrCodeTemplateService.getAvailableTemplates();
    }

    async getTemplatesSummary(): Promise<{
        availableTemplates: TemplateType[];
        templatesInfo: { [key: string]: any };
    }> {
        const availableTemplates = this.getAvailableTemplates();
        const templatesInfo: { [key: string]: any } = {};

        for (const templateType of availableTemplates) {
            templatesInfo[templateType] = this.getTemplateInfo(templateType);
        }

        return {
            availableTemplates,
            templatesInfo
        };
    }
} 