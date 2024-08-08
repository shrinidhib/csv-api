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
        setTrades(data.trades);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch trades');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  // Fetch balance at a specific timestamp
  const fetchBalance = async () => {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">API Tester</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Fetch All Trades</h2>
        <button
          onClick={fetchTrades}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get All Trades
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <ul className="mt-4">
          {trades.map((trade, index) => (
            <li key={index} className="bg-white p-2 mb-2 rounded shadow">
              {trade.base_coin}/{trade.quote_coin}: {trade.buy_sell_amount} @ {trade.price} ({trade.operation}) on {new Date(trade.utc_time).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Get Balance at Timestamp</h2>
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={fetchBalance}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Get Balance
        </button>
        {balance && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Balance:</h3>
            <pre>{JSON.stringify(balance, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upload CSV File</h2>
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files[0])}
            className="border p-2 rounded mr-2"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Upload CSV
          </button>
        </form>
        {uploadMessage && <p className="text-green-500 mt-2">{uploadMessage}</p>}
      </div>
    </div>
  );
};

export default Home;
