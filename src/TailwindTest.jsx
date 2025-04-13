import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind CSS Test
        </h1>
        <p className="text-gray-700 mb-6">
          If you can see this styled with blue text and proper spacing, Tailwind CSS is working!
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-red-100 p-4 rounded-lg">
            <h2 className="text-red-800 font-semibold">Red Box</h2>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="text-blue-800 font-semibold">Blue Box</h2>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="text-green-800 font-semibold">Green Box</h2>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h2 className="text-yellow-800 font-semibold">Yellow Box</h2>
          </div>
        </div>
        <button className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Test Button
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
