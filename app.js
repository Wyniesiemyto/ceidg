// Główne dane aplikacji
const appData = {
  companies: [],
  statistics: {
    total: 0,
    with_email: 0,
    with_phone: 0,
    today: 0,
    yesterday: 0,
    weekly: 0
  },
  config: {
    api_key: "",
    api_endpoint: "https://datastore.ceidg.gov.pl/CEIDG.DataStore/Services/NewDataStoreProvider.svc",
    require_email: true,
    require_phone: false,
    auto_backup: true,
    scraping_interval: "daily",
    email_notifications: false
  }
};

// Inicjalizacja Dashboard
function initDashboard() {
  updateStatisticsDisplay();
  initCharts();
}

// Aktualizacja statystyk na Dashboardzie
function updateStatisticsDisplay() {
  document.getElementById("stat-total").textContent = appData.statistics.total;
  document.getElementById("stat-email").textContent = appData.statistics.with_email;
  document.getElementById("stat-phone").textContent = appData.statistics.with_phone;
  document.getElementById("stat-today").textContent = appData.statistics.today;
}

// Inicjalizacja wykresów (Chart.js, puste dane)
function initCharts() {
  const ctx = document.getElementById("dashboardChart")?.getContext("2d");
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: { labels: [], datasets: [{ label: "Nowe firmy dzisiaj", data: [], backgroundColor: "#4169E1" }] },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

// Obsługa nawigacji i responsywnego menu
function setupNavigation() {
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      // Aktywna zakładka
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      // Pokaż tylko odpowiednią sekcję
      const target = link.getAttribute("data-section");
      sections.forEach(sec => {
        if (sec.id === target) sec.classList.remove("hidden");
        else sec.classList.add("hidden");
      });
      // Jeśli mobile: zamknij sidebar
      if (window.innerWidth < 768) {
        document.getElementById("sidebar").classList.add("collapsed");
      }
    });
  });
  // Hamburger toggle
  document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });
}

// Init po załadowaniu dokumentu
document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  initDashboard();
});
