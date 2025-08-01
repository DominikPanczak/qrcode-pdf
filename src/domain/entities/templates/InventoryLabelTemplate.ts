import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';

export class InventoryLabelTemplate extends QRCodeTemplate {
    constructor() {
        const config: TemplateConfig = {
            width: 250,
            height: 100,
            qrCodeSize: { width: 80, height: 80 },
            qrCodePosition: { x: 15, y: 10 },
            labelsPosition: { x: 110, y: 10 },
            labelSpacing: 6,
            fontSize: 10,
            fontBold: false,
            backgroundColor: '#FFFFFF',
            borderColor: '#333333',
            borderWidth: 1
        };
        super(config);
    }

    getTemplateName(): string {
        return 'InventoryLabel';
    }

    validateLabels(labels: Label[]): boolean {
        const requiredLabels = this.getRequiredLabels();
        const labelNames = labels.map(label => label.name);
        
        return requiredLabels.some(required => 
            labelNames.some(name => name.toLowerCase().includes(required.toLowerCase()))
        );
    }

    getRequiredLabels(): string[] {
        return ['Kod', 'Nazwa', 'Lokalizacja'];
    }

    getOptionalLabels(): string[] {
        return ['Ilość', 'Jednostka', 'Data dodania', 'Kategoria'];
    }
} 