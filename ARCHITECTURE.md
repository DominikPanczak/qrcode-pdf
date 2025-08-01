# Architektura projektu QR Code PDF Generator

## Przegląd architektury

Projekt został zrefaktoryzowany do architektury warstwowej w stylu cebuli (Onion Architecture) z zastosowaniem wzorców projektowych i zasad SOLID.

## Diagram warstw

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Controllers   │  │     Facades     │                │
│  │                 │  │                 │                │
│  │ QRCodeController│  │ QRCodeFacade    │                │
│  └─────────────────┘  └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Services                             │   │
│  │                                                 │   │
│  │ QRCodeService (Orchestrates domain logic)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │
│  │  Entities   │ │Value Objects│ │ Repositories│         │
│  │             │ │             │ │             │         │
│  │   QRCode    │ │QRCodeSizeEnum│ │IQRCodeRepo │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Services                             │   │
│  │                                                 │   │
│  │ IQRCodeService (Domain interfaces)               │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │  Adapters   │ │Repositories │ │     DI      │         │
│  │             │ │             │ │             │         │
│  │QRCodeAdapter│ │QRCodeRepo   │ │  Container  │         │
│  │PDFAdapter   │ │             │ │             │         │
│  └─────────────┘ └─────────────┘ └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 EXTERNAL DEPENDENCIES                      │
│  ┌─────────────┐ ┌─────────────┐                         │
│  │   qrcode    │ │   pdfkit    │                         │
│  │  library    │ │  library    │                         │
│  └─────────────┘ └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## Zasady architektury

### 1. Dependency Inversion Principle
- Warstwy zewnętrzne zależą od abstrakcji warstw wewnętrznych
- Interfejsy są definiowane w warstwie domenowej
- Implementacje są w warstwie infrastruktury

### 2. Separation of Concerns
- **Domain Layer**: Logika biznesowa i reguły domenowe
- **Application Layer**: Orkiestracja przypadków użycia
- **Infrastructure Layer**: Implementacja zewnętrznych zależności
- **Presentation Layer**: Interfejs użytkownika i kontrolery

### 3. Adapter Pattern
- `QRCodeAdapter`: Izoluje bibliotekę `qrcode`
- `PDFAdapter`: Izoluje bibliotekę `pdfkit`
- Łatwa wymiana implementacji bez wpływu na logikę biznesową

### 4. Repository Pattern
- `IQRCodeRepository`: Abstrakcja dostępu do danych
- `QRCodeRepository`: Implementacja z użyciem adapterów

### 5. Dependency Injection
- `Container`: Singleton container dla DI
- Łatwe testowanie przez mockowanie zależności
- Loose coupling między komponentami

## Przepływ danych

```
1. Controller/Facade
   ↓
2. Application Service (QRCodeService)
   ↓
3. Domain Service (logika biznesowa)
   ↓
4. Repository (IQRCodeRepository)
   ↓
5. Adapters (QRCodeAdapter, PDFAdapter)
   ↓
6. External Libraries (qrcode, pdfkit)
```

## Korzyści z nowej architektury

### ✅ Testowalność
- Każda warstwa może być testowana niezależnie
- Mockowanie zależności przez DI
- Izolacja logiki biznesowej

### ✅ Maintainability
- Jasne separacje odpowiedzialności
- Łatwe dodawanie nowych funkcjonalności
- Refaktoryzacja bez wpływu na inne warstwy

### ✅ Scalability
- Możliwość dodawania nowych adapterów
- Rozszerzanie o nowe formaty wyjściowe
- Wymiana implementacji bez zmiany API

### ✅ Flexibility
- Łatwa wymiana bibliotek zewnętrznych
- Dodawanie nowych warstw prezentacji
- Konfiguracja przez DI container

## Wzorce projektowe użyte

1. **Onion Architecture** - Struktura warstwowa
2. **Adapter Pattern** - Izolacja zewnętrznych bibliotek
3. **Repository Pattern** - Abstrakcja dostępu do danych
4. **Dependency Injection** - Loose coupling
5. **Facade Pattern** - Uproszczony interfejs
6. **Factory Pattern** - Tworzenie obiektów domenowych

## Przykład rozszerzenia

Aby dodać nowy format wyjściowy (np. HTML), wystarczy:

1. Stworzyć nowy adapter `HTMLAdapter`
2. Zarejestrować w `Container`
3. Użyć w `QRCodeRepository`

Bez zmiany logiki biznesowej w warstwie domenowej! 