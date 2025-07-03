# JSON Schema Documentation for European Heatwave Emergency Project

## Overview
This document defines the required structure and content for JSON files used in the European Heatwave Emergency Services website. Each JSON file represents emergency information for a specific European country during heatwave conditions.

## File Naming Convention
```
heatwave_emergency_{country_code}_2025.json
```
Examples:
- `heatwave_emergency_france_2025.json`
- `heatwave_emergency_italy_2025.json`
- `heatwave_emergency_spain_2025.json`

## JSON Schema Structure

### Root Level Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `country_code` | string | ✅ | ISO 3166-1 alpha-2 country code (e.g., "FR", "IT", "ES") |
| `country_name` | string | ✅ | Full country name in English |
| `country_name_local` | string | ✅ | Country name in local language |
| `alert_level` | string | ✅ | Current heatwave alert level: "RED", "ORANGE", "YELLOW", or "GREEN" |
| `last_updated` | string | ✅ | ISO 8601 timestamp of last data update |
| `current_temperature` | object | ✅ | Current temperature information |
| `emergency_contacts` | array | ✅ | Array of emergency contact objects |
| `cooling_centers` | array | ✅ | Array of cooling center location objects |
| `health_advice` | object | ❌ | Health recommendations and advice |
| `sources` | array | ✅ | Array of source URL objects for verification |

### Current Temperature Object
```json
{
  "max_temp_celsius": 41.2,
  "max_temp_location": "Paris",
  "forecast_peak": "42.0",
  "duration": "June 28 - July 5, 2025",
  "affected_regions": ["Île-de-France", "Provence-Alpes-Côte d'Azur"]
}
```

### Emergency Contacts Array
Each emergency contact object must contain:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the contact |
| `type` | string | ✅ | Contact type: "universal_emergency", "heatwave_hotline", "medical_emergency", "fire_emergency" |
| `name` | string | ✅ | Service name in English |
| `name_local` | string | ✅ | Service name in local language |
| `phone_number` | string | ✅ | Phone number in international format |
| `phone_local` | string | ✅ | Phone number in local format |
| `operating_hours` | string | ✅ | Service availability (e.g., "24/7", "8:00-19:00 daily") |
| `languages` | array | ✅ | Array of supported language codes |
| `description` | string | ✅ | Service description |
| `cost` | string | ✅ | Cost information ("free", "standard_rate", etc.) |

#### Example Emergency Contact:
```json
{
  "id": "france_canicule_hotline",
  "type": "heatwave_hotline",
  "name": "Canicule Info Service",
  "name_local": "Service d'Information Canicule",
  "phone_number": "+33-800-06-66-66",
  "phone_local": "0800 06 66 66",
  "operating_hours": "8:00-19:00 daily",
  "languages": ["fr", "en"],
  "description": "Free heatwave information and advice hotline",
  "cost": "free"
}
```

### Cooling Centers Array
Each cooling center object must contain:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the location |
| `name` | string | ✅ | Facility name |
| `type` | string | ✅ | Facility type: "public_building", "shopping_center", "library", "museum", "swimming_pool", "park" |
| `address` | object | ✅ | Complete address information |
| `coordinates` | object | ✅ | GPS coordinates for mapping |
| `contact` | object | ✅ | Contact information |
| `operating_hours` | object | ✅ | Operating schedule |
| `amenities` | array | ✅ | Available amenities |
| `accessibility` | object | ✅ | Accessibility information |
| `capacity` | string | ❌ | Maximum capacity if known |
| `target_population` | array | ❌ | Target groups (e.g., "elderly", "families", "general_public") |

#### Address Object:
```json
{
  "street": "1 Place du Châtelet",
  "city": "Paris",
  "postal_code": "75001",
  "region": "Île-de-France",
  "country": "France"
}
```

#### Coordinates Object:
```json
{
  "latitude": 48.8584,
  "longitude": 2.3470
}
```

#### Contact Object:
```json
{
  "phone": "+33-1-44-76-63-00",
  "email": "info@forumdeshalles.com",
  "website": "https://www.forumdeshalles.com"
}
```

#### Operating Hours Object:
```json
{
  "monday": "10:00-20:00",
  "tuesday": "10:00-20:00",
  "wednesday": "10:00-20:00",
  "thursday": "10:00-20:00",
  "friday": "10:00-20:00",
  "saturday": "10:00-20:00",
  "sunday": "11:00-19:00",
  "emergency_hours": "24/7 during red alert",
  "notes": "Extended hours during heatwave alerts"
}
```

#### Amenities Array:
Available amenities should include:
- `"air_conditioning"` - Air conditioning available
- `"free_wifi"` - Free WiFi access
- `"drinking_water"` - Free drinking water
- `"restrooms"` - Public restrooms
- `"food_available"` - Food/beverages for purchase
- `"parking"` - Parking available
- `"public_transport"` - Public transport accessible
- `"charging_stations"` - Phone/device charging
- `"medical_assistance"` - Medical help available
- `"pet_friendly"` - Pets allowed

#### Accessibility Object:
```json
{
  "wheelchair_accessible": true,
  "elevator_access": true,
  "accessible_restrooms": true,
  "sign_language": false,
  "audio_assistance": true
}
```

### Health Advice Object (Optional)
```json
{
  "general_advice": [
    "Stay hydrated by drinking water regularly",
    "Avoid outdoor activities during peak hours (11:00-18:00)",
    "Wear light-colored, loose-fitting clothing"
  ],
  "warning_signs": [
    "Excessive thirst",
    "Nausea or vomiting",
    "Confusion or dizziness",
    "High body temperature"
  ],
  "vulnerable_groups": ["elderly", "children", "pregnant_women", "chronic_illness"]
}
```

### Sources Array
Each source object must contain:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | string | ✅ | Source type: "government", "health_ministry", "meteorological", "municipal" |
| `name` | string | ✅ | Organization name |
| `url` | string | ✅ | Direct URL to the information source |
| `accessed_date` | string | ✅ | ISO 8601 date when information was verified |
| `language` | string | ✅ | Language of the source content |

#### Example Source:
```json
{
  "type": "health_ministry",
  "name": "Ministère de la Santé et de la Prévention",
  "url": "https://www.santepubliquefrance.fr/determinants-de-sante/climat/fortes-chaleurs-canicule",
  "accessed_date": "2025-07-02T00:00:00Z",
  "language": "fr"
}
```

## Validation Requirements

### Data Quality Standards
1. **Phone Numbers**: Must be provided in both international (+XX-XXX-XXX-XXX) and local formats
2. **GPS Coordinates**: Must be decimal degrees with minimum 4 decimal places for accuracy
3. **URLs**: All source URLs must be HTTPS and accessible
4. **Timestamps**: All dates must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
5. **Languages**: Use ISO 639-1 two-letter language codes

### Required Verification
- All emergency phone numbers must be verified as functional
- All cooling center addresses must be verified with current operating status
- All source URLs must be accessible and contain the referenced information
- GPS coordinates must be validated against actual facility locations

## File Size Guidelines
- Target file size: 3-5 KB per country
- Maximum file size: 10 KB per country
- Optimize by removing unnecessary whitespace and comments

## Integration with Website
The JSON structure is designed to work seamlessly with the Leaflet.js mapping interface:
- `coordinates` object maps directly to L.marker() parameters
- `type` fields enable filtering and custom marker icons
- `operating_hours` enables real-time availability checking
- `amenities` array powers search and filter functionality

## Example Complete JSON Structure
```json
{
  "country_code": "FR",
  "country_name": "France",
  "country_name_local": "France",
  "alert_level": "RED",
  "last_updated": "2025-07-02T00:00:00Z",
  "current_temperature": {
    "max_temp_celsius": 41.2,
    "max_temp_location": "Paris",
    "forecast_peak": "42.0",
    "duration": "June 28 - July 5, 2025",
    "affected_regions": ["Île-de-France", "Provence-Alpes-Côte d'Azur"]
  },
  "emergency_contacts": [
    {
      "id": "france_universal_emergency",
      "type": "universal_emergency",
      "name": "European Emergency Number",
      "name_local": "Numéro d'Urgence Européen",
      "phone_number": "+33-112",
      "phone_local": "112",
      "operating_hours": "24/7",
      "languages": ["fr", "en", "de", "es"],
      "description": "Universal emergency number for all EU countries",
      "cost": "free"
    }
  ],
  "cooling_centers": [
    {
      "id": "paris_forum_des_halles",
      "name": "Forum des Halles",
      "type": "shopping_center",
      "address": {
        "street": "101 Porte Berger",
        "city": "Paris",
        "postal_code": "75001",
        "region": "Île-de-France",
        "country": "France"
      },
      "coordinates": {
        "latitude": 48.8606,
        "longitude": 2.3421
      },
      "contact": {
        "phone": "+33-1-44-76-96-56",
        "email": "contact@forumdeshalles.com",
        "website": "https://www.forumdeshalles.com"
      },
      "operating_hours": {
        "monday": "10:00-20:00",
        "tuesday": "10:00-20:00",
        "wednesday": "10:00-20:00",
        "thursday": "10:00-20:00",
        "friday": "10:00-20:00",
        "saturday": "10:00-20:00",
        "sunday": "11:00-19:00",
        "emergency_hours": "Extended during alerts",
        "notes": "Main shopping area with extensive AC"
      },
      "amenities": [
        "air_conditioning",
        "free_wifi",
        "drinking_water",
        "restrooms",
        "food_available",
        "public_transport"
      ],
      "accessibility": {
        "wheelchair_accessible": true,
        "elevator_access": true,
        "accessible_restrooms": true,
        "sign_language": false,
        "audio_assistance": false
      }
    }
  ],
  "sources": [
    {
      "type": "government",
      "name": "Ministère de la Santé et de la Prévention",
      "url": "https://www.santepubliquefrance.fr/determinants-de-sante/climat/fortes-chaleurs-canicule",
      "accessed_date": "2025-07-02T00:00:00Z",
      "language": "fr"
    }
  ]
}
```

## Best Practices
1. **Keep emergency contacts at the top** of the JSON structure for quick access
2. **Prioritize 24/7 services** in the emergency_contacts array
3. **Include multiple cooling centers per major city** to provide options
4. **Verify all information** against official sources within 24 hours of file creation
5. **Test all phone numbers** to ensure they connect correctly
6. **Update alert levels** daily during heatwave periods

This schema ensures your JSON files will integrate perfectly with the emergency heatwave website while providing comprehensive, life-saving information during crisis conditions.