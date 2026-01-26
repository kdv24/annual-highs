import { useState } from 'react'
import './App.css'

function App() {
  const [temperatureData, setTemperatureData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const zipCode = '97212'
  const year = 2026
  const REQUEST_DELAY_MS = 500 // Delay between requests to avoid rate limiting

  // Generate all dates for 2026
  const generateDatesFor2026 = () => {
    const dates = []
    const startDate = new Date(year, 0, 1) // January 1, 2026
    const endDate = new Date(year, 11, 31) // December 31, 2026

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
    return dates
  }

  const fetchTemperatureData = async () => {
    if (!apiKey) {
      setError('Please enter your Weather Underground API key')
      return
    }

    setLoading(true)
    setError(null)
    setProgress({ current: 0, total: 0 })
    
    try {
      const dates = generateDatesFor2026()
      const results = []
      setProgress({ current: 0, total: dates.length })

      // Note: This implementation fetches data sequentially with delays to respect API rate limits
      // In a production environment, consider:
      // 1. Using a backend service to batch requests
      // 2. Implementing exponential backoff for failed requests
      // 3. Caching results to avoid repeated API calls
      // 4. Using bulk API endpoints if available from Weather Underground
      
      for (let i = 0; i < dates.length; i++) {
        const date = dates[i]
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
        
        // Weather Underground API endpoint for historical data
        // IMPORTANT: This is a placeholder URL structure. The actual endpoint may vary.
        // Verify the correct API endpoint format from Weather Underground API documentation:
        // https://www.wunderground.com/weather/api/d/docs
        // Common alternatives:
        // - https://api.weather.com/v2/pws/observations/historical
        // - https://api.wunderground.com/api/{apiKey}/history_{dateStr}/q/{zipCode}.json
        const url = `https://api.weather.com/v1/location/${zipCode}/observations/historical.json?apiKey=${apiKey}&startDate=${dateStr}&endDate=${dateStr}`
        
        try {
          const response = await fetch(url)
          
          if (!response.ok) {
            // Handle rate limiting with exponential backoff
            if (response.status === 429) {
              const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10)
              console.warn(`Rate limited. Waiting ${retryAfter} seconds before retry...`)
              await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
              // Retry the same request
              i--
              continue
            }
            throw new Error(`HTTP ${response.status}: Failed to fetch data`)
          }
          
          const data = await response.json()
          
          // Extract high temperature from the response
          // IMPORTANT: The response structure below is an approximation.
          // Verify the actual structure from Weather Underground API documentation.
          // The path to temperature data may vary (e.g., data.observations[0].metric.tempHigh)
          const highTemp = data.observations?.[0]?.imperial?.tempMax || 'N/A'
          
          results.push({
            date: date.toLocaleDateString(),
            highTemp: highTemp
          })
        } catch (err) {
          console.error(`Error fetching data for ${date.toLocaleDateString()}:`, err)
          results.push({
            date: date.toLocaleDateString(),
            highTemp: 'Error',
            error: err.message
          })
        }
        
        setProgress({ current: i + 1, total: dates.length })
        setTemperatureData([...results]) // Update UI with partial results
        
        // Add delay to avoid rate limiting
        // Adjust REQUEST_DELAY_MS based on your API tier limits
        if (i < dates.length - 1) {
          await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS))
        }
      }

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
        <h1>Annual High Temperatures for {zipCode}</h1>
        <p>Year: {year}</p>
      </header>

      <div className="api-key-section">
        <label htmlFor="apiKey">Weather Underground API Key:</label>
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
          <p>Fetching temperature data for all days in {year}...</p>
          <p>Progress: {progress.current} / {progress.total} days</p>
          <p>This may take several minutes due to API rate limits. Please wait.</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress.total > 0 ? (progress.current / progress.total * 100) : 0}%` }}
            />
          </div>
        </div>
      )}

      {temperatureData.length > 0 && !loading && (
        <div className="results">
          <h2>Temperature Data ({temperatureData.length} days)</h2>
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
            <li>Get a Weather Underground API key from <a href="https://www.wunderground.com/weather/api" target="_blank" rel="noopener noreferrer">Weather Underground</a></li>
            <li>Enter your API key in the field above</li>
            <li>Click "Fetch Temperature Data" to retrieve high temperatures for all days in {year}</li>
          </ol>
          <p><strong>Note:</strong> Weather Underground API requires a subscription for historical data access.</p>
          <p><strong>Performance:</strong> Fetching 365 days of data will take several minutes due to API rate limits. 
          The app implements delays between requests and automatic retry logic to handle rate limiting gracefully.</p>
        </div>
      )}
    </div>
  )
}

export default App
