import {QRSize} from "../enum/qrSizes.enum";

export interface QRItem {
    value: string;
    labels: {name: string, value:string}[];
    size: QRSize;
}

export interface QRCodeData {
    value: string;
    labels: {name: string, value:string}[];
    size: [number, number];
}
