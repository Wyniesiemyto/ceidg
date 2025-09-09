# Operacje bazodanowe
import sqlite3
from contextlib import contextmanager
from typing import List, Dict, Any
import logging

class DatabaseManager:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.setup_database()
        self.logger = logging.getLogger(__name__)

    @contextmanager
    def get_connection(self):
        '''Context manager dla połączenia z bazą'''
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Dostęp do kolumn po nazwach
        try:
            yield conn
        finally:
            conn.close()

    def setup_database(self):
        '''Tworzy strukturę bazy danych'''
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Tabela firm z CEIDG
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS companies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ceidg_id TEXT UNIQUE NOT NULL,
                    nip TEXT,
                    regon TEXT,
                    company_name TEXT NOT NULL,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT,
                    phone TEXT,
                    website TEXT,
                    city TEXT,
                    voivodeship TEXT,
                    postal_code TEXT,
                    street TEXT,
                    building_number TEXT,
                    start_date TEXT,
                    status TEXT,
                    pkd_codes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            # Indeksy dla wydajności
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_companies_email ON companies(email)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_companies_nip ON companies(nip)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city)')
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status)')

            # Tabela logów scrapowania
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS scraping_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    operation TEXT NOT NULL,
                    status TEXT NOT NULL,
                    records_found INTEGER DEFAULT 0,
                    records_saved INTEGER DEFAULT 0,
                    error_message TEXT,
                    execution_time_seconds REAL
                )
            ''')

            # Tabela statystyk
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS statistics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date DATE NOT NULL,
                    total_companies INTEGER,
                    companies_with_email INTEGER,
                    companies_with_phone INTEGER,
                    new_companies_today INTEGER,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')

            conn.commit()

    def insert_company(self, company_data: Dict[str, Any]) -> bool:
        '''Wstawia lub aktualizuje firmę'''
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()

                # Sprawdź czy firma już istnieje
                cursor.execute('SELECT id FROM companies WHERE ceidg_id = ?', 
                             (company_data['ceidg_id'],))

                if cursor.fetchone():
                    # Aktualizuj istniejącą
                    cursor.execute('''
                        UPDATE companies SET
                        company_name=?, first_name=?, last_name=?, email=?, phone=?,
                        website=?, city=?, voivodeship=?, postal_code=?, status=?,
                        updated_at=CURRENT_TIMESTAMP
                        WHERE ceidg_id=?
                    ''', (
                        company_data.get('company_name'), company_data.get('first_name'),
                        company_data.get('last_name'), company_data.get('email'),
                        company_data.get('phone'), company_data.get('website'),
                        company_data.get('city'), company_data.get('voivodeship'), 
                        company_data.get('postal_code'), company_data.get('status'),
                        company_data['ceidg_id']
                    ))
                else:
                    # Wstaw nową
                    cursor.execute('''
                        INSERT INTO companies (ceidg_id, nip, regon, company_name, 
                        first_name, last_name, email, phone, website, city, 
                        voivodeship, postal_code, start_date, status, pkd_codes)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        company_data['ceidg_id'], company_data.get('nip'),
                        company_data.get('regon'), company_data.get('company_name'),
                        company_data.get('first_name'), company_data.get('last_name'),
                        company_data.get('email'), company_data.get('phone'),
                        company_data.get('website'), company_data.get('city'),
                        company_data.get('voivodeship'), company_data.get('postal_code'),
                        company_data.get('start_date'), company_data.get('status'),
                        company_data.get('pkd_codes')
                    ))

                conn.commit()
                return True

        except Exception as e:
            self.logger.error(f"Błąd zapisu firmy {company_data.get('ceidg_id')}: {e}")
            return False

    def get_statistics(self) -> Dict[str, Any]:
        '''Zwraca statystyki bazy danych'''
        with self.get_connection() as conn:
            cursor = conn.cursor()

            stats = {}

            # Podstawowe liczniki
            cursor.execute('SELECT COUNT(*) FROM companies')
            stats['total_companies'] = cursor.fetchone()[0]

            cursor.execute('SELECT COUNT(*) FROM companies WHERE email IS NOT NULL AND email != ""')
            stats['companies_with_email'] = cursor.fetchone()[0]

            cursor.execute('SELECT COUNT(*) FROM companies WHERE phone IS NOT NULL AND phone != ""')
            stats['companies_with_phone'] = cursor.fetchone()[0]

            # Nowe dzisiaj
            cursor.execute('SELECT COUNT(*) FROM companies WHERE date(created_at) = date("now")')
            stats['new_today'] = cursor.fetchone()[0]

            # Top województwa
            cursor.execute('''
                SELECT voivodeship, COUNT(*) as count
                FROM companies 
                WHERE voivodeship IS NOT NULL 
                GROUP BY voivodeship 
                ORDER BY count DESC 
                LIMIT 10
            ''')
            stats['top_voivodeships'] = cursor.fetchall()

            return stats