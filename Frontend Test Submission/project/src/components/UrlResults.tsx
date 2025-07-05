import React, { useState } from 'react';
import { ShortenedUrl } from '../types';
import { Copy, Check, ExternalLink, Clock } from 'lucide-react';

interface UrlResultsProps {
  urls: ShortenedUrl[];
}

export const UrlResults: React.FC<UrlResultsProps> = ({ urls }) => {
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls(prev => new Set([...prev, id]));
      setTimeout(() => {
        setCopiedUrls(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatExpiryTime = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return 'Expired';
    if (diffMins < 60) return `${diffMins}m left`;
    if (diffMins < 1440) return `${Math.ceil(diffMins / 60)}h left`;
    return `${Math.ceil(diffMins / 1440)}d left`;
  };

  const handleShortLinkClick = (shortUrl: string, e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to the short link within the same app
    const shortcode = shortUrl.split('/').pop();
    window.location.href = `/${shortcode}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shortened URLs</h2>
      
      <div className="space-y-4">
        {urls.map((url) => (
          <div key={url.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 truncate mb-1">{url.originalUrl}</p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleShortLinkClick(url.shortUrl, e)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-lg flex items-center space-x-1 hover:underline"
                  >
                    <span>{url.shortUrl}</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => copyToClipboard(url.shortUrl, url.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-white/80 rounded-lg hover:bg-white transition-colors"
              >
                {copiedUrls.has(url.id) ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Copy</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatExpiryTime(url.expiresAt)}</span>
              </div>
              <span>•</span>
              <span>Created: {new Date(url.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};