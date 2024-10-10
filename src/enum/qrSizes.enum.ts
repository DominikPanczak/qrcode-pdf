export enum QRSize {
    S = 's',
    M = 'm',
    L= 'l',
    XL = 'xl',
    DEFAULT = 'default'
}

export const QR_SIZES: Record<QRSize, [number, number]> = {
    [QRSize.S] : [100,100],
    [QRSize.M] : [150,150],
    [QRSize.L] : [200,200],
    [QRSize.XL] : [400,400],
    [QRSize.DEFAULT] : [150,150]
}