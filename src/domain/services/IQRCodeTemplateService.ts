import { QRCodeInput } from './IQRCodeService';
import { TemplateType } from '../entities/templates/TemplateFactory';
import { QRCodeTemplate } from '../entities/QRCodeTemplate';

export interface TemplateQRCodeInput extends QRCodeInput {
    templateType: TemplateType;
    showCuttingMarks?: boolean; // Opcjonalna flaga do pokazywania znaczników cięcia
}

export interface TemplatePreviewData {
    template: QRCodeTemplate;
    qrCode: any;
    position: {
        x: number;
        y: number;
        page: number;
    };
    dimensions: {
        width: number;
        height: number;
    };
}

export interface IQRCodeTemplateService {
    generateTemplateQRCodes(items: TemplateQRCodeInput[]): Promise<TemplatePreviewData[]>;
    validateTemplateLabels(templateType: TemplateType, labels: { name: string; value: string }[]): boolean;
    getTemplateInfo(templateType: TemplateType): any;
    getAvailableTemplates(): TemplateType[];
} 