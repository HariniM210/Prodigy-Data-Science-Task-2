import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import DataTable from './DataTable';
import DataCharts from './DataCharts';

const DataExplorer: React.FC = () => {
  const { cleanedData } = useData();
  const [view, setView] = useState<'table' | 'charts'>('charts');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Explore Dataset</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              view === 'table'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView('charts')}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              view === 'charts'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Charts View
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <DataTable data={cleanedData} />
      ) : (
        <DataCharts data={cleanedData} />
      )}
    </div>
  );
};

export default DataExplorer;