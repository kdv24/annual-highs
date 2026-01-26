import { useState } from 'react'
import './App.css'

function App() {
  const [temperatureData, setTemperatureData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const zipCode = '97212'
  // Coordinates for Portland, OR (97212)
  const latitude = 45.5372
  const longitude = -122.6508

  const fetchTemperatureData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Calculate date range for last year
      const today = new Date()
      const lastYear = today.getFullYear() - 1
      const startDate = `${lastYear}-01-01`
      const endDate = `${lastYear}-12-31`
      
      const results = []

      // Open-Meteo API endpoint for historical weather data
      // This API is completely free and doesn't require an API key
      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max&temperature_unit=fahrenheit&timezone=America/Los_Angeles`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch data`)
      }
      
      const data = await response.json()
      
      // Process the historical data
      if (data.daily && data.daily.time && data.daily.temperature_2m_max) {
        data.daily.time.forEach((dateStr, index) => {
          const temp = data.daily.temperature_2m_max[index]
          const date = new Date(dateStr)
          results.push({
            date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
            highTemp: Math.round(temp),
            sortDate: dateStr
          })
        })
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
        <h1>Daily High Temperatures for {zipCode}</h1>
        <p>Historical Data for Last Year</p>
      </header>

      <div className="api-key-section">
        <button onClick={fetchTemperatureData} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Historical Temperature Data'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading">
          <p>Fetching historical temperature data for last year...</p>
          <p>This may take a moment.</p>
        </div>
      )}

      {temperatureData.length > 0 && !loading && (
        <div className="results">
          <h2>Historical High Temperatures ({temperatureData.length} days)</h2>
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
          <p>Click the button above to fetch historical high temperature data for each day of last year.</p>
          <p><strong>Data Source:</strong> This application uses the <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo API</a>, which is completely free and doesn't require an API key.</p>
          <p><strong>Note:</strong> The data shows daily high temperatures for Portland, OR (ZIP code {zipCode}) for the previous calendar year.</p>
        </div>
      )}
    </div>
  )
}

export default App
