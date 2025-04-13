import React from 'react';
import ReactDOM from 'react-dom/client';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: 'blue' }}>Simple Test App</h1>
      <p>If you can see this, React is working correctly.</p>
      <div style={{ 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <p>This is a test component with inline styles (no Tailwind).</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>
);
