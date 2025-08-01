# 🏷️ QR Code PDF Generator

Zaawansowany generator kodów QR i plików PDF dla Node.js z architekturą warstwową i systemem szablonów.

## 📋 Spis treści

- [Funkcjonalności](#-funkcjonalności)
- [Architektura](#-architektura)
- [Instalacja](#-instalacja)
- [Szybki start](#-szybki-start)
- [Użycie](#-użycie)
- [Szablony](#-szablony)
- [Rozmiary kodów QR](#-rozmiary-kodów-qr)
- [Testowanie](#-testowanie)
- [API Reference](#-api-reference)
- [Przykłady](#-przykłady)
- [Rozwiązywanie problemów](#-rozwiązywanie-problemów)
- [Licencja](#-licencja)

## ✨ Funkcjonalności

### 🎯 Główne możliwości
- **Generowanie kodów QR** - Tworzenie kodów QR z dowolnymi danymi
- **Eksport do PDF** - Automatyczne układanie kodów QR w dokumentach PDF
- **System etykiet** - Dodawanie opisowych etykiet do kodów QR
- **Podgląd przed drukiem** - Wizualizacja układu przed generowaniem PDF
- **Walidacja danych** - Sprawdzanie poprawności etykiet i rozmiarów

### 🏗️ Architektura
- **Onion Architecture** - Architektura warstwowa w stylu cebuli
- **Dependency Injection** - Loose coupling i łatwe testowanie
- **Adapter Pattern** - Izolacja zewnętrznych bibliotek
- **Template System** - System szablonów dla różnych typów etykiet
- **Size Classes** - Klasy rozmiarów z walidacją

### 📊 Rozmiary kodów QR
| Rozmiar | Wymiary | Max etykiet | Czcionka | Użycie |
|---------|---------|-------------|----------|---------|
| **S** | 80×80px | 3 | 6px | Kompaktowe etykiety |
| **M** | 150×150px | 5 | 12px | Standardowe etykiety |
| **L** | 200×200px | 8 | 16px | Szczegółowe etykiety |
| **XL** | 400×400px | 12 | 20px | Pełne opisy |

## 🏗️ Architektura

Projekt wykorzystuje architekturę warstwową (Onion Architecture) z następującymi warstwami:

```
src/
├── domain/                    # Warstwa domenowa (rdzeń)
│   ├── entities/             # Encje domenowe
│   ├── value-objects/        # Obiekty wartości
│   ├── repositories/         # Interfejsy repozytoriów
│   └── services/            # Interfejsy serwisów
├── application/              # Warstwa aplikacyjna
│   └── services/            # Serwisy aplikacyjne
├── infrastructure/           # Warstwa infrastruktury
│   ├── adapters/            # Adaptery dla zewnętrznych bibliotek
│   ├── repositories/        # Implementacje repozytoriów
│   └── di/                 # Dependency Injection
└── presentation/            # Warstwa prezentacji
    └── controllers/         # Kontrolery
```

### 🔄 Zasady architektury
1. **Dependency Inversion** - Warstwy zewnętrzne zależą od abstrakcji warstw wewnętrznych
2. **Separation of Concerns** - Każda warstwa ma określoną odpowiedzialność
3. **Adapter Pattern** - Adaptery izolują zewnętrzne biblioteki
4. **Dependency Injection** - Łatwe testowanie i wymiana implementacji

## 🚀 Instalacja

### Wymagania
- Node.js (wersja 14 lub nowsza)
- npm lub yarn

### Instalacja zależności
```bash
npm install
```

### Zależności
- `qrcode` - Generowanie kodów QR
- `pdfkit` - Generowanie plików PDF
- `@types/node` - Definicje typów dla Node.js
- `jest` - Framework testowy
- `ts-jest` - Obsługa TypeScript w testach

## ⚡ Szybki start

### Podstawowe użycie
```typescript
import { QRCodeFacade, QRCodeInput, QRCodeSizeEnum } from './src/index';

const items: QRCodeInput[] = [
    {
        value: 'https://example.com',
        labels: [
            { name: 'URL', value: 'https://example.com' },
            { name: 'Data', value: new Date().toISOString() }
        ],
        size: QRCodeSizeEnum.M
    }
];

const result = await QRCodeFacade.generateQRCodesAndPDF(items);
```

### Uruchomienie przykładowego kodu
```bash
npm start                    # Nowa architektura
npm run start:old           # Stara architektura
npm run preview             # Funkcjonalność podglądu
npm run templates           # System szablonów
npm run sizes               # Klasy rozmiarów
```

## 📖 Użycie

### Sposób 1: Facade (zalecane)
```typescript
import { QRCodeFacade, QRCodeInput, QRCodeSizeEnum } from './src/index';

const items: QRCodeInput[] = [
    {
        value: 'http://www.wp.pl',
        labels: [
            { name: 'Numer próbki', value: '10-08-2024/1009282/01/02' },
            { name: 'Notatka', value: 'To jest przykład notatki' }
        ],
        size: QRCodeSizeEnum.L
    }
];

// Generowanie kodów QR i PDF
const result = await QRCodeFacade.generateQRCodesAndPDF(items);
```

### Sposób 2: Dependency Injection
```typescript
import { Container } from './src/infrastructure/di/container';
import { QRCodeController } from './src/presentation/controllers/QRCodeController';

const container = Container.getInstance();
const controller = new QRCodeController(
    container.get('QRCodeService')
);

const qrCodes = await controller.generateQRCodes(items);
const pdfBuffer = await controller.generatePDF(qrCodes);
```

### Sposób 3: Bezpośrednie użycie serwisów
```typescript
import { QRCodeService } from './src/application/services/QRCodeService';
import { QRCodeRepository } from './src/infrastructure/repositories/QRCodeRepository';
import { QRCodeAdapter } from './src/infrastructure/adapters/QRCodeAdapter';
import { PDFAdapter } from './src/infrastructure/adapters/PDFAdapter';

const qrCodeAdapter = new QRCodeAdapter();
const pdfAdapter = new PDFAdapter();
const repository = new QRCodeRepository(qrCodeAdapter, pdfAdapter);
const service = new QRCodeService(repository);

const qrCodes = await service.generateQRCodes(items);
```

## 🎨 Szablony

System szablonów pozwala na tworzenie różnych typów etykiet:

### SampleLabel (Etykiety próbek)
```typescript
const sampleItem: QRCodeInput = {
    value: 'SMP123456|LOT20250728|GTIN09506000123458',
    labels: [
        { name: 'Próbka', value: 'SMP123456' },
        { name: 'LOT', value: 'LOT20250728' },
        { name: 'GTIN', value: '09506000123458' },
        { name: 'Data ważności', value: '2025-08-28' }
    ],
    size: QRCodeSizeEnum.L
};
```

### InventoryLabel (Etykiety inwentarzowe)
```typescript
const inventoryItem: QRCodeInput = {
    value: 'INV001|Laptop Dell|Shelf A1',
    labels: [
        { name: 'Kod', value: 'INV001' },
        { name: 'Nazwa', value: 'Laptop Dell' },
        { name: 'Lokalizacja', value: 'Shelf A1' },
        { name: 'Ilość', value: '5 szt.' }
    ],
    size: QRCodeSizeEnum.M
};
```

### ProductLabel (Etykiety produktowe)
```typescript
const productItem: QRCodeInput = {
    value: 'PROD001|iPhone 15|999.99|SKU123456',
    labels: [
        { name: 'Produkt', value: 'iPhone 15' },
        { name: 'Cena', value: '999.99 PLN' },
        { name: 'SKU', value: 'SKU123456' },
        { name: 'Kategoria', value: 'Elektronika' }
    ],
    size: QRCodeSizeEnum.L
};
```

## 📏 Rozmiary kodów QR

### Small (S) - 80×80px
- **Maksymalnie 3 etykiety**
- **Czcionka: 6px**
- **Użycie:** Kompaktowe etykiety, ograniczona przestrzeń

### Medium (M) - 150×150px
- **Maksymalnie 5 etykiet**
- **Czcionka: 12px**
- **Użycie:** Standardowe etykiety, codzienne zastosowania

### Large (L) - 200×200px
- **Maksymalnie 8 etykiet**
- **Czcionka: 16px**
- **Użycie:** Szczegółowe etykiety, dokumentacja

### Extra Large (XL) - 400×400px
- **Maksymalnie 12 etykiet**
- **Czcionka: 20px**
- **Użycie:** Pełne opisy, prezentacje

## 🧪 Testowanie

### Uruchomienie testów
```bash
# Wszystkie testy
npm test

# Testy nowej architektury
npm run test:new

# Testy starej architektury
npm run test:old

# Test systemu zarządzania plikami
npm run test-all
```

### Testowanie funkcjonalności
```bash
# Test nowej architektury
npm start

# Test podglądu
npm run preview

# Test szablonów
npm run templates

# Test rozmiarów
npm run sizes
```

### Zarządzanie plikami testowymi
```bash
# Czyszczenie katalogu testowego
npm run clean

# Test wszystkich funkcjonalności
npm run test-all
```

### Katalog testowy
Wszystkie pliki testowe (PDF, JSON, etc.) są automatycznie zapisywane w katalogu `test/`, który jest ignorowany przez Git.

## 📚 API Reference

### QRCodeFacade
Główny interfejs do generowania kodów QR i PDF.

#### Metody
- `generateQRCodes(items: QRCodeInput[]): Promise<QRCode[]>`
- `generatePDF(qrCodes: QRCode[]): Promise<Buffer>`
- `generateQRCodesAndPDF(items: QRCodeInput[]): Promise<{ qrCodes: QRCode[], pdfBuffer: Buffer }>`
- `generatePreview(items: QRCodeInput[]): Promise<PDFPreviewData>`
- `getPreviewAsJSON(items: QRCodeInput[]): Promise<string>`
- `getPreviewSummary(items: QRCodeInput[]): Promise<Summary>`

### QRCodeInput
Interfejs danych wejściowych dla kodów QR.

```typescript
interface QRCodeInput {
    value: string;                    // Dane do zakodowania
    labels: { name: string; value: string }[];  // Etykiety
    size: QRCodeSizeEnum;            // Rozmiar kodu QR
}
```

### QRCodeSizeEnum
Enum rozmiarów kodów QR.

```typescript
enum QRCodeSizeEnum {
    S = 's',    // Small (80×80px)
    M = 'm',    // Medium (150×150px)
    L = 'l',    // Large (200×200px)
    XL = 'xl'   // Extra Large (400×400px)
}
```

## 📝 Przykłady

### Przykład 1: Podstawowe użycie
```typescript
import * as fs from "fs";
import { QRCodeFacade, QRCodeInput, QRCodeSizeEnum } from './src/index';

const items: QRCodeInput[] = [
    { 
        value: '12345', 
        labels: [{ name: 'Numer próbki', value: '12345' }], 
        size: QRCodeSizeEnum.M 
    },
    { 
        value: '67890', 
        labels: [
            { name: 'Numer próbki', value: '10-08-2024/1009282/01/02' }, 
            { name: 'Data', value: '2023-10-05' }
        ], 
        size: QRCodeSizeEnum.L 
    }
];

try {
    const result = await QRCodeFacade.generateQRCodesAndPDF(items);
    fs.writeFileSync('output.pdf', result.pdfBuffer);
    console.log('Plik PDF wygenerowany pomyślnie!');
} catch (error) {
    console.error('Błąd:', error);
}
```

### Przykład 2: Podgląd przed drukiem
```typescript
import { QRCodeFacade, QRCodeInput, QRCodeSizeEnum } from './src/index';

const items: QRCodeInput[] = [
    {
        value: 'http://www.wp.pl',
        labels: [
            { name: 'Numer próbki', value: '10-08-2024/1009282/01/02' },
            { name: 'Notatka', value: 'To jest przykład notatki' }
        ],
        size: QRCodeSizeEnum.L
    }
];

// Generowanie podglądu
const preview = await QRCodeFacade.generatePreview(items);
console.log(`Liczba kodów QR: ${preview.qrCodes.length}`);
console.log(`Liczba stron: ${preview.totalPages}`);

// Generowanie PDF
const result = await QRCodeFacade.generateQRCodesAndPDF(items);
```

### Przykład 3: Różne rozmiary
```typescript
const items: QRCodeInput[] = [
    // Mały kod QR (max 3 etykiety)
    {
        value: 'SMP123456',
        labels: [
            { name: 'Próbka', value: 'SMP123456' },
            { name: 'LOT', value: 'LOT20250728' },
            { name: 'GTIN', value: '09506000123458' }
        ],
        size: QRCodeSizeEnum.S
    },
    // Duży kod QR (max 8 etykiet)
    {
        value: 'PROD001|iPhone 15|999.99|SKU123456',
        labels: [
            { name: 'Produkt', value: 'iPhone 15' },
            { name: 'Cena', value: '999.99 PLN' },
            { name: 'SKU', value: 'SKU123456' },
            { name: 'Kategoria', value: 'Elektronika' },
            { name: 'Marka', value: 'Apple' },
            { name: 'Rok', value: '2024' },
            { name: 'Kolor', value: 'Czarny' },
            { name: 'Pamięć', value: '128GB' }
        ],
        size: QRCodeSizeEnum.L
    }
];
```

## 🔧 Rozwiązywanie problemów

### Częste problemy

#### 1. Błąd: "Template validation failed"
**Problem:** Etykiety nie spełniają wymagań szablonu.
**Rozwiązanie:** Sprawdź wymagane etykiety dla danego szablonu.

#### 2. Błąd: "Too many labels for size"
**Problem:** Przekroczono maksymalną liczbę etykiet dla rozmiaru.
**Rozwiązanie:** Zmniejsz liczbę etykiet lub zwiększ rozmiar kodu QR.

#### 3. Błąd: "PDF generation failed"
**Problem:** Problem z generowaniem pliku PDF.
**Rozwiązanie:** Sprawdź czy wszystkie zależności są zainstalowane.

### Debugowanie
```bash
# Włączanie szczegółowych logów
DEBUG=* npm start

# Testowanie konkretnej funkcjonalności
npm run preview
npm run templates
npm run sizes
```

### Logi
Aplikacja generuje szczegółowe logi podczas:
- Generowania kodów QR
- Tworzenia plików PDF
- Walidacji danych
- Operacji na plikach

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT.

## 🤝 Współpraca

### Struktura projektu
```
qrcode-pdf/
├── src/                    # Kod źródłowy
│   ├── domain/            # Warstwa domenowa
│   ├── application/       # Warstwa aplikacyjna
│   ├── infrastructure/    # Warstwa infrastruktury
│   ├── presentation/      # Warstwa prezentacji
│   └── utils/            # Narzędzia pomocnicze
├── examples/              # Przykłady użycia
├── tests/                 # Testy jednostkowe
├── test/                  # Pliki testowe (ignorowane przez Git)
└── docs/                  # Dokumentacja
```

### Dodawanie nowych funkcjonalności
1. Dodaj interfejs w warstwie domenowej
2. Zaimplementuj serwis w warstwie aplikacyjnej
3. Stwórz adapter w warstwie infrastruktury
4. Dodaj kontroler w warstwie prezentacji
5. Napisz testy jednostkowe
6. Zaktualizuj dokumentację

### Style kodowania
- Używaj TypeScript strict mode
- Przestrzegaj zasad SOLID
- Pisz testy jednostkowe
- Dokumentuj publiczne API
- Używaj znaczących nazw zmiennych i funkcji

---

**Autor:** QR Code PDF Generator Team  
**Wersja:** 1.0.0  
**Ostatnia aktualizacja:** 2024