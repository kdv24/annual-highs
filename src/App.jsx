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
        // Validate that arrays have the same length
        const timeArray = data.daily.time
        const tempArray = data.daily.temperature_2m_max
        
        if (timeArray.length === tempArray.length) {
          timeArray.forEach((dateStr, index) => {
            const temp = tempArray[index]
            // Skip entries with null or undefined temperatures
            if (temp !== null && temp !== undefined) {
              const date = new Date(dateStr)
              results.push({
                date: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
                highTemp: Math.round(temp),
                sortDate: dateStr
              })
            }
          })
        }
      }
      
      // Sort results by date to ensure chronological order
      results.sort((a, b) => a.sortDate.localeCompare(b.sortDate))

      // Find the correct year (should be the year with the most entries)
      const yearCounts = {};
      results.forEach(r => {
        const yr = r.sortDate.slice(0, 4);
        yearCounts[yr] = (yearCounts[yr] || 0) + 1;
      });
      const correctYear = Object.entries(yearCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      // Filter to only dates in the correct year
      const filtered = results.filter(r => r.sortDate.startsWith(correctYear));
      // Ensure Jan 1 and Dec 31 are present
      const jan1 = `${correctYear}-01-01`;
      const dec31 = `${correctYear}-12-31`;
      let final = filtered.slice();
      // Always add Jan 1 if missing and available in results
      if (!final.some(r => r.sortDate === jan1)) {
        const jan1Entry = results.find(r => r.sortDate === jan1);
        if (jan1Entry) final.unshift(jan1Entry);
      }
      // Always add Dec 31 if missing and available in results
      if (!final.some(r => r.sortDate === dec31)) {
        const dec31Entry = results.find(r => r.sortDate === dec31);
        if (dec31Entry) final.push(dec31Entry);
      }

      setTemperatureData(final)
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
        <div className="results" id="results-to-print">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0}}>Historical High Temperatures</h2>
            <button className="print-btn" onClick={() => window.print()}>Download/Print PDF</button>
          </div>
          {(() => {
            // Group by month
            const months = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            // Group by month, always sort by day to ensure Dec 31 is last in December
            const byMonth = Array.from({ length: 12 }, () => []);
            temperatureData.forEach(item => {
              const [month, day] = item.date.split('/');
              byMonth[parseInt(month, 10) - 1].push({ ...item, day: parseInt(day, 10) });
            });
            byMonth.forEach((arr, idx) => {
              byMonth[idx] = arr.sort((a, b) => a.day - b.day);
            });
            return months.map((monthName, mIdx) => {
              // Add 'page-break-after' class to June (mIdx === 5)
              const blockClass = mIdx === 5 ? 'month-block page-break-after' : 'month-block';
              return (
                <div key={monthName} className={blockClass}>
                  <h3>{monthName}</h3>
                  <table className="calendar-table">
                    <tbody>
                      {(() => {
                        const rows = [];
                        const monthData = byMonth[mIdx];
                        for (let i = 0; i < monthData.length; i += 7) {
                          rows.push(
                            <tr key={i}>
                              {monthData.slice(i, i + 7).map((item, j) => [
                                <td key={`d${i+j}`} className="date-cell">{item.day}</td>,
                                <td key={`t${i+j}`} className="temp-cell">{item.highTemp}<span style={{fontSize: '0.9em'}}>&deg;</span></td>
                              ])}
                              {/* Fill empty cells if last row is incomplete */}
                              {Array.from({ length: 7 - (monthData.slice(i, i + 7).length) }).map((_, k) => [
                                <td key={`ed${i+k}`}></td>,
                                <td key={`et${i+k}`}></td>
                              ])}
                            </tr>
                          );
                        }
                        return rows;
                      })()}
                    </tbody>
                  </table>
                </div>
              );
            });
          })()}
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
