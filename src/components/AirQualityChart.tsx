
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { AirQualityItem } from '@/types/airQuality';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AirQualityChartProps {
  data: AirQualityItem[];
  title?: string;
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({ 
  data,
  title = "Air Quality Trends" 
}) => {
  const formatData = data.map((item) => ({
    time: format(new Date(item.dt * 1000), 'HH:mm'),
    aqi: item.main.aqi,
    pm25: item.components.pm2_5,
    pm10: item.components.pm10,
    o3: item.components.o3,
    no2: item.components.no2,
    timestamp: item.dt,
  }));
  
  // Sort data by timestamp
  formatData.sort((a, b) => a.timestamp - b.timestamp);
  
  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formatData}
              margin={{
                top: 5,
                right: 20,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  borderColor: '#e5e7eb',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: number) => [value.toFixed(1), '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="pm25"
                name="PM2.5"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="pm10"
                name="PM10"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="o3"
                name="O₃"
                stroke="#ffc658"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="no2"
                name="NO₂"
                stroke="#ff7300"
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityChart;
