# annual-highs

A React application that fetches the daily high temperature for zip code 97212 (Portland, OR) for all days in 2026 using the Weather Underground API.

## Features

- Fetches historical weather data from Weather Underground
- Displays daily high temperatures in a table format
- Clean, modern UI built with React and Vite
- Handles all 365 days of 2026

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- Weather Underground API key (requires subscription for historical data)

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

3. Enter your Weather Underground API key in the input field

4. Click "Fetch Temperature Data" to retrieve high temperatures for all days in 2026

## Getting a Weather Underground API Key

1. Visit [Weather Underground API](https://www.wunderground.com/weather/api)
2. Sign up for an account
3. Subscribe to a plan that includes historical data access
4. Copy your API key and paste it into the application

**Note:** Weather Underground API requires a paid subscription for historical data access. The free tier may have limited functionality.

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
- Weather Underground API

## License

MIT
