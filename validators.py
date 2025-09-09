# Walidatory danych kontaktowych
import re
import dns.resolver
from typing import Optional, Tuple

class ContactValidator:
    def __init__(self):
        self.email_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        self.phone_patterns = [
            re.compile(r'^\+48\d{9}$'),      # +48123456789
            re.compile(r'^48\d{9}$'),         # 48123456789  
            re.compile(r'^\d{9}$'),           # 123456789
            re.compile(r'^\d{3}\s\d{3}\s\d{3}$')  # 123 456 789
        ]

    def validate_email(self, email: str) -> Tuple[bool, Optional[str]]:
        '''Waliduje adres email z weryfikacją MX'''
        if not email:
            return False, "Pusty email"

        # Podstawowa walidacja formatu
        if not self.email_pattern.match(email.lower().strip()):
            return False, "Nieprawidłowy format email"

        # Weryfikacja domeny MX (opcjonalna)
        try:
            domain = email.split('@')[1]
            dns.resolver.resolve(domain, 'MX')
            return True, None
        except Exception as e:
            return False, f"Błąd weryfikacji domeny: {str(e)}"

    def validate_phone(self, phone: str) -> Tuple[bool, Optional[str]]:
        '''Waliduje numer telefonu Polski'''
        if not phone:
            return False, "Pusty numer"

        # Czyści numer ze znaków specjalnych
        clean_phone = re.sub(r'[^\d+]', '', phone)

        # Sprawdza wzorce
        for pattern in self.phone_patterns:
            if pattern.match(clean_phone):
                return True, None

        return False, "Nieprawidłowy format numeru telefonu"

    def normalize_phone(self, phone: str) -> str:
        '''Normalizuje numer telefonu do formatu +48XXXXXXXXX'''
        if not phone:
            return ""

        clean = re.sub(r'[^\d]', '', phone)

        if len(clean) == 9:
            return f"+48{clean}"
        elif len(clean) == 11 and clean.startswith('48'):
            return f"+{clean}"
        elif len(clean) == 12 and clean.startswith('+48'):
            return clean
        else:
            return phone  # Zwraca original jeśli nie można znormalizować