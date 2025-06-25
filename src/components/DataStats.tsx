import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DataStatsProps {
  stats: {
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
  };
}

const DataStats: React.FC<DataStatsProps> = ({ stats }) => {
  // Gender distribution data
  const genderData = [
    { name: 'Female', value: stats.genderDistribution.female },
    { name: 'Male', value: stats.genderDistribution.male },
  ];
  
  // Class distribution data
  const classData = [
    { name: '1st Class', value: stats.classDistribution.first },
    { name: '2nd Class', value: stats.classDistribution.second },
    { name: '3rd Class', value: stats.classDistribution.third },
  ];
  
  // Age stats data
  const ageStatsData = [
    { name: 'Minimum', value: stats.ageStats.min },
    { name: 'Average', value: stats.ageStats.average },
    { name: 'Median', value: stats.ageStats.median },
    { name: 'Maximum', value: stats.ageStats.max },
  ];

  const GENDER_COLORS = ['#FF6384', '#36A2EB'];
  const CLASS_COLORS = ['#FFCE56', '#4BC0C0', '#FF9F40'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Statistical Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <div className="text-blue-800 text-lg font-medium mb-2">Total Passengers</div>
          <div className="text-3xl font-bold text-blue-900">{stats.totalPassengers}</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="text-green-800 text-lg font-medium mb-2">Survival Rate</div>
          <div className="text-3xl font-bold text-green-900">{stats.survivalRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
          <div className="text-amber-800 text-lg font-medium mb-2">Average Age</div>
          <div className="text-3xl font-bold text-amber-900">{stats.ageStats.average} years</div>
          <div className="text-sm text-amber-700 mt-2">
            {stats.ageStats.missing} missing values ({((stats.ageStats.missing / stats.totalPassengers) * 100).toFixed(1)}%)
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Passenger Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-3">Gender Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} passengers`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h4 className="font-medium text-gray-700 mb-3">Class Distribution</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {classData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CLASS_COLORS[index % CLASS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} passengers`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageStatsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} years`, '']} />
                  <Bar dataKey="value" name="Age (years)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-sm">
                <span className="font-medium">Age Range:</span> 
                <span className="ml-2">{stats.ageStats.min} - {stats.ageStats.max} years</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Median Age:</span> 
                <span className="ml-2">{stats.ageStats.median} years</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Key Observations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Gender and Class Influence</h4>
            <p className="text-sm text-gray-700">
              The dataset shows a significant gender imbalance with {Math.round((stats.genderDistribution.male / stats.totalPassengers) * 100)}% male passengers. 
              Third-class passengers made up the largest group at {Math.round((stats.classDistribution.third / stats.totalPassengers) * 100)}% of total passengers.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Age Distribution Patterns</h4>
            <p className="text-sm text-gray-700">
              The wide age range ({stats.ageStats.min}-{stats.ageStats.max} years) shows passengers of all ages were aboard. 
              The median age of {stats.ageStats.median} suggests a relatively young passenger population.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Missing Data Considerations</h4>
            <p className="text-sm text-gray-700">
              {((stats.ageStats.missing / stats.totalPassengers) * 100).toFixed(1)}% of age values are missing, which could introduce bias in age-related analyses.
              Proper data imputation techniques were applied during the cleaning phase.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Survival Patterns</h4>
            <p className="text-sm text-gray-700">
              The overall survival rate of {stats.survivalRate.toFixed(1)}% indicates the severity of the disaster.
              Further analysis shows survival rates varied significantly by gender, class, and age.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStats;