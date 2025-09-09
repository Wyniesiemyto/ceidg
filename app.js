// Application data
const appData = {
    companies: [
        {"id": 1, "name": "PPHU Jan Kowalski", "nip": "1234567890", "email": "kontakt@kowalski-transport.pl", "phone": "+48123456789", "city": "Kraków", "voivodeship": "Małopolskie", "pkd": "49.41.Z", "date": "2025-09-09"},
        {"id": 2, "name": "Anna Nowak Consulting", "nip": "9876543210", "email": "anna@nowakconsulting.pl", "phone": "+48987654321", "city": "Warszawa", "voivodeship": "Mazowieckie", "pkd": "70.22.Z", "date": "2025-09-08"},
        {"id": 3, "name": "TechSoft Solutions Sp. z o.o.", "nip": "5555666677", "email": "info@techsoft.pl", "phone": "+48555666777", "city": "Gdańsk", "voivodeship": "Pomorskie", "pkd": "62.01.Z", "date": "2025-09-09"},
        {"id": 4, "name": "Piekarnia Świeży Chleb", "nip": "1111222233", "email": "zamowienia@swiezychleb.pl", "phone": "+48111222333", "city": "Wrocław", "voivodeship": "Dolnośląskie", "pkd": "10.71.A", "date": "2025-09-07"},
        {"id": 5, "name": "Mechanik Samochodowy Piotr Zieliński", "nip": "4444555566", "email": "serwis@zielinski-auto.pl", "phone": "+48444555666", "city": "Poznań", "voivodeship": "Wielkopolskie", "pkd": "45.20.Z", "date": "2025-09-09"},
        {"id": 6, "name": "Studio Fryzjerskie Bella", "nip": "7777888899", "email": "rezerwacje@studiobella.pl", "phone": "+48777888999", "city": "Łódź", "voivodeship": "Łódzkie", "pkd": "96.02.Z", "date": "2025-09-08"},
        {"id": 7, "name": "Firma Budowlana MegaBud", "nip": "2222333344", "email": "biuro@megabud.pl", "phone": "+48222333444", "city": "Katowice", "voivodeship": "Śląskie", "pkd": "41.20.Z", "date": "2025-09-09"},
        {"id": 8, "name": "Ewa Kowalczyk Księgowość", "nip": "6666777788", "email": "ewa@ksiegowosc-kowalczyk.pl", "phone": "+48666777888", "city": "Lublin", "voivodeship": "Lubelskie", "pkd": "69.20.Z", "date": "2025-09-08"},
        {"id": 9, "name": "RestauracjA Smaki Polski", "nip": "8888999900", "email": "rezerwacje@smakipolski.pl", "phone": "+48888999000", "city": "Białystok", "voivodeship": "Podlaskie", "pkd": "56.10.A", "date": "2025-09-07"},
        {"id": 10, "name": "Centrum Medyczne VitaHealth", "nip": "3333444455", "email": "recepcja@vitahealth.pl", "phone": "+48333444555", "city": "Rzeszów", "voivodeship": "Podkarpackie", "pkd": "86.10.Z", "date": "2025-09-09"}
    ],
    statistics: {
        total: 1247,
        with_email: 923,
        with_phone: 1156,
        today: 45,
        yesterday: 38,
        weekly: 312
    },
    voivodeships: [
        {"name": "Mazowieckie", "count": 245},
        {"name": "Śląskie", "count": 178},
        {"name": "Wielkopolskie", "count": 156},
        {"name": "Małopolskie", "count": 134},
        {"name": "Dolnośląskie", "count": 112},
        {"name": "Pomorskie", "count": 89},
        {"name": "Łódzkie", "count": 87},
        {"name": "Lubelskie", "count": 76},
        {"name": "Zachodniopomorskie", "count": 68},
        {"name": "Podkarpackie", "count": 54},
        {"name": "Kujawsko-pomorskie", "count": 48},
        {"name": "Podlaskie", "count": 42},
        {"name": "Warmińsko-mazurskie", "count": 38},
        {"name": "Świętokrzyskie", "count": 32},
        {"name": "Lubuskie", "count": 28},
        {"name": "Opolskie", "count": 22}
    ],
    daily_stats: [
        {"date": "2025-09-03", "count": 28},
        {"date": "2025-09-04", "count": 35},
        {"date": "2025-09-05", "count": 42},
        {"date": "2025-09-06", "count": 31},
        {"date": "2025-09-07", "count": 39},
        {"date": "2025-09-08", "count": 38},
        {"date": "2025-09-09", "count": 45}
    ]
};

// Application state
let currentPage = 1;
let itemsPerPage = 10;
let filteredCompanies = [...appData.companies];
let scrapingInProgress = false;
let charts = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
    initializeNavigation();
    initializeDashboard();
    initializeDataTable();
    initializeScraping();
    initializeSettings();
    initializeModals();
    updateStatistics();
    renderDataTable();
    createCharts();
    console.log('App initialized successfully');
});

// Navigation
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    // Mobile menu toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            console.log('Navigation clicked:', section);
            
            if (section) {
                showSection(section);
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            }
        });
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            sidebar && !sidebar.contains(e.target) && 
            menuToggle && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function showSection(sectionName) {
    console.log('Showing section:', sectionName);
    
    const sections = document.querySelectorAll('.content-section');
    const targetSection = document.getElementById(sectionName);
    
    if (!targetSection) {
        console.error('Section not found:', sectionName);
        return;
    }
    
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    targetSection.classList.add('active');
    
    // Trigger specific initialization for sections
    if (sectionName === 'statistics') {
        setTimeout(createStatisticsCharts, 100);
    } else if (sectionName === 'data') {
        setTimeout(() => {
            renderDataTable();
            renderPagination();
        }, 100);
    }
}

// Dashboard
function initializeDashboard() {
    const startScrapingBtn = document.getElementById('startScrapingBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    
    if (startScrapingBtn) {
        startScrapingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Start scraping button clicked');
            showSection('scraping');
            
            // Update navigation active state
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            const scrapingNavLink = document.querySelector('[data-section="scraping"]');
            if (scrapingNavLink) {
                scrapingNavLink.classList.add('active');
            }
        });
    }

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const exportModal = document.getElementById('exportModal');
            if (exportModal) {
                exportModal.classList.remove('hidden');
            }
        });
    }
}

function updateStatistics() {
    const totalElement = document.getElementById('totalCompanies');
    const emailElement = document.getElementById('companiesWithEmail');
    const phoneElement = document.getElementById('companiesWithPhone');
    const todayElement = document.getElementById('todayCompanies');
    
    if (totalElement) totalElement.textContent = appData.statistics.total.toLocaleString('pl-PL');
    if (emailElement) emailElement.textContent = appData.statistics.with_email.toLocaleString('pl-PL');
    if (phoneElement) phoneElement.textContent = appData.statistics.with_phone.toLocaleString('pl-PL');
    if (todayElement) todayElement.textContent = appData.statistics.today.toLocaleString('pl-PL');
}

function createCharts() {
    // Weekly trend chart
    const weeklyCanvas = document.getElementById('weeklyTrendChart');
    if (weeklyCanvas) {
        const weeklyCtx = weeklyCanvas.getContext('2d');
        charts.weekly = new Chart(weeklyCtx, {
            type: 'line',
            data: {
                labels: appData.daily_stats.map(stat => {
                    const date = new Date(stat.date);
                    return date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric' });
                }),
                datasets: [{
                    label: 'Nowe firmy',
                    data: appData.daily_stats.map(stat => stat.count),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Voivodeship chart
    const voivodeshipCanvas = document.getElementById('voivodeshipChart');
    if (voivodeshipCanvas) {
        const voivodeshipCtx = voivodeshipCanvas.getContext('2d');
        const topVoivodeships = appData.voivodeships.slice(0, 6);
        
        charts.voivodeship = new Chart(voivodeshipCtx, {
            type: 'doughnut',
            data: {
                labels: topVoivodeships.map(v => v.name),
                datasets: [{
                    data: topVoivodeships.map(v => v.count),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function createStatisticsCharts() {
    // Detailed voivodeship chart
    const detailedVoivodeshipCanvas = document.getElementById('detailedVoivodeshipChart');
    if (detailedVoivodeshipCanvas) {
        const detailedVoivodeshipCtx = detailedVoivodeshipCanvas.getContext('2d');
        if (charts.detailedVoivodeship) {
            charts.detailedVoivodeship.destroy();
        }
        
        charts.detailedVoivodeship = new Chart(detailedVoivodeshipCtx, {
            type: 'bar',
            data: {
                labels: appData.voivodeships.slice(0, 10).map(v => v.name),
                datasets: [{
                    label: 'Liczba firm',
                    data: appData.voivodeships.slice(0, 10).map(v => v.count),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Contact chart
    const contactCanvas = document.getElementById('contactChart');
    if (contactCanvas) {
        const contactCtx = contactCanvas.getContext('2d');
        if (charts.contact) {
            charts.contact.destroy();
        }
        
        charts.contact = new Chart(contactCtx, {
            type: 'pie',
            data: {
                labels: ['Z emailem', 'Z telefonem', 'Bez kontaktu'],
                datasets: [{
                    data: [
                        appData.statistics.with_email,
                        appData.statistics.with_phone - appData.statistics.with_email,
                        appData.statistics.total - appData.statistics.with_phone
                    ],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Monthly trend chart
    const monthlyCanvas = document.getElementById('monthlyTrendChart');
    if (monthlyCanvas) {
        const monthlyCtx = monthlyCanvas.getContext('2d');
        if (charts.monthly) {
            charts.monthly.destroy();
        }
        
        const monthlyData = [
            { month: 'Maj', count: 234 },
            { month: 'Czerwiec', count: 267 },
            { month: 'Lipiec', count: 298 },
            { month: 'Sierpień', count: 276 },
            { month: 'Wrzesień', count: 312 }
        ];
        
        charts.monthly = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: monthlyData.map(d => d.month),
                datasets: [{
                    label: 'Nowe firmy',
                    data: monthlyData.map(d => d.count),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Data table
function initializeDataTable() {
    const searchInput = document.getElementById('searchInput');
    const voivodeshipDataFilter = document.getElementById('voivodeshipDataFilter');
    const contactFilter = document.getElementById('contactFilter');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterData, 300));
    }
    if (voivodeshipDataFilter) {
        voivodeshipDataFilter.addEventListener('change', filterData);
    }
    if (contactFilter) {
        contactFilter.addEventListener('change', filterData);
    }
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCsv);
    }
}

function filterData() {
    const searchInput = document.getElementById('searchInput');
    const voivodeshipDataFilter = document.getElementById('voivodeshipDataFilter');
    const contactFilter = document.getElementById('contactFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const voivodeshipFilter = voivodeshipDataFilter ? voivodeshipDataFilter.value : '';
    const contactFilterValue = contactFilter ? contactFilter.value : '';

    filteredCompanies = appData.companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm) ||
                             company.city.toLowerCase().includes(searchTerm) ||
                             company.nip.includes(searchTerm);
        
        const matchesVoivodeship = !voivodeshipFilter || company.voivodeship === voivodeshipFilter;
        
        let matchesContact = true;
        if (contactFilterValue === 'email') {
            matchesContact = company.email && company.email.trim() !== '';
        } else if (contactFilterValue === 'phone') {
            matchesContact = company.phone && company.phone.trim() !== '';
        } else if (contactFilterValue === 'both') {
            matchesContact = company.email && company.email.trim() !== '' && 
                           company.phone && company.phone.trim() !== '';
        }

        return matchesSearch && matchesVoivodeship && matchesContact;
    });

    currentPage = 1;
    renderDataTable();
    renderPagination();
}

function renderDataTable() {
    const dataTableBody = document.getElementById('dataTableBody');
    if (!dataTableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredCompanies.slice(startIndex, endIndex);

    dataTableBody.innerHTML = pageData.map(company => `
        <tr>
            <td>${company.name}</td>
            <td>${company.nip}</td>
            <td>${company.email || '-'}</td>
            <td>${company.phone || '-'}</td>
            <td>${company.city}</td>
            <td>${company.voivodeship}</td>
            <td>${new Date(company.date).toLocaleDateString('pl-PL')}</td>
        </tr>
    `).join('');

    updatePaginationInfo();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    renderDataTable();
    renderPagination();
}

function updatePaginationInfo() {
    const paginationInfo = document.getElementById('paginationInfo');
    if (!paginationInfo) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredCompanies.length);
    const total = filteredCompanies.length;
    
    paginationInfo.textContent = `Pokazuje ${startIndex}-${endIndex} z ${total} wyników`;
}

// Scraping
function initializeScraping() {
    const runScrapingBtn = document.getElementById('runScrapingBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    
    if (runScrapingBtn) {
        runScrapingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Run scraping button clicked');
            startScraping();
        });
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', clearLogs);
    }
}

function startScraping() {
    console.log('Starting scraping process...');
    
    if (scrapingInProgress) {
        console.log('Scraping already in progress');
        return;
    }
    
    const runScrapingBtn = document.getElementById('runScrapingBtn');
    
    scrapingInProgress = true;
    if (runScrapingBtn) {
        runScrapingBtn.disabled = true;
        runScrapingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Trwa scraping...';
    }
    
    updateScrapingStatus('Rozpoczęto', 'warning');
    addLog('Rozpoczynanie scrapingu danych CEIDG...', 'info');
    
    // Simulate scraping process
    let progress = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 100) progress = 100;
        
        updateProgress(progress, totalSteps);
        
        // Add random log entries
        if (Math.random() < 0.3) {
            const logs = [
                'Pobieranie danych z CEIDG...',
                'Przetwarzanie rekordów...',
                'Weryfikacja danych kontaktowych...',
                'Zapisywanie do bazy danych...',
                'Filtrowanie duplikatów...'
            ];
            addLog(logs[Math.floor(Math.random() * logs.length)], 'info');
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            completeScraping();
        }
    }, 200);
}

function completeScraping() {
    console.log('Scraping completed');
    
    const runScrapingBtn = document.getElementById('runScrapingBtn');
    
    scrapingInProgress = false;
    if (runScrapingBtn) {
        runScrapingBtn.disabled = false;
        runScrapingBtn.innerHTML = '<i class="fas fa-play"></i> Uruchom Scraping';
    }
    
    updateScrapingStatus('Zakończono', 'success');
    addLog('Scraping zakończony pomyślnie! Pobrano 45 nowych firm.', 'success');
    
    // Update statistics
    appData.statistics.today += 5;
    appData.statistics.total += 5;
    updateStatistics();
    
    showToast('Sukces', 'Scraping zakończony pomyślnie!', 'success');
}

function updateScrapingStatus(text, type) {
    const scrapingStatus = document.getElementById('scrapingStatus');
    if (!scrapingStatus) return;
    
    const statusMap = {
        'info': 'status--info',
        'success': 'status--success',
        'warning': 'status--warning',
        'error': 'status--error'
    };
    
    scrapingStatus.innerHTML = `<span class="status ${statusMap[type]}">${text}</span>`;
}

function updateProgress(current, total) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    
    const percentage = Math.round((current / total) * 100);
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${Math.round(current)} / ${total}`;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;
}

function addLog(message, type) {
    const logsContainer = document.getElementById('logsContainer');
    if (!logsContainer) return;
    
    const timestamp = new Date().toLocaleTimeString('pl-PL');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    logsContainer.appendChild(logEntry);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

function clearLogs() {
    const logsContainer = document.getElementById('logsContainer');
    if (logsContainer) {
        logsContainer.innerHTML = '<div class="log-entry log-info">Logi wyczyszczone</div>';
    }
}

// Settings
function initializeSettings() {
    const settingsButtons = document.querySelectorAll('.settings-grid .btn--primary');
    settingsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Ustawienia', 'Ustawienia zostały zapisane', 'success');
        });
    });
}

// Modals
function initializeModals() {
    const exportModal = document.getElementById('exportModal');
    const closeExportModal = document.getElementById('closeExportModal');
    const exportCsvModal = document.getElementById('exportCsvModal');

    if (closeExportModal && exportModal) {
        closeExportModal.addEventListener('click', function() {
            exportModal.classList.add('hidden');
        });
    }

    if (exportCsvModal && exportModal) {
        exportCsvModal.addEventListener('click', function() {
            exportToCsv();
            exportModal.classList.add('hidden');
        });
    }

    // Close modal when clicking outside
    if (exportModal) {
        exportModal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
}

// Export functionality
function exportToCsv() {
    const headers = ['Nazwa firmy', 'NIP', 'Email', 'Telefon', 'Miasto', 'Województwo', 'Data'];
    const csvContent = [
        headers.join(','),
        ...filteredCompanies.map(company => [
            `"${company.name}"`,
            company.nip,
            company.email || '',
            company.phone || '',
            `"${company.city}"`,
            `"${company.voivodeship}"`,
            company.date
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `firmy_ceidg_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Eksport', 'Dane zostały wyeksportowane do pliku CSV', 'success');
}

// Toast notifications
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for toast slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);