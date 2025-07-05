import React, { useState, useEffect } from 'react';
import { ShortenedUrl, ClickData } from '../types';
import { getStoredUrls, getClickData } from '../utils/storage';
import { StatsCard } from '../components/StatsCard';
import { ClicksChart } from '../components/ClicksChart';
import { UrlStatsTable } from '../components/UrlStatsTable';
import { BarChart3, Link, MousePointer, Clock } from 'lucide-react';

export const StatsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [clickData, setClickData] = useState<ClickData[]>([]);

  useEffect(() => {
    const storedUrls = getStoredUrls();
    const storedClicks = getClickData();
    setUrls(storedUrls);
    setClickData(storedClicks);
  }, []);

  const totalUrls = urls.length;
  const totalClicks = clickData.length;
  const activeUrls = urls.filter(url => new Date(url.expiresAt) > new Date()).length;
  const avgClicksPerUrl = totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Link Statistics
        </h1>
        <p className="text-gray-600 text-lg">
          Monitor your shortened links performance and analyze click patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Links"
          value={totalUrls}
          icon={<Link className="h-6 w-6" />}
          color="blue"
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicks}
          icon={<MousePointer className="h-6 w-6" />}
          color="green"
        />
        <StatsCard
          title="Active Links"
          value={activeUrls}
          icon={<Clock className="h-6 w-6" />}
          color="purple"
        />
        <StatsCard
          title="Avg Clicks/Link"
          value={avgClicksPerUrl}
          icon={<BarChart3 className="h-6 w-6" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ClicksChart clickData={clickData} />
      </div>

      <UrlStatsTable urls={urls} clickData={clickData} />
    </div>
  );
};