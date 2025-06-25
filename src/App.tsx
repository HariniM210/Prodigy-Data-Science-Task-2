import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { DataProvider } from './context/DataContext';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DataProvider>
        <Header />
        <main className="flex-grow">
          <Dashboard />
        </main>
        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;