// app.js – wersja „pusta” bez danych testowych, gotowa na prawdziwe wpisy z API CEIDG

// Główne dane aplikacji
const appData = {
  // Pusta tablica firm – brak danych testowych
  companies: [],

  // Statystyki na start
  statistics: {
    total: 0,
    with_email: 0,
    with_phone: 0,
    today: 0,
    yesterday: 0,
    weekly: 0
  },

  // Konfiguracja (przykładowe wartości – dostosuj według potrzeb)
  config: {
    api_key: "",  // Twój klucz CEIDG
    api_endpoint: "https://datastore.ceidg.gov.pl/CEIDG.DataStore/Services/NewDataStoreProvider.svc",
    require_email: true,
    require_phone: false,
    auto_backup: true,
    scraping_interval: "daily",
    email_notifications: false
  }
};

// Funkcja inicjalizująca Dashboard
function initDashboard() {
  updateStatisticsDisplay();
  initCharts();
}

// Aktualizacja liczb w panelu statystyk
function updateStatisticsDisplay() {
  document.getElementById("stat-total").textContent = appData.statistics.total;
  document.getElementById("stat-email").textContent = appData.statistics.with_email;
  document.getElementById("stat-phone").textContent = appData.statistics.with_phone;
  document.getElementById("stat-today").textContent = appData.statistics.today;
}

// Inicjalizacja wykresów (puste dane)
function initCharts() {
  // Przykład dla Chart.js – wykres słupkowy
  const ctx = document.getElementById("dashboardChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Nowe firmy dzisiaj",
          data: [],
          backgroundColor: "#4169E1"
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Menu nawigacyjne
function setupNavigation() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const section = link.getAttribute("data-section");
      document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
      document.getElementById(section).classList.remove("hidden");
      document.querySelectorAll(".nav-link").forEach(n => n.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

// Inicjalizacja całej aplikacji
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  initDashboard();
});
