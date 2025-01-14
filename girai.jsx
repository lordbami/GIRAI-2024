import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { Cpu, Database, Leaf, BarChart3, Globe, Activity, Zap, TrendingUp } from 'lucide-react';

// Sample data for continents
const continents = {
  Europe: ['France', 'Germany', 'Italy', 'Spain', 'UK'],
  Asia: ['China', 'Japan', 'India', 'Korea', 'Singapore'],
  Africa: ['Egypt', 'South Africa', 'Kenya', 'Nigeria', 'Morocco'],
  Americas: ['USA', 'Canada', 'Brazil', 'Mexico', 'Argentina'],
  Oceania: ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa']
};

const HighPerformanceGlobalDashboard = () => {
  const [activeContinent, setActiveContinent] = useState('Europe');
  const [processingState, setProcessingState] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const generateComplexData = () => {
    return Object.entries(continents).flatMap(([continent, countries]) => 
      countries.map(country => ({
        continent,
        country,
        overall: Math.floor(75 + Math.random() * 25),
        metrics: {
          soil_quality: Math.floor(60 + Math.random() * 40),
          water_efficiency: Math.floor(60 + Math.random() * 40),
          innovation_index: Math.floor(60 + Math.random() * 40),
          sustainability_score: Math.floor(60 + Math.random() * 40),
        },
        timeData: [2020, 2021, 2022, 2023, 2024].map(year => ({
          year,
          value: Math.floor(70 + Math.random() * 30),
        })),
        realTimeMetrics: {
          processingPower: Math.floor(80 + Math.random() * 20),
          dataPoints: Math.floor(10000 + Math.random() * 5000),
          accuracy: Math.floor(90 + Math.random() * 10),
        }
      }))
    );
  };

  const [analysisData, setAnalysisData] = useState(generateComplexData());

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingState(prev => (prev + 1) % 100);
      setAnalysisData(prev => prev.map(country => ({
        ...country,
        realTimeMetrics: {
          processingPower: Math.floor(80 + Math.random() * 20),
          dataPoints: Math.floor(10000 + Math.random() * 5000),
          accuracy: Math.floor(90 + Math.random() * 10),
        }
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 80) return 'bg-blue-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredData = analysisData.filter(item => item.continent === activeContinent);
  const averageAccuracy = Math.round(
    analysisData.reduce((acc, item) => acc + item.realTimeMetrics.accuracy, 0) / analysisData.length
  );

  const createMetricCard = (title, value, IconComponent, extraContent) => (
    <Card className="bg-gray-800 border-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            {IconComponent}
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
          <div className="h-16 w-16">
            {extraContent}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex space-x-4 mb-6">
        {Object.keys(continents).map(continent => (
          <button
            key={continent}
            onClick={() => setActiveContinent(continent)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeContinent === continent 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {continent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {createMetricCard(
          "Processing Power", 
          processingState + '%', 
          <Cpu className="text-blue-400 mb-2" />,
          <ResponsiveContainer>
            <LineChart data={[{ v: 0 }, { v: processingState }]}>
              <Line type="monotone" dataKey="v" stroke="#60A5FA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
        {createMetricCard(
          "Data Points",
          filteredData[0]?.realTimeMetrics.dataPoints.toLocaleString() || '0',
          <Database className="text-purple-400 mb-2" />,
          <Activity className="text-purple-400" />
        )}
        {createMetricCard(
          "Analysis Accuracy",
          averageAccuracy + '%',
          <Zap className="text-yellow-400 mb-2" />,
          <TrendingUp className="text-yellow-400" />
        )}
        {createMetricCard(
          `${activeContinent} Countries`,
          filteredData.length.toString(),
          <Globe className="text-green-400 mb-2" />,
          <Leaf className="text-green-400" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 max-h-screen overflow-y-auto">
            {filteredData.map((country, idx) => (
              <Card
                key={idx}
                className={`bg-gray-800 border-none cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  selectedCountry === country.country ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCountry(country.country)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{country.country}</h3>
                    <div className={`h-3 w-3 rounded-full ${getMetricColor(country.overall)}`} />
                  </div>
                  {Object.entries(country.metrics).map(([metric, value]) => (
                    <div key={metric} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">
                          {metric.replace('_', ' ').toUpperCase()}
                        </span>
                        <span>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`${getMetricColor(value)} rounded-full h-2 transition-all duration-500`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <Card className="bg-gray-800 border-none h-full">
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-4">Performance Trends</h3>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart
                    data={
                      selectedCountry
                        ? analysisData.find(c => c.country === selectedCountry)?.timeData
                        : filteredData[0]?.timeData
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      itemStyle={{ color: '#60A5FA' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      dot={{ fill: '#60A5FA' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HighPerformanceGlobalDashboard;
