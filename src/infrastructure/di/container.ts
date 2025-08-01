import { QRCodeService } from '../../application/services/QRCodeService';
import { QRCodePreviewService } from '../../application/services/QRCodePreviewService';
import { QRCodeTemplateService } from '../../application/services/QRCodeTemplateService';
import { QRCodeSizeService } from '../../application/services/QRCodeSizeService';
import { QRCodeRepository } from '../repositories/QRCodeRepository';
import { QRCodeAdapter } from '../adapters/QRCodeAdapter';
import { PDFAdapter } from '../adapters/PDFAdapter';

export class Container {
    private static instance: Container;
    private services: Map<string, any> = new Map();

    private constructor() {
        this.registerServices();
    }

    static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    private registerServices(): void {
        // Adapters
        this.services.set('QRCodeAdapter', new QRCodeAdapter());
        this.services.set('PDFAdapter', new PDFAdapter());

        // Repository
        this.services.set('QRCodeRepository', new QRCodeRepository(
            this.services.get('QRCodeAdapter'),
            this.services.get('PDFAdapter')
        ));

        // Services
        this.services.set('QRCodeService', new QRCodeService(
            this.services.get('QRCodeRepository')
        ));
        
        this.services.set('QRCodePreviewService', new QRCodePreviewService(
            this.services.get('QRCodeRepository')
        ));

        this.services.set('QRCodeTemplateService', new QRCodeTemplateService(
            this.services.get('QRCodeRepository')
        ));

        this.services.set('QRCodeSizeService', new QRCodeSizeService(
            this.services.get('QRCodeRepository')
        ));
    }

    get<T>(serviceName: string): T {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service ${serviceName} not found`);
        }
        return service;
    }
} 