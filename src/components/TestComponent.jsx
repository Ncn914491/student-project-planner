export default function TestComponent() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind CSS Test
      </h1>
      <p className="text-gray-700 mb-4">
        This is a test component to verify that Tailwind CSS is working correctly.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-red-800 font-semibold">Red Box</h2>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-blue-800 font-semibold">Blue Box</h2>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-green-800 font-semibold">Green Box</h2>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-yellow-800 font-semibold">Yellow Box</h2>
        </div>
      </div>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        Test Button
      </button>
    </div>
  );
}
