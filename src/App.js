import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';

const App = () => {
  const [greeting, setGreeting] = useState('');
  const [chartData, setChartData] = useState(null);
  const [topLinks, setTopLinks] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [activeTab, setActiveTab] = useState('top-links');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    setGreeting(`${greeting}`);
  }, []);

  useEffect(() => {
    fetch('https://api.inopenapp.com/api/v1/dashboardNew', {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjU5MjcsImlhdCI6MTY3NDU1MDQ1MH0.dCkW0ox8tbjJA2GgUx2UEwNlbTZ7Rr38PVFJevYcXFI'
      }
    })
      .then(response => response.json())
      .then(data => {
        setChartData({
          labels: data.chartData.labels,
          datasets: [{
            label: 'Clicks',
            data: data.chartData.values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
        setTopLinks(data.topLinks);
        setRecentLinks(data.recentLinks);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container">
      <div id="greeting" className="greeting">{greeting}</div>
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
      <div className="tabs">
        <div className={`tab ${activeTab === 'top-links' ? 'active' : ''}`} onClick={() => setActiveTab('top-links')}>
          Top Links
        </div>
        <div className={`tab ${activeTab === 'recent-links' ? 'active' : ''}`} onClick={() => setActiveTab('recent-links')}>
          Recent Links
        </div>
      </div>
      <div className={`content ${activeTab === 'top-links' ? 'active' : ''}`} id="top-links">
        {topLinks.map((link, index) => (
          <div key={index} className="link">
            <span>{link.name}</span><span>{link.clicks} Clicks</span>
          </div>
        ))}
      </div>
      <div className={`content ${activeTab === 'recent-links' ? 'active' : ''}`} id="recent-links">
        {recentLinks.map((link, index) => (
          <div key={index} className="link">
            <span>{link.name}</span><span>{link.clicks} Clicks</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
