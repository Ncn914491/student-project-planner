import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function MinimalApp() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Student Project Planner
          </h1>
          <p className="text-sm text-blue-500">Organize • Track • Succeed</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Tasks</h2>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900">Example Task</h3>
                <p className="text-sm text-gray-600 mt-1">This is an example task description.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Project Notes</h2>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Example project note content.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Deadlines</h2>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Example deadline: June 30, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);
