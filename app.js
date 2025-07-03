// Emergency Data
// Global variables
let map;
let emergencyData = {
    "universal": {
        "eu_emergency": "112",
        "description": "Universal emergency number across all EU countries - free, 24/7"
    },
    "countries": [],
    "alert_levels": {
        "RED": {
            "color": "#dc2626",
            "description": "Extreme danger - life-threatening conditions"
        },
        "ORANGE": {
            "color": "#ea580c",
            "description": "High risk - dangerous conditions"
        },
        "YELLOW": {
            "color": "#ca8a04",
            "description": "Moderate risk - potentially dangerous"
        },
        "GREEN": {
            "color": "#16a34a",
            "description": "Low risk - normal conditions"
        }
    }
};
let markers = [];
let userLocation = null;
let currentFilter = 'hotlines';
let searchQuery = '';

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const filterButtons = document.querySelectorAll('.filter-btn');
const locationBtn = document.getElementById('location-btn');
const infoContent = document.getElementById('info-content');
const selectedLocation = document.getElementById('selected-location');
const closePanel = document.getElementById('close-panel');
const nearestCenterBtn = document.getElementById('nearest-center-btn');
const offlineIndicator = document.getElementById('offline-indicator');
const connectionStatus = document.getElementById('connection-status');
const installPwaBtn = document.getElementById('install-pwa');
const languageSelector = document.querySelector('.header__language');

// Simple translations
const translations = {
    en: {
        title: 'European Heatwave Emergency',
        alert: 'EXTREME HEATWAVE ALERT',
        alertDesc: 'Europe experiencing 40°C+ temperatures. Emergency services active.',
        call112: '📞 CALL 112',
        myLocation: '📍 My Location',
        selectLocation: 'Select a location',
        welcome: '🌡️ Welcome to European Heatwave Emergency Services',
        welcomeDesc: 'Click on any country marker to view emergency contacts, cooling centers, and vital heatwave information.',
        quickActions: 'Quick Emergency Actions:',
        callEU: '📞 Call EU Emergency: 112',
        findCenter: '🗺️ Find Nearest Cooling Center',
        safetyTips: '🛡️ Heat Safety Tips:',
        tip1: 'Stay indoors during peak heat (11:00-18:00)',
        tip2: 'Drink water frequently, avoid alcohol',
        tip3: 'Wear light-colored, loose clothing',
        tip4: 'Check on elderly relatives and neighbors',
        tip5: 'Never leave children or pets in cars',
        all: 'All Services',
        hotlines: '🔥 Hotlines',
        cooling: '❄️ Cooling Centers',
        hospitals: '🏥 Hospitals',
            },
    fr: {
        title: 'Urgence Canicule Européenne',
        alert: 'ALERTE CANICULE EXTRÊME',
        alertDesc: 'L\'Europe connaît des températures supérieures à 40°C. Services d\'urgence actifs.',
        call112: '📞 APPELER 112',
        myLocation: '📍 Ma position',
        selectLocation: 'Sélectionnez un lieu',
        welcome: '🌡️ Bienvenue sur le service d\'urgence canicule européen',
        welcomeDesc: 'Cliquez sur un marqueur de pays pour voir les contacts d\'urgence, centres de refroidissement et informations vitales.',
        quickActions: 'Actions d\'urgence rapides :',
        callEU: '📞 Appeler l\'urgence UE : 112',
        findCenter: '🗺️ Trouver le centre de refroidissement le plus proche',
        safetyTips: '🛡️ Conseils de sécurité contre la chaleur :',
        tip1: 'Restez à l\'intérieur pendant les heures les plus chaudes (11h00-18h00)',
        tip2: 'Buvez de l\'eau fréquemment, évitez l\'alcool',
        tip3: 'Portez des vêtements clairs et amples',
        tip4: 'Vérifiez les personnes âgées et les voisins',
        tip5: 'Ne laissez jamais d\'enfants ou d\'animaux dans les voitures',
        all: 'Tous les services',
        hotlines: '🔥 Lignes d\'urgence',
        cooling: '❄️ Centres de refroidissement',
        hospitals: '🏥 Hôpitaux',
            },
    es: {
        title: 'Emergencia por Ola de Calor Europea',
        alert: 'ALERTA DE OLA DE CALOR EXTREMA',
        alertDesc: 'Europa experimenta temperaturas superiores a 40°C. Servicios de emergencia activos.',
        call112: '📞 LLAMAR 112',
        myLocation: '📍 Mi ubicación',
        selectLocation: 'Selecciona una ubicación',
        welcome: '🌡️ Bienvenido a los Servicios de Emergencia por Ola de Calor Europea',
        welcomeDesc: 'Haz clic en cualquier marcador de país para ver contactos de emergencia, centros de enfriamiento e información vital.',
        quickActions: 'Acciones de emergencia rápidas:',
        callEU: '📞 Llamar a Emergencia UE: 112',
        findCenter: '🗺️ Buscar el centro de enfriamiento más cercano',
        safetyTips: '🛡️ Consejos de seguridad ante el calor:',
        tip1: 'Permanece en interiores durante el calor máximo (11:00-18:00)',
        tip2: 'Bebe agua frecuentemente, evita el alcohol',
        tip3: 'Usa ropa clara y holgada',
        tip4: 'Revisa a personas mayores y vecinos',
        tip5: 'Nunca dejes niños o mascotas en autos',
        all: 'Todos los servicios',
        hotlines: '🔥 Líneas directas',
        cooling: '❄️ Centros de enfriamiento',
        hospitals: '🏥 Hospitales',
            },
    it: {
        title: 'Emergenza Ondata di Calore Europea',
        alert: 'ALLERTA ONDATA DI CALORE ESTREMA',
        alertDesc: "L'Europa sta vivendo temperature superiori a 40°C. Servizi di emergenza attivi.",
        call112: '📞 CHIAMA 112',
        myLocation: '📍 La mia posizione',
        selectLocation: 'Seleziona una posizione',
        welcome: '🌡️ Benvenuto ai Servizi di Emergenza Ondata di Calore Europea',
        welcomeDesc: 'Clicca su un marcatore paese per vedere i contatti di emergenza, i centri di raffreddamento e le informazioni vitali.',
        quickActions: 'Azioni di emergenza rapide:',
        callEU: '📞 Chiama Emergenza UE: 112',
        findCenter: '🗺️ Trova il centro di raffreddamento più vicino',
        safetyTips: '🛡️ Consigli di sicurezza contro il caldo:',
        tip1: 'Rimani in casa durante le ore più calde (11:00-18:00)',
        tip2: 'Bevi acqua frequentemente, evita l\'alcol',
        tip3: 'Indossa abiti chiari e larghi',
        tip4: 'Controlla anziani e vicini',
        tip5: 'Non lasciare mai bambini o animali in auto',
        all: 'Tutti i servizi',
        hotlines: '🔥 Linee dirette',
        cooling: '❄️ Centri di raffreddamento',
        hospitals: '🏥 Ospedali',
            },
    de: {
        title: 'Europäischer Hitzewellen-Notdienst',
        alert: 'EXTREME HITZEWELLENWARNUNG',
        alertDesc: 'Europa erlebt Temperaturen über 40°C. Notdienste aktiv.',
        call112: '📞 112 ANRUFEN',
        myLocation: '📍 Mein Standort',
        selectLocation: 'Standort auswählen',
        welcome: '🌡️ Willkommen beim europäischen Hitzewellen-Notdienst',
        welcomeDesc: 'Klicken Sie auf eine Landesmarkierung, um Notfallkontakte, Kühlzentren und wichtige Informationen anzuzeigen.',
        quickActions: 'Schnelle Notfallaktionen:',
        callEU: '📞 EU-Notruf: 112',
        findCenter: '🗺️ Nächstgelegenes Kühlzentrum finden',
        safetyTips: '🛡️ Hitzeschutztipps:',
        tip1: 'Bleiben Sie während der größten Hitze (11:00-18:00) drinnen',
        tip2: 'Trinken Sie häufig Wasser, vermeiden Sie Alkohol',
        tip3: 'Tragen Sie helle, lockere Kleidung',
        tip4: 'Überprüfen Sie ältere Menschen und Nachbarn',
        tip5: 'Lassen Sie niemals Kinder oder Haustiere im Auto',
        all: 'Alle Dienste',
        hotlines: '🔥 Hotlines',
        cooling: '❄️ Kühlzentren',
        hospitals: '🏥 Krankenhäuser',
            }
};
let currentLang = 'en';

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            currentLang = e.target.value;
            updateLanguage();
        });
    }
    updateLanguage();
});

function updateLanguage() {
    const t = translations[currentLang] || translations['en'];
    // Header title
    const headerTitle = document.querySelector('.header__title');
    if (headerTitle) headerTitle.textContent = '🌡️ ' + t.title;
    // Emergency banner
    const banner = document.querySelector('.emergency-banner__content');
    if (banner) {
        const strong = banner.querySelector('strong');
        if (strong) strong.textContent = t.alert;
        const span = banner.querySelector('.emergency-banner__text span');
        if (span) span.textContent = t.alertDesc;
        const callBtn = banner.querySelector('.btn--emergency');
        if (callBtn) callBtn.textContent = t.call112;
    }
    // Location button
    if (locationBtn) locationBtn.textContent = t.myLocation;
    // Search placeholder
    if (searchInput) searchInput.placeholder = t['searchPlaceholder'] || 'Search by country, city, or service type...';
    // Filter buttons
    if (filterButtons && filterButtons.length) {
        filterButtons.forEach(btn => {
            const filter = btn.dataset.filter;
            btn.textContent = t[filter] || btn.textContent;
        });
    }
    // Info panel default
    if (selectedLocation) selectedLocation.textContent = t.selectLocation;
    // Info panel welcome message
    if (infoContent && infoContent.querySelector('.welcome-message')) {
        infoContent.querySelector('h3').textContent = t.welcome;
        infoContent.querySelector('p').textContent = t.welcomeDesc;
        // Quick actions
        const quickActions = infoContent.querySelector('.quick-actions');
        if (quickActions) {
            const h4 = quickActions.querySelector('h4');
            if (h4) h4.textContent = t.quickActions;
            const callEU = quickActions.querySelector('.btn--emergency');
            if (callEU) callEU.textContent = t.callEU;
            const findCenter = quickActions.querySelector('.btn--primary');
            if (findCenter) findCenter.textContent = t.findCenter;
        }
        // Safety tips
        const safetyTips = infoContent.querySelector('.heat-safety-tips');
        if (safetyTips) {
            const h4 = safetyTips.querySelector('h4');
            if (h4) h4.textContent = t.safetyTips;
            const tips = safetyTips.querySelectorAll('li');
            if (tips.length >= 5) {
                tips[0].textContent = t.tip1;
                tips[1].textContent = t.tip2;
                tips[2].textContent = t.tip3;
                tips[3].textContent = t.tip4;
                tips[4].textContent = t.tip5;
            }
        }
    }
}

async function initializeApp() {
    try {
        showLoading();
        
        // Initialize map
        initializeMap();
        
        // Load emergency data
        await fetchEmergencyData();
        
        // Populate country suggestions
        populateCountrySuggestions();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize offline functionality
        initializeOffline();
        
        // Initialize PWA
        // initializePWA();

        setActiveFilter('hotlines');
        hideLoading();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        hideLoading();
        showError('Failed to load emergency data. Please refresh the page.');
    }
}

function populateCountrySuggestions() {
    const datalist = document.getElementById('country-suggestions');
    if (!datalist) return;
    datalist.innerHTML = '';
    (emergencyData.countries || []).forEach(country => {
        const name = country.country || country.country_name;
        if (name) {
            const option = document.createElement('option');
            option.value = name;
            datalist.appendChild(option);
        }
    });
}

function initializeMap() {
    // Initialize Leaflet map centered on Europe
    map = L.map('map').setView([54.5260, 15.2551], 4);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add controls
    map.zoomControl.setPosition('bottomright');
}

//Note: here is the magic function for gathering data
async function fetchEmergencyData() {
    const dataFiles = [
        'heatwave_emergency_austria_2025.json',
        'heatwave_emergency_belgium_2025.json',
        'heatwave_emergency_czechia_2025.json',
        'heatwave_emergency_france_2025.json',
        'heatwave_emergency_germany_2025.json',
        'heatwave_emergency_greece_2025.json',
        'heatwave_emergency_italy_2025.json',
        'heatwave_emergency_netherlands_2025.json',
        'heatwave_emergency_poland_2025.json',
        'heatwave_emergency_portugal_2025.json',
        'heatwave_emergency_spain_2025.json',
        'heatwave_emergency_switzerland_2025.json',
        'heatwave_emergency_ireland_2025.json',
        'heatwave_emergency_uk_2025.json',
        'heatwave_emergency_hungary_2025.json',
        'heatwave_emergency_romania_2025.json',
        'heatwave_emergency_denmark_2025.json',
        'heatwave_emergency_sweden_2025.json',
        'heatwave_emergency_norway_2025.json',
        'heatwave_emergency_finland_2025.json',
        'heatwave_emergency_serbia_2025.json',
        'heatwave_emergency_bosnia_2025.json',
        'heatwave_emergency_albania_2025.json',
        'heatwave_emergency_macedonia_2025.json',
        'heatwave_emergency_bulgaria_2025.json',
        'heatwave_emergency_turkey_2025.json',
        'heatwave_emergency_cyprus_2025.json',
        'heatwave_emergency_ukraine_2025.json'
    ];

    try {
        const responses = await Promise.all(
            dataFiles.map(file => fetch(`data/${file}`))
        );
        const data = await Promise.all(
            responses.map(res => res.json())
        );
        emergencyData.countries = data;
        loadEmergencyData();
    } catch (error) {
        console.error('Error fetching emergency data:', error);
        showError('Failed to load emergency data. Please try again later.');
    }
}

function loadEmergencyData() {
    // Clear existing markers
    clearMarkers();

    // Add country markers (hotlines)
    emergencyData.countries.forEach(country => {
        addCountryMarker(country, false); // false: do not add to map yet
    });

    // Add cooling center markers
    emergencyData.countries.forEach(country => {
        (country.cooling_centers || []).forEach(center => {
            addCoolingCenterMarker(center, country, false);
        });
    });

    // Add hospital markers
    emergencyData.countries.forEach(country => {
        (country.hospitals || []).forEach(hospital => {
            addHospitalMarker(hospital, country, false);
        });
    });

    // Add health service markers (only if lat/lng present)
    emergencyData.countries.forEach(country => {
        (country.health_services || []).forEach(service => {
            if (service.latitude && service.longitude) {
                addHealthServiceMarker(service, country, false);
            }
        });
    });

    // Only show hotlines on initial load
    filterMarkers();
}

// Update marker-adding functions to accept a 'showOnMap' argument
function addCountryMarker(country, showOnMap = true) {
    // Use alert_level from current_status
    const alertLevel = country.current_status?.alert_level;
    const color = emergencyData.alert_levels[alertLevel]?.color || '#888';
    
    // Use the coordinates of the first cooling center as the country marker location
    const coordinates = (country.cooling_centers && country.cooling_centers.length > 0 && country.cooling_centers[0].latitude && country.cooling_centers[0].longitude)
        ? [country.cooling_centers[0].latitude, country.cooling_centers[0].longitude]
        : [0, 0];

    const marker = L.circleMarker(coordinates, {
        radius: 15,
        fillColor: color,
        color: '#fff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.8
    });
    if (showOnMap) marker.addTo(map);
    
    // Create popup content
    const popupContent = createCountryPopup(country);
    marker.bindPopup(popupContent, { maxWidth: 300 });
    
    // Add click event
    marker.on('click', () => {
        displayCountryInfo(country);
    });
    
    markers.push({ marker, type: 'country', data: country });
}

function addCoolingCenterMarker(center, country, showOnMap = true) {
    // Use latitude/longitude directly from center
    const marker = L.marker([center.latitude, center.longitude], {
        icon: L.divIcon({
            className: 'cooling-center-marker',
            html: '❄️',
            iconSize: [20, 20]
        })
    });
    if (showOnMap) marker.addTo(map);
    
    const popupContent = createCoolingCenterPopup(center, country);
    marker.bindPopup(popupContent, { maxWidth: 250 });
    
    marker.on('click', () => {
        displayCoolingCenterInfo(center, country);
    });
    
    markers.push({ marker, type: 'cooling_center', data: center, country });
}

function addHospitalMarker(hospital, country, showOnMap = true) {
    const marker = L.marker([hospital.latitude, hospital.longitude], {
        icon: L.divIcon({
            className: 'hospital-marker',
            html: '🏥',
            iconSize: [22, 22]
        })
    });
    if (showOnMap) marker.addTo(map);
    const popupContent = createHospitalPopup(hospital, country);
    marker.bindPopup(popupContent, { maxWidth: 260 });
    marker.on('click', () => {
        displayHospitalInfo(hospital, country);
    });
    markers.push({ marker, type: 'hospital', data: hospital, country });
}

function addHealthServiceMarker(service, country, showOnMap = true) {
    // For demo, use a stethoscope emoji as marker
    if (!service.latitude || !service.longitude) return; // Only plot if coordinates exist
    const marker = L.marker([service.latitude, service.longitude], {
        icon: L.divIcon({
            className: 'health-service-marker',
            html: '🩺',
            iconSize: [20, 20]
        })
    });
    if (showOnMap) marker.addTo(map);
    const popupContent = createHealthServicePopup(service, country);
    marker.bindPopup(popupContent, { maxWidth: 250 });
    marker.on('click', () => {
        displayHealthServiceInfo(service, country);
    });
    markers.push({ marker, type: 'health_service', data: service, country });
}

function createCountryPopup(country) {
    const alertLevel = country.current_status?.alert_level;
    const alertColor = emergencyData.alert_levels[alertLevel]?.color || '#888';
    const maxTemp = country.current_status?.peak_temperature || '-';
    const maxTempLocation = country.current_status?.affected_regions || '-';
    return `
        <div class="popup-content">
            <div class="popup-header">
                <strong>${country.country}</strong>
                <span class="popup-alert" style="background: ${alertColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px;">
                    ${alertLevel ? alertLevel.toUpperCase() : ''}
                </span>
            </div>
            <p style="margin: 8px 0; font-size: 12px; color: #666;">Max Temp: ${maxTemp} in ${maxTempLocation}</p>
            <div class="popup-actions">
                <a href="tel:112" style="background: #dc2626; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; margin-right: 8px;">📞 Call 112</a>
                <button onclick="displayCountryInfo(emergencyData.countries.find(c => c.country_code === '${country.country_code}'))" style="background: #2563eb; color: white; padding: 6px 12px; border-radius: 6px; border: none; font-size: 12px; cursor: pointer;">View Details</button>
            </div>
        </div>
    `;
}

function createCoolingCenterPopup(center, country) {
    // Use address as a string, fallback if not present
    const address = center.address || '-';
    const hours = center.operating_hours || '-';
    return `
        <div class="popup-content">
            <div class="popup-header">
                <span>❄️</span>
                <strong style="font-size: 13px;">${center.name}</strong>
            </div>
            <p style="margin: 6px 0; font-size: 11px; color: #666;">${center.type}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Hours:</strong> ${hours}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Address:</strong> ${address}</p>
            <div class="popup-actions">
                <button onclick="getDirections(${center.latitude}, ${center.longitude})" style="background: #059669; color: white; padding: 4px 8px; border-radius: 4px; border: none; font-size: 11px; cursor: pointer;">🗺️ Directions</button>
            </div>
        </div>
    `;
}

function createHospitalPopup(hospital, country) {
    return `
        <div class="popup-content">
            <div class="popup-header">
                <span>🏥</span>
                <strong style="font-size: 13px;">${hospital.name}</strong>
            </div>
            <p style="margin: 6px 0; font-size: 11px; color: #666;">${hospital.address}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Service:</strong> ${hospital.service_level || '-'}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Availability:</strong> ${hospital.availability || '-'}</p>
            <div class="popup-actions">
                <a href="tel:${hospital.contact}" style="background: #dc2626; color: white; padding: 4px 8px; border-radius: 4px; text-decoration: none; font-size: 11px;">📞 Call</a>
            </div>
        </div>
    `;
}

function createHealthServicePopup(service, country) {
    return `
        <div class="popup-content">
            <div class="popup-header">
                <span>🩺</span>
                <strong style="font-size: 13px;">${service.name}</strong>
            </div>
            <p style="margin: 6px 0; font-size: 11px; color: #666;">${service.description || ''}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Contact:</strong> ${service.contact || '-'}</p>
            <p style="margin: 6px 0; font-size: 11px;"><strong>Available:</strong> ${service.available || '-'}</p>
        </div>
    `;
}

function isPhoneNumber(value) {
    // Accepts numbers with 3 or more digits, possibly with spaces, and optional leading +
    return typeof value === 'string' && /^[+]?\d[\d\s().-]{2,}$/.test(value.trim());
}
function isEmail(value) {
    return typeof value === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim());
}
function isWebsite(value) {
    return typeof value === 'string' && /^(https?:\/\/|www\.)/.test(value.trim());
}

function displayCountryInfo(country) {
    const alertLevel = country.current_status?.alert_level;
    const alertColor = emergencyData.alert_levels[alertLevel]?.color || '#888';
    const maxTemp = country.current_status?.peak_temperature || '-';
    const maxTempLocation = country.current_status?.affected_regions || '-';
    selectedLocation.textContent = `${country.country}`;
    infoContent.innerHTML = `
        <div class="country-info">
            <div class="country-header">
                <h3 class="country-name">${country.country}</h3>
            </div>
            <div class="alert-status alert-status--${alertLevel}">
                <span>🚨</span>
                <span>${alertLevel ? alertLevel.toUpperCase() : ''} ALERT</span>
            </div>
            <p style="color: var(--color-text-secondary); margin-bottom: 20px; font-size: 14px;">Max Temp: ${maxTemp} in ${maxTempLocation}</p>
            <div class="emergency-numbers">
                <h4>🚨 Emergency Contacts</h4>
                ${(country.emergency_contacts || []).map(contact => {
                    let actionBtn = '';
                    if (isPhoneNumber(contact.number)) {
                        actionBtn = `<a href="tel:${contact.number}" class="btn btn--sm btn--emergency">📞 ${contact.number}</a>`;
                    } else if (isEmail(contact.number)) {
                        actionBtn = `<a href="mailto:${contact.number}" class="btn btn--sm btn--primary">✉️ Email</a>`;
                    } else if (isWebsite(contact.number)) {
                        actionBtn = `<a href="${contact.number}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">🌐 Website</a>`;
                    }
                    return `
                    <div class="emergency-number card">
                        <div class="card__header">
                            <strong>${contact.name}</strong>
                        </div>
                        <div class="card__body">
                            <span>${contact.description || ''}</span>
                        </div>
                        <div class="card__footer">
                            ${actionBtn}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            <div class="cooling-centers">
                <h4>❄️ Cooling Centers & Refuges</h4>
                ${(country.cooling_centers || []).map(center => `
                    <div class="cooling-center card">
                        <div class="card__header">
                            <h5>${center.name}</h5>
                            <span class="cooling-center-type">${center.type}</span>
                        </div>
                        <div class="card__body">
                            <p>${center.address}</p>
                            <div class="cooling-center-hours">🕒 ${center.operating_hours}</div>
                            <div class="amenities">
                                ${(center.amenities || []).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                            </div>
                        </div>
                        <div class="card__footer">
                            <button onclick="getDirections(${center.latitude}, ${center.longitude})" class="btn btn--sm btn--primary">🗺️ Get Directions</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="hospitals">
                <h4>🏥 Hospitals</h4>
                ${(country.hospitals || []).map(hospital => {
                    let actionBtn = '';
                    if (isPhoneNumber(hospital.contact)) {
                        actionBtn = `<a href="tel:${hospital.contact}" class="btn btn--sm btn--emergency">📞 Call</a>`;
                    } else if (isEmail(hospital.contact)) {
                        actionBtn = `<a href="mailto:${hospital.contact}" class="btn btn--sm btn--primary">✉️ Email</a>`;
                    } else if (isWebsite(hospital.contact)) {
                        actionBtn = `<a href="${hospital.contact}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">🌐 Website</a>`;
                    }
                    return `
                    <div class="hospital-center card">
                        <div class="card__header">
                            <h5>${hospital.name}</h5>
                            <span class="hospital-type">${hospital.service_level || ''}</span>
                        </div>
                        <div class="card__body">
                            <p>${hospital.address}</p>
                            <div class="hospital-availability">🕒 ${hospital.availability || '-'}</div>
                            <div class="hospital-notes">${hospital.notes || ''}</div>
                        </div>
                        <div class="card__footer">
                            ${actionBtn}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            <div class="health-services">
                <h4>🩺 Health Services</h4>
                ${(country.health_services || []).map(service => {
                    let actionBtn = '';
                    if (isPhoneNumber(service.contact)) {
                        actionBtn = `<a href="tel:${service.contact}" class="btn btn--sm btn--emergency">📞 Call</a>`;
                    } else if (isEmail(service.contact)) {
                        actionBtn = `<a href="mailto:${service.contact}" class="btn btn--sm btn--primary">✉️ Email</a>`;
                    } else if (isWebsite(service.contact)) {
                        actionBtn = `<a href="${service.contact}" target="_blank" rel="noopener" class="btn btn--sm btn--primary">🌐 Website</a>`;
                    }
                    return `
                    <div class="health-service card">
                        <div class="card__header">
                            <h5>${service.name}</h5>
                            <span class="health-service-type">${service.service_type || ''}</span>
                        </div>
                        <div class="card__body">
                            <p>${service.description || ''}</p>
                            <div class="health-service-availability">🕒 ${service.available || '-'}</div>
                            <div class="health-service-contact">${service.contact || ''}</div>
                        </div>
                        <div class="card__footer">
                            ${actionBtn}
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function displayCoolingCenterInfo(center, country) {
    selectedLocation.textContent = `❄️ ${center.name}`;
    const address = center.address || '-';
    const hours = center.operating_hours || '-';
    infoContent.innerHTML = `
        <div class="cooling-center-detail">
            <div class="center-header">
                <h3>${center.name}</h3>
                <span class="cooling-center-type">${center.type}</span>
            </div>
            <div class="center-info">
                <p><strong>📍 Address:</strong> ${address}</p>
                <p><strong>🕒 Hours:</strong> ${hours}</p>
                <p><strong>🏛️ Country:</strong> ${country.country}</p>
            </div>
            <div class="amenities">
                <h4>✨ Available Amenities</h4>
                <div class="amenities">
                    ${(center.amenities || []).map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
            </div>
            <div class="center-actions" style="margin-top: 20px;">
                <button onclick="getDirections(${center.latitude}, ${center.longitude})" class="btn btn--primary btn--full-width">
                    🗺️ Get Directions
                </button>
                <a href="tel:112" class="btn btn--emergency btn--full-width" style="margin-top: 8px;">
                    📞 Emergency: 112
                </a>
            </div>
        </div>
    `;
}

function displayHospitalInfo(hospital, country) {
    selectedLocation.textContent = `🏥 ${hospital.name}`;
    infoContent.innerHTML = `
        <div class="hospital-detail">
            <div class="center-header">
                <h3>${hospital.name}</h3>
                <span class="cooling-center-type">${hospital.service_level || ''}</span>
            </div>
            <div class="center-info">
                <p><strong>📍 Address:</strong> ${hospital.address}</p>
                <p><strong>🏛️ Country:</strong> ${country.country}</p>
                <p><strong>Availability:</strong> ${hospital.availability || '-'}</p>
                <p><strong>Notes:</strong> ${hospital.notes || '-'}</p>
            </div>
            <div class="center-actions" style="margin-top: 20px;">
                <a href="tel:${hospital.contact}" class="btn btn--emergency btn--full-width">
                    📞 Call Hospital
                </a>
            </div>
        </div>
    `;
}

function displayHealthServiceInfo(service, country) {
    selectedLocation.textContent = `🩺 ${service.name}`;
    infoContent.innerHTML = `
        <div class="health-service-detail">
            <div class="center-header">
                <h3>${service.name}</h3>
                <span class="cooling-center-type">${service.service_type || ''}</span>
            </div>
            <div class="center-info">
                <p><strong>Description:</strong> ${service.description || '-'}</p>
                <p><strong>Contact:</strong> ${service.contact || '-'}</p>
                <p><strong>Available:</strong> ${service.available || '-'}</p>
                <p><strong>🏛️ Country:</strong> ${country.country}</p>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    searchClear.addEventListener('click', clearSearch);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            setActiveFilter(filter);
        });
    });
    
    // Location button
    locationBtn.addEventListener('click', getCurrentLocation);
    
    // Close panel button
    closePanel.addEventListener('click', () => {
        selectedLocation.textContent = 'Select a location';
        infoContent.innerHTML = `
            <div class="welcome-message">
                <h3>🌡️ Welcome to European Heatwave Emergency Services</h3>
                <p>Click on any country marker to view emergency contacts, cooling centers, and vital heatwave information.</p>
                
                <div class="quick-actions">
                    <h4>Quick Emergency Actions:</h4>
                    <a href="tel:112" class="btn btn--emergency btn--full-width">📞 Call EU Emergency: 112</a>
                    <button class="btn btn--primary btn--full-width" id="nearest-center-btn">
                        🗺️ Find Nearest Cooling Center
                    </button>
                </div>
                
                <div class="heat-safety-tips">
                    <h4>🛡️ Heat Safety Tips:</h4>
                    <ul>
                        <li>Stay indoors during peak heat (11:00-18:00)</li>
                        <li>Drink water frequently, avoid alcohol</li>
                        <li>Wear light-colored, loose clothing</li>
                        <li>Check on elderly relatives and neighbors</li>
                        <li>Never leave children or pets in cars</li>
                    </ul>
                </div>
            </div>
        `;
        // Add event listener for dynamically injected button
        const newNearestBtn = document.getElementById('nearest-center-btn');
        if (newNearestBtn) {
            newNearestBtn.addEventListener('click', findNearestCoolingCenter);
        }
    });
    
    // Nearest center button (if present at initial load)
    if (nearestCenterBtn) {
        nearestCenterBtn.addEventListener('click', findNearestCoolingCenter);
    }
}

function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    filterMarkers();
    
    // Show/hide clear button
    searchClear.style.display = searchQuery ? 'block' : 'none';
}

function clearSearch() {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    filterMarkers();
}

function setActiveFilter(filter) {
    currentFilter = filter;
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    filterMarkers();
}

function filterMarkers() {
    markers.forEach(({ marker, type, data, country }) => {
        // Remove marker from map first
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
        // Determine if marker should be shown
        let show = false;
        if (currentFilter === 'all') {
            show = true;
        } else if (currentFilter === 'hotlines' && type === 'country') {
            show = true;
        } else if (currentFilter === 'cooling' && type === 'cooling_center') {
            show = true;
        } else if (currentFilter === 'hospitals' && type === 'hospital') {
            show = true;
        }
        // Also filter by country name if searchQuery is set
        if (show && searchQuery) {
            let countryName = country ? country.country : (data.country || '');
            if (!countryName.toLowerCase().includes(searchQuery)) {
                show = false;
            }
        }
        if (show) {
            marker.addTo(map);
        }
    });
}

function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser');
        return;
    }
    
    locationBtn.textContent = '📍 Getting location...';
    locationBtn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = [position.coords.latitude, position.coords.longitude];
            
            // Add user location marker
            if (window.userMarker) {
                map.removeLayer(window.userMarker);
            }
            
            window.userMarker = L.marker(userLocation, {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '📍',
                    iconSize: [25, 25]
                })
            }).addTo(map);
            
            window.userMarker.bindPopup('Your location').openPopup();
            
            // Pan to user location
            map.setView(userLocation, 10);
            
            locationBtn.textContent = '📍 My Location';
            locationBtn.disabled = false;
        },
        (error) => {
            console.error('Geolocation error:', error);
            showError('Unable to get your location');
            locationBtn.textContent = '📍 My Location';
            locationBtn.disabled = false;
        }
    );
}

//Hmm this function is useless for now, but it will be useful later
function findNearestCoolingCenter() {
    if (!userLocation) {
        getCurrentLocation();
        return;
    }
    
    let nearestCenter = null;
    let minDistance = Infinity;
    let nearestCountry = null;
    
    emergencyData.countries.forEach(country => {
        if (country.cooling_centers) {
            country.cooling_centers.forEach(center => {
                const centerCoordinates = [center.coordinates.latitude, center.coordinates.longitude];
                const distance = calculateDistance(userLocation, centerCoordinates);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCenter = center;
                    nearestCountry = country;
                }
            });
        }
    });
    
    if (nearestCenter) {
        map.setView([nearestCenter.coordinates.latitude, nearestCenter.coordinates.longitude], 15);
        displayCoolingCenterInfo(nearestCenter, nearestCountry);
    } else {
        showError('No cooling centers found');
    }
}

function calculateDistance(pos1, pos2) {
    const R = 6371; // Earth's radius in km
    const dLat = (pos2[0] - pos1[0]) * Math.PI / 180;
    const dLon = (pos2[1] - pos1[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(pos1[0] * Math.PI / 180) * Math.cos(pos2[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function getDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

function initializeOffline() {
    // Register service worker for offline functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed', err));
    }
    
    // Monitor online/offline status
    function updateConnectionStatus() {
        const isOnline = navigator.onLine;
        connectionStatus.textContent = isOnline ? 'Online' : 'Offline';
        offlineIndicator.classList.toggle('offline', !isOnline);
    }
    
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    updateConnectionStatus();
}

/* In the future this can be used to initialize PWA features like install prompt
function initializePWA() {
    // PWA install prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installPwaBtn.style.display = 'block';
    });
    
    installPwaBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            installPwaBtn.style.display = 'none';
        }
    });
}
*/

function clearMarkers() {
    markers.forEach(({ marker }) => {
        map.removeLayer(marker);
    });
    markers = [];
}

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

function showError(message) {
    // Simple error display - could be enhanced with a proper modal
    alert(`Error: ${message}`);
}

// Make functions globally available for onclick handlers
window.displayCountryInfo = displayCountryInfo;
window.getDirections = getDirections;