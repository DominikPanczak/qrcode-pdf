import { QRCodeSize } from "../src/domain/value-objects/QRCodeSizes";
import { QrGenerator } from "../src/services";

describe('QrGenerator', () => {
  it('should generate QR codes without errors', async () => {
    const items = [
      { value: '12345', labels: [{ name: 'Numer próbki', value: '12345' }], size: QRCodeSize.MEDIUM }
    ];

    const qrGenerator = new QrGenerator(items);
    const qrCodes = await qrGenerator.generateQrCodes();

    expect(qrCodes.length).toBe(1);
    expect(qrCodes[0].value).toBeDefined();
  });

  it('should generate correct QR code', async () => {
    const items = [
      { value: '67890', labels: [{ name: 'Numer próbki', value: '67890' }], size: QRCodeSize.SMALL }
    ];

    const qrGenerator = new QrGenerator(items);
    const qrCodes = await qrGenerator.generateQrCodes();

    expect(qrCodes[0].value.startsWith('data:image/png;base64,')).toBeTruthy();
  });
});