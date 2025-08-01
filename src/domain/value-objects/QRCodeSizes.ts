/**
 * Ujednolicony system rozmiarów kodów QR
 * Zastępuje QRCodeSizeEnum, QRSize i częściowo SizeType
 */
export enum QRCodeSize {
    SMALL = 'S',
    MEDIUM = 'M', 
    LARGE = 'L',
    EXTRA_LARGE = 'XL',
    DEFAULT = 'M'
}

/**
 * Podstawowe wymiary dla każdego rozmiaru
 */
const baseDimensions = {
    [QRCodeSize.SMALL]: { width: 32, height: 32 },
    [QRCodeSize.MEDIUM]: { width: 80, height: 80 },
    [QRCodeSize.LARGE]: { width: 150, height: 150 },
    [QRCodeSize.EXTRA_LARGE]: { width: 200, height: 200 }
};

export const QR_CODE_DIMENSIONS: Record<QRCodeSize, { width: number; height: number }> = {
    ...baseDimensions,
    [QRCodeSize.DEFAULT]: baseDimensions[QRCodeSize.MEDIUM]
};

// Alias dla kompatybilności wstecznej
export const QR_CODE_DIMENSIONS_WITH_DEFAULT = QR_CODE_DIMENSIONS;

/**
 * Pełne konfiguracje rozmiarów z dodatkowymi właściwościami
 */
export interface QRCodeSizeConfig {
    width: number;
    height: number;
    fontSize: number;
    labelSpacing: number;
    margin: number;
    maxLabels: number;
}

const baseConfigs = {
    [QRCodeSize.SMALL]: {
        width: 32,
        height: 32,
        fontSize: 6,
        labelSpacing: 3,
        margin: 5,
        maxLabels: 3
    },
    [QRCodeSize.MEDIUM]: {
        width: 80,
        height: 80,
        fontSize: 8,
        labelSpacing: 5,
        margin: 8,
        maxLabels: 5
    },
    [QRCodeSize.LARGE]: {
        width: 150,
        height: 150,
        fontSize: 12,
        labelSpacing: 8,
        margin: 10,
        maxLabels: 8
    },
    [QRCodeSize.EXTRA_LARGE]: {
        width: 200,
        height: 200,
        fontSize: 16,
        labelSpacing: 10,
        margin: 15,
        maxLabels: 12
    }
};

export const QR_CODE_CONFIGS: Record<QRCodeSize, QRCodeSizeConfig> = {
    ...baseConfigs,
    [QRCodeSize.DEFAULT]: baseConfigs[QRCodeSize.MEDIUM]
};

// Alias dla kompatybilności wstecznej
export const QR_CODE_CONFIGS_WITH_DEFAULT = QR_CODE_CONFIGS;

/**
 * Mapowanie między starymi wartościami a nowymi dla kompatybilności wstecznej
 */
export const LEGACY_SIZE_MAPPING = {
    's': QRCodeSize.SMALL,
    'm': QRCodeSize.MEDIUM,
    'l': QRCodeSize.LARGE,
    'xl': QRCodeSize.EXTRA_LARGE,
    'default': QRCodeSize.DEFAULT
} as const;

/**
 * Pomocnicze funkcje
 */
export class QRCodeSizeHelper {
    static getDimensions(size: QRCodeSize): { width: number; height: number } {
        return QR_CODE_DIMENSIONS[size];
    }

    static getConfig(size: QRCodeSize): QRCodeSizeConfig {
        return QR_CODE_CONFIGS[size];
    }

    static fromLegacyString(legacySize: string): QRCodeSize {
        const mapped = LEGACY_SIZE_MAPPING[legacySize.toLowerCase() as keyof typeof LEGACY_SIZE_MAPPING];
        return mapped || QRCodeSize.DEFAULT;
    }

    static getAllSizes(): QRCodeSize[] {
        return [
            QRCodeSize.SMALL,
            QRCodeSize.MEDIUM,
            QRCodeSize.LARGE,
            QRCodeSize.EXTRA_LARGE
        ];
    }

    static validateSize(size: string): size is QRCodeSize {
        return Object.values(QRCodeSize).includes(size as QRCodeSize);
    }
}