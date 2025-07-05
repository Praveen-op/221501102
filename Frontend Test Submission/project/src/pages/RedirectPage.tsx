import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStoredUrls, addClickData } from '../utils/storage';
import { getLocationData } from '../utils/geolocation';
import { Loader2, AlertCircle } from 'lucide-react';

export const RedirectPage: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'not_found' | 'expired'>('loading');
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortcode) {
        setStatus('not_found');
        return;
      }

      const urls = getStoredUrls();
      const url = urls.find(u => u.shortcode === shortcode);

      if (!url) {
        setStatus('not_found');
        return;
      }

      if (new Date(url.expiresAt) <= new Date()) {
        setStatus('expired');
        return;
      }

      setOriginalUrl(url.originalUrl);
      setStatus('redirecting');

      try {
        // Get location data
        const locationData = await getLocationData();
        
        // Log the click
        await addClickData({
          shortcode,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'Direct',
          location: locationData ? `${locationData.city}, ${locationData.country}` : 'Unknown'
        });
      } catch (error) {
        // If geolocation fails, still log the click
        await addClickData({
          shortcode,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'Direct',
          location: 'Unknown'
        });
      }

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            // Ensure URL has protocol
            const redirectUrl = url.originalUrl.startsWith('http') 
              ? url.originalUrl 
              : `https://${url.originalUrl}`;
            window.location.href = redirectUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    };

    handleRedirect();
  }, [shortcode]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
            <p className="text-gray-600">Please wait while we process your request.</p>
          </div>
        );
      
      case 'redirecting':
        return (
          <div className="text-center">
            <div className="animate-bounce mb-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white">
                {countdown}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirecting in {countdown}...</h2>
            <p className="text-gray-600 mb-4">You will be redirected to:</p>
            <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 break-all max-w-md mx-auto">
              {originalUrl}
            </div>
            <button
              onClick={() => {
                const redirectUrl = originalUrl.startsWith('http') 
                  ? originalUrl 
                  : `https://${originalUrl}`;
                window.location.href = redirectUrl;
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Now
            </button>
          </div>
        );
      
      case 'not_found':
        return (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Not Found</h2>
            <p className="text-gray-600 mb-4">The shortened link you're looking for doesn't exist.</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Link
            </a>
          </div>
        );
      
      case 'expired':
        return (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Link Expired</h2>
            <p className="text-gray-600 mb-4">This shortened link has expired and is no longer valid.</p>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Link
            </a>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200/50">
        {renderContent()}
      </div>
    </div>
  );
};