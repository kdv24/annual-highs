import { useState } from 'react'
import './App.css'

function App() {
  const [temperatureData, setTemperatureData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '')

  const zipCode = '97212'
  const FORECAST_DAYS = 5 // OpenWeatherMap free tier provides 5-day forecast

  const fetchTemperatureData = async () => {
    if (!apiKey) {
      setError('Please enter your OpenWeatherMap API key')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // OpenWeatherMap free tier provides:
      // - Current weather data
      // - 5-day/3-hour forecast (40 data points)
      // We'll fetch the 5-day forecast and extract daily high temperatures
      
      const results = []

      // OpenWeatherMap API endpoint for 5-day forecast
      // Using zip code for location
      const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},US&appid=${apiKey}&units=imperial`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.')
        }
        if (response.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.')
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch data`)
      }
      
      const data = await response.json()
      
      // Process the forecast data to extract daily high temperatures
      // The forecast contains 3-hour intervals, so we need to group by day
      const dailyHighs = {}
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000)
        const dateStr = date.toLocaleDateString()
        const temp = item.main.temp_max
        
        if (!dailyHighs[dateStr] || dailyHighs[dateStr] < temp) {
          dailyHighs[dateStr] = temp
        }
      })
      
      // Convert to array format
      Object.entries(dailyHighs).forEach(([date, temp]) => {
        results.push({
          date: date,
          highTemp: Math.round(temp)
        })
      })
      
      // Sort by date
      results.sort((a, b) => new Date(a.date) - new Date(b.date))
      
      setTemperatureData(results)
    } catch (err) {
      setError('Failed to fetch temperature data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Daily High Temperatures for {zipCode}</h1>
        <p>Next {FORECAST_DAYS} Days Forecast</p>
      </header>

      <div className="api-key-section">
        <label htmlFor="apiKey">OpenWeatherMap API Key:</label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
        />
        <button onClick={fetchTemperatureData} disabled={loading || !apiKey}>
          {loading ? 'Loading...' : 'Fetch Temperature Data'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading">
          <p>Fetching temperature forecast data...</p>
          <p>This will only take a moment.</p>
        </div>
      )}

      {temperatureData.length > 0 && !loading && (
        <div className="results">
          <h2>Temperature Forecast ({temperatureData.length} days)</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>High Temperature (°F)</th>
              </tr>
            </thead>
            <tbody>
              {temperatureData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.highTemp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {temperatureData.length === 0 && !loading && (
        <div className="instructions">
          <h2>Instructions</h2>
          <ol>
            <li>Get a free OpenWeatherMap API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
            <li>Enter your API key in the field above</li>
            <li>Click "Fetch Temperature Data" to retrieve the {FORECAST_DAYS}-day temperature forecast</li>
          </ol>
          <p><strong>Note:</strong> OpenWeatherMap free tier provides current weather and 5-day forecast data.</p>
          <p><strong>How to get your API key:</strong></p>
          <ol>
            <li>Visit <a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noopener noreferrer">OpenWeatherMap Sign Up</a></li>
            <li>Create a free account</li>
            <li>Navigate to API keys section in your account</li>
            <li>Copy the default API key or create a new one</li>
            <li>Note: It may take a few minutes for new API keys to activate</li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default App
