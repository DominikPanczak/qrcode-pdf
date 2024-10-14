import { QRSize } from "../src/enum/qrSizes.enum";
import { QrGenerator } from "../src/services";

describe('QrGenerator', () => {
  it('should generate QR codes without errors', async () => {
    const items = [
      { value: '12345', labels: [{ name: 'Numer próbki', value: '12345' }], size: QRSize.M }
    ];

    const qrGenerator = new QrGenerator(items);
    const qrCodes = await qrGenerator.generateQrCodes();

    expect(qrCodes.length).toBe(1);
    expect(qrCodes[0].value).toBeDefined();
  });

  it('should generate correct QR code', async () => {
    const items = [
      { value: '67890', labels: [{ name: 'Numer próbki', value: '67890' }], size: QRSize.S }
    ];

    const qrGenerator = new QrGenerator(items);
    const qrCodes = await qrGenerator.generateQrCodes();

    expect(qrCodes[0].value.startsWith('data:image/png;base64,')).toBeTruthy();
  });
});