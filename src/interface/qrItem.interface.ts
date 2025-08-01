import { QRCodeSize } from "../domain/value-objects/QRCodeSizes";

export interface QRItem {
    value: string;
    labels: {name: string, value:string}[];
    size: QRCodeSize;
}

export interface QRCodeData {
    value: string;
    labels: {name: string, value:string}[];
    size: { width: number; height: number };
}
