import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CleaningOptions } from '../types/dataTypes';

export interface Passenger {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number;
  Cabin: string | null;
  Embarked: string | null;
  [key: string]: any;
}

interface DataContextType {
  rawData: Passenger[];
  setRawData: React.Dispatch<React.SetStateAction<Passenger[]>>;
  cleanedData: Passenger[];
  setCleanedData: React.Dispatch<React.SetStateAction<Passenger[]>>;
  dataStats: DataStats;
  updateDataStats: () => void;
  cleanData: (options: CleaningOptions) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
}

interface DataStats {
  totalPassengers: number;
  survivalRate: number;
  ageStats: {
    average: number;
    median: number;
    min: number;
    max: number;
    missing: number;
  };
  genderDistribution: {
    male: number;
    female: number;
  };
  classDistribution: {
    first: number;
    second: number;
    third: number;
  };
}

const initialStats: DataStats = {
  totalPassengers: 0,
  survivalRate: 0,
  ageStats: {
    average: 0,
    median: 0,
    min: 0,
    max: 0,
    missing: 0,
  },
  genderDistribution: {
    male: 0,
    female: 0,
  },
  classDistribution: {
    first: 0,
    second: 0,
    third: 0,
  },
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rawData, setRawData] = useState<Passenger[]>([]);
  const [cleanedData, setCleanedData] = useState<Passenger[]>([]);
  const [dataStats, setDataStats] = useState<DataStats>(initialStats);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

  const updateDataStats = () => {
    if (cleanedData.length === 0) return;

    // Calculate basic statistics
    const totalPassengers = cleanedData.length;
    const survivors = cleanedData.filter(p => p.Survived === 1).length;
    const survivalRate = (survivors / totalPassengers) * 100;

    // Age stats
    const validAges = cleanedData.filter(p => p.Age !== null).map(p => p.Age as number);
    const sortedAges = [...validAges].sort((a, b) => a - b);
    const ageAvg = validAges.length > 0 
      ? validAges.reduce((sum, age) => sum + age, 0) / validAges.length 
      : 0;
    const ageMedian = sortedAges.length > 0 
      ? sortedAges[Math.floor(sortedAges.length / 2)] 
      : 0;
    const ageMin = sortedAges.length > 0 ? sortedAges[0] : 0;
    const ageMax = sortedAges.length > 0 ? sortedAges[sortedAges.length - 1] : 0;
    const missingAges = cleanedData.filter(p => p.Age === null).length;

    // Gender distribution
    const males = cleanedData.filter(p => p.Sex === 'male').length;
    const females = cleanedData.filter(p => p.Sex === 'female').length;

    // Class distribution
    const firstClass = cleanedData.filter(p => p.Pclass === 1).length;
    const secondClass = cleanedData.filter(p => p.Pclass === 2).length;
    const thirdClass = cleanedData.filter(p => p.Pclass === 3).length;

    setDataStats({
      totalPassengers,
      survivalRate,
      ageStats: {
        average: parseFloat(ageAvg.toFixed(2)),
        median: ageMedian,
        min: ageMin,
        max: ageMax,
        missing: missingAges,
      },
      genderDistribution: {
        male: males,
        female: females,
      },
      classDistribution: {
        first: firstClass,
        second: secondClass,
        third: thirdClass,
      },
    });
  };

  const cleanData = (options: CleaningOptions) => {
    let processed = [...rawData];

    // Handle missing ages
    if (options.fillMissingAges) {
      const validAges = processed.filter(p => p.Age !== null).map(p => p.Age as number);
      const avgAge = validAges.reduce((sum, age) => sum + age, 0) / validAges.length;
      
      processed = processed.map(p => {
        if (p.Age === null) {
          return { ...p, Age: parseFloat(avgAge.toFixed(1)) };
        }
        return p;
      });
    }

    // Handle missing embarked
    if (options.fillMissingEmbarked) {
      // Find most common embarked value
      const embarkedCounts: Record<string, number> = {};
      processed.forEach(p => {
        if (p.Embarked) {
          embarkedCounts[p.Embarked] = (embarkedCounts[p.Embarked] || 0) + 1;
        }
      });
      
      let mostCommonEmbarked = 'S'; // Default to Southampton
      let maxCount = 0;
      
      Object.entries(embarkedCounts).forEach(([key, count]) => {
        if (count > maxCount) {
          mostCommonEmbarked = key;
          maxCount = count;
        }
      });

      processed = processed.map(p => {
        if (!p.Embarked) {
          return { ...p, Embarked: mostCommonEmbarked };
        }
        return p;
      });
    }

    // Add derived features
    if (options.addFamilySize) {
      processed = processed.map(p => ({
        ...p,
        FamilySize: p.SibSp + p.Parch + 1, // +1 for passenger themselves
      }));
    }

    // Add title from name
    if (options.extractTitle) {
      processed = processed.map(p => {
        const match = p.Name.match(/\b([A-Za-z]+)\./) || ["", "Mr"];
        let title = match[1];
        
        // Normalize titles
        if (['Mlle', 'Ms'].includes(title)) {
          title = 'Miss';
        } else if (['Mme', 'Mrs'].includes(title)) {
          title = 'Mrs';
        } else if (['Capt', 'Col', 'Major', 'Dr', 'Rev'].includes(title)) {
          title = 'Officer';
        } else if (title !== 'Mr' && title !== 'Miss' && title !== 'Master') {
          title = 'Other';
        }
        
        return { ...p, Title: title };
      });
    }

    // Set cleaned data and update stats
    setCleanedData(processed);
  };

  return (
    <DataContext.Provider
      value={{
        rawData,
        setRawData,
        cleanedData,
        setCleanedData,
        dataStats,
        updateDataStats,
        cleanData,
        loading,
        setLoading,
        fileName,
        setFileName
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};