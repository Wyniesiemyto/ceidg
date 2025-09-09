# Konfiguracja aplikacji
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # API CEIDG
    CEIDG_API_KEY = os.getenv('CEIDG_API_KEY')
    CEIDG_API_URL = 'https://datastore.ceidg.gov.pl/CEIDG.DataStore/Services/NewDataStoreProvider.svc'
    CEIDG_TEST_URL = 'https://datastoretest.ceidg.gov.pl/CEIDG.DataStore/Services/NewDataStoreProvider.svc'

    # Baza danych
    DATABASE_PATH = os.getenv('DATABASE_PATH', 'ceidg_data.db')
    POSTGRES_URL = os.getenv('POSTGRES_URL')

    # Email
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
    SMTP_USER = os.getenv('SMTP_USER')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    REPORT_RECIPIENT = os.getenv('REPORT_RECIPIENT')

    # Scraping
    REQUEST_DELAY = float(os.getenv('REQUEST_DELAY', '1.0'))  # sekundy między requestami
    MAX_RETRIES = int(os.getenv('MAX_RETRIES', '3'))
    TIMEOUT = int(os.getenv('TIMEOUT', '30'))

    # Filtry
    MIN_EMAIL_VALIDATION = os.getenv('MIN_EMAIL_VALIDATION', 'True').lower() == 'true'
    MIN_PHONE_VALIDATION = os.getenv('MIN_PHONE_VALIDATION', 'True').lower() == 'true'

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'ceidg_scraper.log')