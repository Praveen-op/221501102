import React, { useState } from 'react';
import { ShortenedUrl, ClickData } from '../types';
import { ExternalLink, Eye, Clock, MapPin } from 'lucide-react';

interface UrlStatsTableProps {
  urls: ShortenedUrl[];
  clickData: ClickData[];
}

export const UrlStatsTable: React.FC<UrlStatsTableProps> = ({ urls, clickData }) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const getClicksForUrl = (shortcode: string) => {
    return clickData.filter(click => click.shortcode === shortcode);
  };

  const getUrlStatus = (expiresAt: string) => {
    return new Date(expiresAt) > new Date() ? 'Active' : 'Expired';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50">
      <div className="p-6 border-b border-gray-200/50">
        <h3 className="text-lg font-semibold text-gray-800">All Shortened URLs</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {urls.map((url) => {
              const clicks = getClicksForUrl(url.shortcode);
              const status = getUrlStatus(url.expiresAt);
              const isSelected = selectedUrl === url.shortcode;

              return (
                <React.Fragment key={url.id}>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {url.originalUrl}
                        </span>
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                        >
                          <span>{url.shortUrl}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {clicks.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(url.expiresAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUrl(isSelected ? null : url.shortcode)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>{isSelected ? 'Hide' : 'View'} Details</span>
                      </button>
                    </td>
                  </tr>
                  {isSelected && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50/50">
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-900">Click Details</h4>
                          {clicks.length > 0 ? (
                            <div className="space-y-2">
                              {clicks.map((click, index) => (
                                <div key={index} className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDate(click.timestamp)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ExternalLink className="h-4 w-4" />
                                    <span>{click.referrer}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{click.location}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No clicks yet</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {urls.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No shortened URLs yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
};