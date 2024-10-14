import { QRCodeData } from "../src/interface/qrItem.interface";
import { PdfGenerator } from "../src/services";

describe('PdfGenerator', () => {
  it('should generate a PDF buffer without errors', async () => {
    const qrCodes: QRCodeData[] = [
      {
        value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKiSURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJOFHpkvBNKk8Ua5RijVKsUS5epvKmJHySyh0qb0rCm4o1SrFGKdYoFx+WhDtUnkhCp/JJSbhD5ZOKNUqxRinWKBd/nEqXhBOVLgmdyl9WrFGKNUqxRrn445LQqfyfFWuUYo1SrFEuPkzlk1S6JHQqXRLepPKbFGuUYo1SrFEuXpaEb0pCp9IloVPpknBHEn6zYo1SrFGKNUr8wWBJuEPlLyvWKMUapVijXDyUhE7lJAnfpHKShC4JncpJEjqVLgl3qDxRrFGKNUqxRrl4SOUJlSeScJKETuVEpUtCp3KShH+pWKMUa5RijXLxUBI6lS4JdyThCZUuCScqXRK+SeVNxRqlWKMUa5T4g38oCScqXRJOVLoknKh8UhI6lU8q1ijFGqVYo1w8lIQ7VO5IwptU7khCp/KbFWuUYo1SrFHiD/6wJJyodEk4UTlJQqdykoROpUtCp/JEsUYp1ijFGuXioSR8k8qJSpeETqVLQpeEO5LQqXQqXRI+qVijFGuUYo1y8TKVNyXhTUm4Q6VLwkkSTlQ+qVijFGuUYo1y8WFJuEPliSR0Kl0STlS6JJyoPJGETuWJYo1SrFGKNcrFcEl4QuUkCXeodCpvKtYoxRqlWKNc/HEqXRJOVO5IQqfSqXRJOEnCicoTxRqlWKMUa5SLD1P5l1TuSMIdSehUuiScqLypWKMUa5RijXLxsiR8UxJOknCi0qncofKbFGuUYo1SrFHiD9YYxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFG+Q+vDfXxPU1buwAAAABJRU5ErkJggg==',
        labels: [{ name: 'Numer próbki', value: '12345' }],
        size: [150, 150]
      }
    ];

    const pdfGenerator = new PdfGenerator(qrCodes);
    const pdfBuffer = await pdfGenerator.generatePdf();

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it('should handle multiple QR codes correctly in the PDF', async () => {
    const qrCodes: QRCodeData[] = [
      {
        value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKiSURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJOFHpkvBNKk8Ua5RijVKsUS5epvKmJHySyh0qb0rCm4o1SrFGKdYoFx+WhDtUnkhCp/JJSbhD5ZOKNUqxRinWKBd/nEqXhBOVLgmdyl9WrFGKNUqxRrn445LQqfyfFWuUYo1SrFEuPkzlk1S6JHQqXRLepPKbFGuUYo1SrFEuXpaEb0pCp9IloVPpknBHEn6zYo1SrFGKNUr8wWBJuEPlLyvWKMUapVijXDyUhE7lJAnfpHKShC4JncpJEjqVLgl3qDxRrFGKNUqxRrl4SOUJlSeScJKETuVEpUtCp3KShH+pWKMUa5RijXLxUBI6lS4JdyThCZUuCScqXRK+SeVNxRqlWKMUa5T4g38oCScqXRJOVLoknKh8UhI6lU8q1ijFGqVYo1w8lIQ7VO5IwptU7khCp/KbFWuUYo1SrFHiD/6wJJyodEk4UTlJQqdykoROpUtCp/JEsUYp1ijFGuXioSR8k8qJSpeETqVLQpeEO5LQqXQqXRI+qVijFGuUYo1y8TKVNyXhTUm4Q6VLwkkSTlQ+qVijFGuUYo1y8WFJuEPliSR0Kl0STlS6JJyoPJGETuWJYo1SrFGKNcrFcEl4QuUkCXeodCpvKtYoxRqlWKNc/HEqXRJOVO5IQqfSqXRJOEnCicoTxRqlWKMUa5SLD1P5l1TuSMIdSehUuiScqLypWKMUa5RijXLxsiR8UxJOknCi0qncofKbFGuUYo1SrFHiD9YYxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFG+Q+vDfXxPU1buwAAAABJRU5ErkJggg==',
        labels: [{ name: 'Numer próbki', value: '12345' }],
        size: [150, 150]
      },
      {
        value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKiSURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJOFHpkvBNKk8Ua5RijVKsUS5epvKmJHySyh0qb0rCm4o1SrFGKdYoFx+WhDtUnkhCp/JJSbhD5ZOKNUqxRinWKBd/nEqXhBOVLgmdyl9WrFGKNUqxRrn445LQqfyfFWuUYo1SrFEuPkzlk1S6JHQqXRLepPKbFGuUYo1SrFEuXpaEb0pCp9IloVPpknBHEn6zYo1SrFGKNUr8wWBJuEPlLyvWKMUapVijXDyUhE7lJAnfpHKShC4JncpJEjqVLgl3qDxRrFGKNUqxRrl4SOUJlSeScJKETuVEpUtCp3KShH+pWKMUa5RijXLxUBI6lS4JdyThCZUuCScqXRK+SeVNxRqlWKMUa5T4g38oCScqXRJOVLoknKh8UhI6lU8q1ijFGqVYo1w8lIQ7VO5IwptU7khCp/KbFWuUYo1SrFHiD/6wJJyodEk4UTlJQqdykoROpUtCp/JEsUYp1ijFGuXioSR8k8qJSpeETqVLQpeEO5LQqXQqXRI+qVijFGuUYo1y8TKVNyXhTUm4Q6VLwkkSTlQ+qVijFGuUYo1y8WFJuEPliSR0Kl0STlS6JJyoPJGETuWJYo1SrFGKNcrFcEl4QuUkCXeodCpvKtYoxRqlWKNc/HEqXRJOVO5IQqfSqXRJOEnCicoTxRqlWKMUa5SLD1P5l1TuSMIdSehUuiScqLypWKMUa5RijXLxsiR8UxJOknCi0qncofKbFGuUYo1SrFHiD9YYxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFG+Q+vDfXxPU1buwAAAABJRU5ErkJggg==',
        labels: [{ name: 'Numer próbki', value: '67890' }],
        size: [100, 100]
      }
    ];

    const pdfGenerator = new PdfGenerator(qrCodes);
    const pdfBuffer = await pdfGenerator.generatePdf();

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });
});