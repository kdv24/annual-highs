import { useState } from 'react'
import './App.css'

function App() {
  const [temperatureData, setTemperatureData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiKey, setApiKey] = useState('')

  const zipCode = '97212'
  const year = 2026

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
    
    try {
      const dates = generateDatesFor2026()
      const results = []

      // Note: This is a simplified implementation
      // In a real-world scenario, you would batch these requests or use a different approach
      // to avoid rate limiting issues
      
      for (const date of dates) {
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
        
        // Weather Underground API endpoint for historical data
        // Format: https://api.weather.com/v1/location/{zipCode}/observations/historical.json?apiKey={apiKey}&startDate={dateStr}&endDate={dateStr}
        const url = `https://api.weather.com/v1/location/${zipCode}/observations/historical.json?apiKey=${apiKey}&startDate=${dateStr}&endDate=${dateStr}`
        
        try {
          const response = await fetch(url)
          
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${date.toLocaleDateString()}`)
          }
          
          const data = await response.json()
          
          // Extract high temperature from the response
          // Note: The exact structure depends on the API response format
          const highTemp = data.observations?.[0]?.imperial?.tempMax || 'N/A'
          
          results.push({
            date: date.toLocaleDateString(),
            highTemp: highTemp
          })
        } catch (err) {
          results.push({
            date: date.toLocaleDateString(),
            highTemp: 'Error',
            error: err.message
          })
        }
        
        // Add a small delay to avoid rate limiting (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 100))
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
          <p>This may take a few minutes. Please wait.</p>
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
          <p><strong>Note:</strong> Weather Underground API requires a subscription for historical data access. 
          This implementation shows how the data would be fetched and displayed.</p>
        </div>
      )}
    </div>
  )
}

export default App
