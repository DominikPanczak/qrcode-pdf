import { QRCodeTemplate } from '../QRCodeTemplate';
import { SampleLabelTemplate } from './SampleLabelTemplate';
import { InventoryLabelTemplate } from './InventoryLabelTemplate';
import { ProductLabelTemplate } from './ProductLabelTemplate';
import { HorizontalSmallLabelTemplate } from './HorizontalSmallLabelTemplate';
import { HorizontalMediumLabelTemplate } from './HorizontalMediumLabelTemplate';
import { HorizontalLargeLabelTemplate } from './HorizontalLargeLabelTemplate';
import { HorizontalExtraLargeLabelTemplate } from './HorizontalExtraLargeLabelTemplate';
import { VerticalMediumLabelTemplate } from './VerticalMediumLabelTemplate';
import { VerticalLargeLabelTemplate } from './VerticalLargeLabelTemplate';
import { VerticalExtraLargeLabelTemplate } from './VerticalExtraLargeLabelTemplate';
import { UniversalHorizontalTemplate } from './UniversalHorizontalTemplate';

export enum TemplateType {
    SAMPLE_LABEL = 'sample_label',
    INVENTORY_LABEL = 'inventory_label',
    PRODUCT_LABEL = 'product_label',
    HORIZONTAL_SMALL_LABEL = 'horizontal_small_label',
    HORIZONTAL_MEDIUM_LABEL = 'horizontal_medium_label',
    HORIZONTAL_LARGE_LABEL = 'horizontal_large_label',
    HORIZONTAL_EXTRA_LARGE_LABEL = 'horizontal_extra_large_label',
    VERTICAL_MEDIUM_LABEL = 'vertical_medium_label',
    VERTICAL_LARGE_LABEL = 'vertical_large_label',
    VERTICAL_EXTRA_LARGE_LABEL = 'vertical_extra_large_label',
    UNIVERSAL_HORIZONTAL = 'universal_horizontal'
}

export class TemplateFactory {
    private static templates: Map<TemplateType, QRCodeTemplate> = new Map();

    static {
        this.templates.set(TemplateType.SAMPLE_LABEL, new SampleLabelTemplate());
        this.templates.set(TemplateType.INVENTORY_LABEL, new InventoryLabelTemplate());
        this.templates.set(TemplateType.PRODUCT_LABEL, new ProductLabelTemplate());
        this.templates.set(TemplateType.HORIZONTAL_SMALL_LABEL, new HorizontalSmallLabelTemplate());
        this.templates.set(TemplateType.HORIZONTAL_MEDIUM_LABEL, new HorizontalMediumLabelTemplate());
        this.templates.set(TemplateType.HORIZONTAL_LARGE_LABEL, new HorizontalLargeLabelTemplate());
        this.templates.set(TemplateType.HORIZONTAL_EXTRA_LARGE_LABEL, new HorizontalExtraLargeLabelTemplate());
        this.templates.set(TemplateType.VERTICAL_MEDIUM_LABEL, new VerticalMediumLabelTemplate());
        this.templates.set(TemplateType.VERTICAL_LARGE_LABEL, new VerticalLargeLabelTemplate());
        this.templates.set(TemplateType.VERTICAL_EXTRA_LARGE_LABEL, new VerticalExtraLargeLabelTemplate());
        
        // Uniwersalny template z domyślną konfiguracją
        this.templates.set(TemplateType.UNIVERSAL_HORIZONTAL, new UniversalHorizontalTemplate({
            fontSize: 8,
            charWidthEstimate: 4.0,
            maxWidth: 1000,
            qrMargin: 8,
            rightMargin: 15,
            verticalSpacing: 2
        }));
    }

    static getTemplate(type: TemplateType): QRCodeTemplate {
        const template = this.templates.get(type);
        if (!template) {
            throw new Error(`Template ${type} not found`);
        }
        return template;
    }

    static getAllTemplates(): Map<TemplateType, QRCodeTemplate> {
        return new Map(this.templates);
    }

    static getAvailableTemplates(): TemplateType[] {
        return Array.from(this.templates.keys());
    }

    static getTemplateInfo(type: TemplateType): {
        name: string;
        requiredLabels: string[];
        optionalLabels: string[];
        dimensions: { width: number; height: number };
    } {
        const template = this.getTemplate(type);
        return {
            name: template.getTemplateName(),
            requiredLabels: template.getRequiredLabels(),
            optionalLabels: template.getOptionalLabels(),
            dimensions: {
                width: template.getConfig().width,
                height: template.getConfig().height
            }
        };
    }
} 