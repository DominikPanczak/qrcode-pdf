import * as fs from 'fs';
import * as path from 'path';

export class TestFileManager {
    private static readonly TEST_DIR = './test';

    static ensureTestDirectory(): string {
        if (!fs.existsSync(this.TEST_DIR)) {
            fs.mkdirSync(this.TEST_DIR, { recursive: true });
        }
        return this.TEST_DIR;
    }

    static getTestFilePath(filename: string): string {
        const testDir = this.ensureTestDirectory();
        return path.join(testDir, filename);
    }

    static writeTestFile(filename: string, content: Buffer | string): void {
        const filePath = this.getTestFilePath(filename);
        fs.writeFileSync(filePath, content);
        console.log(`Plik zapisany: ${filePath}`);
    }

    static writePDF(filename: string, pdfBuffer: Buffer): void {
        this.writeTestFile(filename, pdfBuffer);
    }

    static writeJSON(filename: string, jsonData: any): void {
        const jsonString = JSON.stringify(jsonData, null, 2);
        this.writeTestFile(filename, jsonString);
    }

    static cleanTestDirectory(): void {
        if (fs.existsSync(this.TEST_DIR)) {
            const files = fs.readdirSync(this.TEST_DIR);
            files.forEach(file => {
                const filePath = path.join(this.TEST_DIR, file);
                fs.unlinkSync(filePath);
            });
            console.log('Katalog testowy wyczyszczony');
        }
    }

    static getTestDirectory(): string {
        return this.TEST_DIR;
    }
} 