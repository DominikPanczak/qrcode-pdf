export interface SizeConfig {
    width: number;
    height: number;
    fontSize: number;
    labelSpacing: number;
    margin: number;
}

export abstract class QRCodeSize {
    protected config: SizeConfig;

    constructor(config: SizeConfig) {
        this.config = config;
    }

    abstract getSizeName(): string;
    abstract getSizeCode(): string;

    getConfig(): SizeConfig {
        return this.config;
    }

    getWidth(): number {
        return this.config.width;
    }

    getHeight(): number {
        return this.config.height;
    }

    getFontSize(): number {
        return this.config.fontSize;
    }

    getLabelSpacing(): number {
        return this.config.labelSpacing;
    }

    getMargin(): number {
        return this.config.margin;
    }

    calculateTotalHeight(labelCount: number): number {
        const labelHeight = labelCount * (this.config.fontSize + this.config.labelSpacing);
        return this.config.height + labelHeight + this.config.margin;
    }

    calculateTotalWidth(): number {
        return this.config.width + (this.config.margin * 2);
    }
} 