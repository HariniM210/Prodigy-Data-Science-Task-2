import React, { useState } from 'react';
import DataUploader from './DataUploader';
import DataCleaner from './DataCleaner';
import DataExplorer from './DataExplorer';
import DataStats from './DataStats';
import { useData } from '../context/DataContext';
import { Tabs } from './ui/Tabs';

const Dashboard: React.FC = () => {
  const { rawData, cleanedData, dataStats, updateDataStats } = useData();
  const [activeTab, setActiveTab] = useState<string>('upload');

  // Update stats when cleaned data changes
  React.useEffect(() => {
    if (cleanedData.length > 0) {
      updateDataStats();
    }
  }, [cleanedData, updateDataStats]);

  const tabs = [
    { id: 'upload', label: 'Upload Data' },
    { id: 'clean', label: 'Clean Data', disabled: rawData.length === 0 },
    { id: 'explore', label: 'Explore Data', disabled: cleanedData.length === 0 },
    { id: 'stats', label: 'Statistics', disabled: cleanedData.length === 0 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'upload' && <DataUploader onSuccess={() => setActiveTab('clean')} />}
        {activeTab === 'clean' && <DataCleaner onSuccess={() => setActiveTab('explore')} />}
        {activeTab === 'explore' && <DataExplorer />}
        {activeTab === 'stats' && <DataStats stats={dataStats} />}
      </div>
    </div>
  );
};

export default Dashboard;