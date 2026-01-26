# annual-highs

A React application that fetches the daily high temperature forecast for zip code 97212 (Portland, OR) using the OpenWeatherMap free tier API.

## Features

- Fetches 5-day weather forecast from OpenWeatherMap
- Displays daily high temperatures in a table format
- Clean, modern UI built with React and Vite
- Uses OpenWeatherMap's free tier (no subscription required)

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- OpenWeatherMap API key (free tier available)

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

3. Enter your OpenWeatherMap API key in the input field

4. Click "Fetch Temperature Data" to retrieve the 5-day temperature forecast

## Getting an OpenWeatherMap API Key

1. Visit [OpenWeatherMap Sign Up](https://home.openweathermap.org/users/sign_up)
2. Create a free account
3. Navigate to the "API keys" tab in your account dashboard
4. Copy the default API key (or create a new one)
5. Paste the API key into the application

**Note:** New API keys may take a few minutes to activate. If you receive an authentication error, wait 5-10 minutes and try again.

**Security Note:** This application uses client-side API calls. For production use, consider implementing a backend proxy to keep your API key secure. Environment variables with the `VITE_` prefix are exposed in the client-side bundle.

### Alternative: Using Environment Variables

You can also configure your API key using environment variables:

1. Create a `.env.local` file in the project root:
```bash
VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
```

2. The application will automatically use this key if no key is entered in the UI

**Important:** Never commit your `.env.local` file to version control. It's already included in `.gitignore`.

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
- OpenWeatherMap API (Free Tier)

## API Details

This application uses the OpenWeatherMap 5-day/3-hour forecast API endpoint:
- **Endpoint:** `https://api.openweathermap.org/data/2.5/forecast`
- **Parameters:**
  - `zip`: ZIP code and country code (e.g., 97212,US)
  - `appid`: Your API key
  - `units`: imperial (for Fahrenheit)
- **Free Tier Limits:**
  - 60 calls/minute
  - 1,000,000 calls/month
  - 5-day forecast with 3-hour intervals

## Example Response

The app processes OpenWeatherMap's forecast data to extract daily high temperatures. The forecast provides data points every 3 hours, and the app calculates the maximum temperature for each day.

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

- **"Invalid API key" error:** Ensure your API key is correct and has been activated (may take 5-10 minutes for new keys)
- **"API rate limit exceeded" error:** The free tier allows 60 calls per minute. Wait a minute before trying again.
- **CORS errors:** This app makes direct API calls from the browser. If you encounter CORS issues, ensure you're using the correct API endpoint.

## License

MIT
