import React from 'react';
import { ClickData } from '../types';
import { BarChart3 } from 'lucide-react';

interface ClicksChartProps {
  clickData: ClickData[];
}

export const ClicksChart: React.FC<ClicksChartProps> = ({ clickData }) => {
  const getHourlyData = () => {
    const hourlyClicks = new Array(24).fill(0);
    
    clickData.forEach(click => {
      const hour = new Date(click.timestamp).getHours();
      hourlyClicks[hour]++;
    });

    return hourlyClicks;
  };

  const hourlyData = getHourlyData();
  const maxClicks = Math.max(...hourlyData);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-gray-200/50">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Clicks by Hour</h3>
      </div>
      
      <div className="space-y-3">
        {hourlyData.map((clicks, hour) => (
          <div key={hour} className="flex items-center space-x-3">
            <div className="w-8 text-sm text-gray-600">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${maxClicks > 0 ? (clicks / maxClicks) * 100 : 0}%` }}
              />
            </div>
            <div className="w-8 text-sm text-gray-600 text-right">
              {clicks}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};