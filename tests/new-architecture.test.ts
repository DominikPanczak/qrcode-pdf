import { QRCodeFacade, QRCodeInput, QRCodeSize, QRCode } from '../src/index';
import { Container } from '../src/infrastructure/di/container';
import { QRCodeService } from '../src/application/services/QRCodeService';

describe('New Architecture Tests', () => {
    it('should generate QR codes using facade', async () => {
        const items: QRCodeInput[] = [
            { 
                value: '12345', 
                labels: [{ name: 'Numer próbki', value: '12345' }], 
                size: QRCodeSize.MEDIUM 
            }
        ];

        const qrCodes = await QRCodeFacade.generateQRCodes(items);

        expect(qrCodes.length).toBe(1);
        expect(qrCodes[0]).toBeInstanceOf(QRCode);
        expect(qrCodes[0].value.startsWith('data:image/png;base64,')).toBeTruthy();
    });

    it('should generate PDF using facade', async () => {
        const items: QRCodeInput[] = [
            { 
                value: '67890', 
                labels: [{ name: 'Numer próbki', value: '67890' }], 
                size: QRCodeSize.SMALL 
            }
        ];

        const result = await QRCodeFacade.generateQRCodesAndPDF(items);

        expect(result.qrCodes.length).toBe(1);
        expect(result.pdfBuffer).toBeInstanceOf(Buffer);
        expect(result.pdfBuffer.length).toBeGreaterThan(0);
    });

    it('should use dependency injection correctly', () => {
        const container = Container.getInstance();
        const service = container.get<QRCodeService>('QRCodeService');

        expect(service).toBeInstanceOf(QRCodeService);
    });

    it('should handle multiple QR codes correctly', async () => {
        const items: QRCodeInput[] = [
            { 
                value: 'QR1', 
                labels: [{ name: 'Test', value: 'Value1' }], 
                size: QRCodeSize.SMALL 
            },
            { 
                value: 'QR2', 
                labels: [{ name: 'Test', value: 'Value2' }], 
                size: QRCodeSize.LARGE 
            }
        ];

        const qrCodes = await QRCodeFacade.generateQRCodes(items);

        expect(qrCodes.length).toBe(2);
        expect(qrCodes[0].size.width).toBeLessThan(qrCodes[1].size.width); // Sorted by size
    });
}); 