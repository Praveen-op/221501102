import React, { useState } from 'react';
import { UrlForm } from '../components/UrlForm';
import { UrlResults } from '../components/UrlResults';
import { ShortenedUrl } from '../types';

export const HomePage: React.FC = () => {
  const [results, setResults] = useState<ShortenedUrl[]>([]);

  const handleUrlsShortened = (shortenedUrls: ShortenedUrl[]) => {
    setResults(shortenedUrls);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Shorten Your URLs
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Transform long URLs into short, shareable links with custom codes and expiry times.
          Track clicks and analyze your link performance.
        </p>
      </div>

      <div className="space-y-8">
        <UrlForm onUrlsShortened={handleUrlsShortened} />
        {results.length > 0 && <UrlResults urls={results} />}
      </div>
    </div>
  );
};