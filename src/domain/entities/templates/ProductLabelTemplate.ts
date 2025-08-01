import { QRCodeTemplate, TemplateConfig } from '../QRCodeTemplate';
import { Label } from '../QRCode';

export class ProductLabelTemplate extends QRCodeTemplate {
    constructor() {
        const config: TemplateConfig = {
            width: 350,
            height: 120,
            qrCodeSize: { width: 100, height: 100 },
            qrCodePosition: { x: 20, y: 10 },
            labelsPosition: { x: 140, y: 10 },
            labelSpacing: 10,
            fontSize: 11,
            fontBold: true,
            backgroundColor: '#FFFFFF',
            borderColor: '#000000',
            borderWidth: 2
        };
        super(config);
    }

    getTemplateName(): string {
        return 'ProductLabel';
    }

    validateLabels(labels: Label[]): boolean {
        const requiredLabels = this.getRequiredLabels();
        const labelNames = labels.map(label => label.name);
        
        return requiredLabels.every(required => 
            labelNames.some(name => name.toLowerCase().includes(required.toLowerCase()))
        );
    }

    getRequiredLabels(): string[] {
        return ['Produkt', 'Cena', 'SKU'];
    }

    getOptionalLabels(): string[] {
        return ['Opis', 'Kategoria', 'Marka', 'Waga', 'Wymiary'];
    }
} 