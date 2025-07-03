# 🌡️ European Heatwave Emergency Services 2025

An simple web application providing emergency information, cooling centers, and health services during the 2025 European heatwave crisis.

Note: this a static website (it does not contain real-time data)

## 🚨 Purpose

This project aggregates emergency information across European countries experiencing extreme heat conditions (40°C+), helping citizens quickly find:
- Emergency hotlines and contacts
- Cooling centers and public refuges
- Hospitals with heatwave capacity
- Health services and advice

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Mapping**: Leaflet.js with OpenStreetMap
- **PWA**: Service Worker for offline functionality [not that useful at the moment]
- **Data**: JSON-based country information

## 📁 Project Structure

```
├── index.html          # Main application page
├── app.js             # Core application logic
├── style.css          # Styling
├── sw.js              # Service worker for offline support
├── data/              # Country-specific emergency data
│   ├── heatwave_emergency_[country]_2025.json
��   └── json_instructions.md
└── LICENSE            # MIT License
```

## 🤝 Contributing

We welcome contributions to help people during this crisis! Here's how you can help:

### 1. Update Emergency Data

- Navigate to the `data/` folder
- Find or create a country JSON file following the existing format [!json_instructions.md]
- Update with verified emergency contacts, cooling centers, and hospitals
- Include sources for all information

### 2. Add New Features

Priority areas:
- Real-time temperature data integration
- Multi-language support expansion
- Accessibility improvements
- Mobile app development

### 3. Report Issues

Found incorrect information or bugs? Please open an issue with:
- Country/location affected
- Description of the problem
- Source for correct information (if applicable)

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/BarrileteChapin/Heatwave-Information-2025.git
   ```

2. Open `index.html` in a web browser or serve locally:
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

3. The app works offline once loaded thanks to the service worker.

## 📝 Data Format

Each country file should follow this structure:
```json
{
  "country": "Country Name",
  "country_code": "XX",
  "current_status": {
    "alert_level": "RED|ORANGE|YELLOW",
    "peak_temperature": "XX°C"
  },
  "emergency_contacts": [...],
  "cooling_centers": [...],
  "hospitals": [...],
  "sources": [...]
}
```

See `data/json_instructions.md` for detailed specifications.

## ⚖️ License

MIT License - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- Data compiled from official sources, news outlets, and government websites
- Built by the community for the community during the July 2025 heatwave crisis

---

**⚠️ Disclaimer**: This is an unofficial compilation of publicly available information. Always verify with official sources. In emergencies, call 112.