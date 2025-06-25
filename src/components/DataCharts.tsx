import React, { useState } from 'react';
import { Passenger } from '../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

interface DataChartsProps {
  data: Passenger[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A877F7'];

const DataCharts: React.FC<DataChartsProps> = ({ data }) => {
  const [chartType, setChartType] = useState<'survival' | 'age' | 'class' | 'correlation'>('survival');

  // Calculate survival by gender
  const survivalByGender = [
    { name: 'Female', survived: 0, died: 0 },
    { name: 'Male', survived: 0, died: 0 },
  ];
  
  data.forEach(p => {
    const genderIndex = p.Sex === 'female' ? 0 : 1;
    if (p.Survived === 1) {
      survivalByGender[genderIndex].survived += 1;
    } else {
      survivalByGender[genderIndex].died += 1;
    }
  });

  // Calculate survival by class
  const survivalByClass = [
    { name: '1st Class', survived: 0, died: 0 },
    { name: '2nd Class', survived: 0, died: 0 },
    { name: '3rd Class', survived: 0, died: 0 },
  ];
  
  data.forEach(p => {
    const classIndex = p.Pclass - 1;
    if (p.Survived === 1) {
      survivalByClass[classIndex].survived += 1;
    } else {
      survivalByClass[classIndex].died += 1;
    }
  });

  // Calculate age distribution with survival
  const ageGroups = [
    { name: '0-10', survived: 0, died: 0 },
    { name: '11-20', survived: 0, died: 0 },
    { name: '21-30', survived: 0, died: 0 },
    { name: '31-40', survived: 0, died: 0 },
    { name: '41-50', survived: 0, died: 0 },
    { name: '51-60', survived: 0, died: 0 },
    { name: '61+', survived: 0, died: 0 },
  ];
  
  data.forEach(p => {
    if (p.Age === null) return;
    
    let groupIndex = Math.min(Math.floor(p.Age / 10), 6);
    if (p.Survived === 1) {
      ageGroups[groupIndex].survived += 1;
    } else {
      ageGroups[groupIndex].died += 1;
    }
  });

  // Fare vs. Age correlation (scatter data)
  const validData = data.filter(p => p.Age !== null && p.Fare !== null);
  
  const fareAgeData = validData.map(p => ({
    age: p.Age,
    fare: p.Fare,
    pclass: p.Pclass,
    survived: p.Survived === 1
  }));

  // Fare by class data
  const fareByClass = [
    { name: 'Class 1', value: 0, count: 0 },
    { name: 'Class 2', value: 0, count: 0 },
    { name: 'Class 3', value: 0, count: 0 },
  ];
  
  data.forEach(p => {
    if (p.Fare !== null && p.Pclass !== null) {
      fareByClass[p.Pclass - 1].value += p.Fare;
      fareByClass[p.Pclass - 1].count += 1;
    }
  });
  
  fareByClass.forEach(item => {
    if (item.count > 0) {
      item.value = parseFloat((item.value / item.count).toFixed(2));
    }
  });

  // Overall survival rate
  const totalSurvived = data.filter(p => p.Survived === 1).length;
  const pieData = [
    { name: 'Survived', value: totalSurvived },
    { name: 'Did Not Survive', value: data.length - totalSurvived }
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setChartType('survival')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === 'survival'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Survival Analysis
          </button>
          <button
            onClick={() => setChartType('class')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === 'class'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Class Analysis
          </button>
          <button
            onClick={() => setChartType('age')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === 'age'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Age Distribution
          </button>
          <button
            onClick={() => setChartType('correlation')}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              chartType === 'correlation'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Fare Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartType === 'survival' && (
          <>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Overall Survival Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#4ADE80' : '#F87171'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} passengers`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Survival by Gender</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={survivalByGender}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="survived" name="Survived" fill="#4ADE80" />
                    <Bar dataKey="died" name="Did Not Survive" fill="#F87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'class' && (
          <>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Survival by Passenger Class</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={survivalByClass}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="survived" name="Survived" fill="#4ADE80" />
                    <Bar dataKey="died" name="Did Not Survive" fill="#F87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Average Fare by Class</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fareByClass}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Average Fare']} />
                    <Bar dataKey="value" name="Average Fare ($)" fill="#60A5FA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'age' && (
          <>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Age Distribution by Survival</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ageGroups}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="survived" name="Survived" fill="#4ADE80" />
                    <Bar dataKey="died" name="Did Not Survive" fill="#F87171" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Survival Rate by Age Group</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ageGroups.map(group => {
                      const total = group.survived + group.died;
                      return {
                        name: group.name,
                        rate: total > 0 ? (group.survived / total) * 100 : 0
                      };
                    })}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Survival Rate']} />
                    <Line type="monotone" dataKey="rate" name="Survival Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {chartType === 'correlation' && (
          <>
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Fare Distribution by Passenger Class</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...Array(3)].map((_, i) => {
                      const classFares = data
                        .filter(p => p.Pclass === i + 1 && p.Fare !== null)
                        .map(p => p.Fare);
                      
                      return {
                        name: `Class ${i + 1}`,
                        min: Math.min(...classFares),
                        max: Math.max(...classFares),
                        avg: classFares.reduce((sum, fare) => sum + fare, 0) / classFares.length
                      };
                    })}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                    <Legend />
                    <Bar dataKey="min" name="Min Fare" fill="#94A3B8" />
                    <Bar dataKey="avg" name="Avg Fare" fill="#60A5FA" />
                    <Bar dataKey="max" name="Max Fare" fill="#818CF8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Survival Rate by Fare Range</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[...Array(10)].map((_, i) => {
                      const fareMin = i * 30;
                      const fareMax = (i + 1) * 30;
                      const fareRange = data.filter(p => 
                        p.Fare !== null && 
                        p.Fare >= fareMin && 
                        (i < 9 ? p.Fare < fareMax : true)
                      );
                      
                      const survived = fareRange.filter(p => p.Survived === 1).length;
                      const total = fareRange.length;
                      
                      return {
                        name: i < 9 ? `$${fareMin}-${fareMax}` : `$${fareMin}+`,
                        rate: total > 0 ? (survived / total) * 100 : 0,
                        count: total
                      };
                    }).filter(d => d.count > 0)}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'rate' ? `${value.toFixed(1)}%` : value,
                        name === 'rate' ? 'Survival Rate' : 'Passenger Count'
                      ]} 
                    />
                    <Line type="monotone" dataKey="rate" name="Survival Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="count" name="Passenger Count" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chartType === 'survival' && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Gender Bias in Survival</h4>
                <p className="text-sm text-blue-700">
                  Women had a significantly higher survival rate than men, indicating the 
                  "women and children first" policy was likely followed during evacuation.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Overall Survival Statistics</h4>
                <p className="text-sm text-teal-700">
                  Only about {((totalSurvived / data.length) * 100).toFixed(1)}% of passengers survived the disaster, 
                  highlighting the severity of the tragedy.
                </p>
              </div>
            </>
          )}
          
          {chartType === 'class' && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Class Privilege</h4>
                <p className="text-sm text-blue-700">
                  First-class passengers had a much higher survival rate compared to 
                  third-class passengers, suggesting socioeconomic factors played a role in survival.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Fare Disparity</h4>
                <p className="text-sm text-teal-700">
                  There was a significant price gap between the classes, with first-class 
                  passengers paying substantially more than those in lower classes.
                </p>
              </div>
            </>
          )}
          
          {chartType === 'age' && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Age-Related Survival</h4>
                <p className="text-sm text-blue-700">
                  Children (0-10 years) had higher survival rates, supporting the 
                  "women and children first" evacuation protocol.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Elderly Vulnerability</h4>
                <p className="text-sm text-teal-700">
                  Older passengers (61+ years) had lower survival rates, possibly due to 
                  reduced mobility or being located in less accessible areas of the ship.
                </p>
              </div>
            </>
          )}
          
          {chartType === 'correlation' && (
            <>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-2">Fare and Survival</h4>
                <p className="text-sm text-blue-700">
                  Higher fare-paying passengers generally had better survival rates, 
                  correlating with their likely accommodation in upper decks with better access to lifeboats.
                </p>
              </div>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Price Range Analysis</h4>
                <p className="text-sm text-teal-700">
                  The wide range of fares within each class suggests varied accommodations 
                  and services even within the same passenger class.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCharts;