import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';

export class SampleLabelTemplate extends QRCodeTemplate {
    constructor() {
        const config: TemplateConfig = {
            width: 300,
            height: 150,
            qrCodeSize: { width: 120, height: 120 },
            qrCodePosition: { x: 20, y: 15 },
            labelsPosition: { x: 160, y: 15 },
            labelSpacing: 8,
            fontSize: 12,
            fontBold: false,
            backgroundColor: '#FFFFFF',
            borderColor: '#000000',
            borderWidth: 1
        };
        super(config);
    }

    getTemplateName(): string {
        return 'SampleLabel';
    }

    validateLabels(labels: Label[]): boolean {
        const requiredLabels = this.getRequiredLabels();
        const labelNames = labels.map(label => label.name);
        
        return requiredLabels.every(required => 
            labelNames.some(name => name.toLowerCase().includes(required.toLowerCase()))
        );
    }

    getRequiredLabels(): string[] {
        return ['Próbka', 'LOT', 'GTIN'];
    }

    getOptionalLabels(): string[] {
        return ['Data ważności', 'Data produkcji', 'Kod kreskowy', 'Opis'];
    }

    // Specjalna metoda dla tego szablonu - formatowanie etykiet
    formatLabels(labels: Label[]): Label[] {
        return labels.map(label => {
            // Dodaj dwukropek jeśli nie ma
            if (!label.name.endsWith(':')) {
                label.name = label.name + ':';
            }
            return label;
        });
    }
} 