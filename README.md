# annual-highs

A React application that fetches historical daily high temperature data for zip code 97212 (Portland, OR) using the Open-Meteo free API.

## Features

- Fetches historical weather data for each day of last year
- Displays daily high temperatures in a table format
- Clean, modern UI built with React and Vite
- Uses Open-Meteo's free API (no API key required)

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/kdv24/annual-highs.git
cd annual-highs
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

3. Click "Fetch Historical Temperature Data" to retrieve historical high temperatures for each day of last year

## Data Source

This application uses the [Open-Meteo API](https://open-meteo.com/), a free and open-source weather API that provides:
- Historical weather data
- No API key required
- No rate limits for reasonable use
- High-quality data from national weather services

The app fetches daily maximum temperatures for Portland, OR (coordinates: 45.5372°N, 122.6508°W) for the previous calendar year.

## Build for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- React 19
- Vite 7
- JavaScript (ES6+)
- Open-Meteo API (Free)

## API Details

This application uses the Open-Meteo Archive API endpoint:
- **Endpoint:** `https://archive-api.open-meteo.com/v1/archive`
- **Parameters:**
  - `latitude`: Latitude of the location (45.5372 for Portland, OR)
  - `longitude`: Longitude of the location (-122.6508 for Portland, OR)
  - `start_date`: Start date in YYYY-MM-DD format (January 1st of last year)
  - `end_date`: End date in YYYY-MM-DD format (December 31st of last year)
  - `daily`: Daily weather variable (temperature_2m_max for daily maximum temperature)
  - `temperature_unit`: fahrenheit
  - `timezone`: America/Los_Angeles
- **Free Tier:** No API key required, no rate limits for reasonable use

## Example Response

The app processes Open-Meteo's historical data to extract daily high temperatures for the entire previous year (365 or 366 days).

## Troubleshooting

### npm install Issues

If you encounter permission errors or cache-related errors during `npm install`, such as:
```
npm error EACCES: permission denied
npm error code EEXIST
```

Try the following solutions in order:

1. **Clear the npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **If that doesn't work, verify and fix cache permissions:**
   ```bash
   npm cache verify
   ```

3. **Remove node_modules and package-lock.json, then reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **On macOS/Linux, if permission issues persist, fix npm cache permissions:**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

5. **As a last resort, use the --force flag:**
   ```bash
   npm install --force
   ```

**Note:** If you continue to experience issues, ensure you have the correct Node.js version (v20 or higher) and npm version (v10 or higher).

### API Issues

- **Network errors:** Ensure you have an active internet connection
- **CORS errors:** This app makes direct API calls from the browser. The Open-Meteo API supports CORS, so this should work without issues.

## License

MIT
