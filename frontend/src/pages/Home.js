import React, { useState } from 'react';

const Home = () => {
  const [trades, setTrades] = useState([]);
  const [timestamp, setTimestamp] = useState('');
  const [balance, setBalance] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all trades
  const fetchTrades = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/all`);
      console.log(response)
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        if (data.trades == []){
            setError('No Trade Data Available right now!')
        }
        else{
            setError('');
        }
        setTrades(data.trades);
        
        
      } else {
        setError(data.message || 'Failed to fetch trades');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Fetch balance at a specific timestamp
  const fetchBalance = async () => {
    if (timestamp==''){
        alert('Please specify timestamp!')
        return
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timestamp }),
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Handle CSV file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadMessage('File uploaded successfully!');
        setError('');
      } else {
        setError(data.message || 'Failed to upload file');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800">API Tester</h1>
  
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Fetch All Trades</h2>
        <button
          onClick={fetchTrades}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-200"
        >
          Get All Trades
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        <ul className="mt-6 space-y-4">
          {trades.map((trade, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200">
              <div className="text-lg font-medium text-gray-700">
                {trade.base_coin}/{trade.quote_coin}
              </div>
              <div className="text-sm text-gray-500">
                {trade.buy_sell_amount} @ {trade.price} ({trade.operation})
              </div>
              <div className="text-xs text-gray-400">
                {new Date(trade.utc_time).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
  
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-green-700">Get Balance at Timestamp</h2>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="border-2 border-green-500 p-3 rounded-lg mr-4 focus:border-green-600 focus:ring-1 focus:ring-green-600"
        />
        <button
          onClick={fetchBalance}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition duration-200"
        >
          Get Balance
        </button>
        {balance && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Balance:</h3>
            <pre className="text-gray-600 mt-2">{JSON.stringify(balance, null, 2)}</pre>
          </div>
        )}
      </div>
  
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Upload CSV File</h2>
        <form onSubmit={handleFileUpload} className="flex items-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="border-2 border-purple-500 p-3 rounded-lg mr-4 focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700 transition duration-200"
          >
            Upload CSV
          </button>
        </form>
        {uploadMessage && <p className="text-green-600 mt-4">{uploadMessage}</p>}
      </div>
    </div>
  );
  
};

export default Home;
