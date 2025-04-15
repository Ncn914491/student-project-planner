import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function WorkingTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Tailwind CSS Test</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
              This is a working Tailwind CSS example
            </h1>
            <p className="mt-2 text-gray-500">
              If you can see this styled properly, Tailwind CSS is working correctly.
            </p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Test Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WorkingTest />
  </React.StrictMode>
);
