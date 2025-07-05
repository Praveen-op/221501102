import React, { useState } from 'react';
import { Plus, X, Link, Clock, Hash } from 'lucide-react';
import { ShortenedUrl } from '../types';
import { saveUrlToStorage } from '../utils/storage';
import { validateUrl, generateShortcode } from '../utils/validation';

interface UrlFormProps {
  onUrlsShortened: (urls: ShortenedUrl[]) => void;
}

interface UrlInput {
  id: string;
  url: string;
  shortcode: string;
  validity: number;
  errors: { url?: string; shortcode?: string; validity?: string };
}

export const UrlForm: React.FC<UrlFormProps> = ({ onUrlsShortened }) => {
  const [urlInputs, setUrlInputs] = useState<UrlInput[]>([
    { id: '1', url: '', shortcode: '', validity: 30, errors: {} }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addUrlInput = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([
        ...urlInputs,
        { id: Date.now().toString(), url: '', shortcode: '', validity: 30, errors: {} }
      ]);
    }
  };

  const removeUrlInput = (id: string) => {
    if (urlInputs.length > 1) {
      setUrlInputs(urlInputs.filter(input => input.id !== id));
    }
  };

  const updateUrlInput = (id: string, field: keyof UrlInput, value: string | number) => {
    setUrlInputs(urlInputs.map(input => 
      input.id === id ? { ...input, [field]: value, errors: { ...input.errors, [field]: undefined } } : input
    ));
  };

  const validateInputs = (): boolean => {
    let isValid = true;
    const existingShortcodes = new Set();
    
    const updatedInputs = urlInputs.map(input => {
      const errors: UrlInput['errors'] = {};

      // Validate URL
      if (!input.url) {
        errors.url = 'URL is required';
        isValid = false;
      } else if (!validateUrl(input.url)) {
        errors.url = 'Please enter a valid URL';
        isValid = false;
      }

      // Validate shortcode
      if (input.shortcode) {
        if (input.shortcode.length > 15 || !/^[a-zA-Z0-9]+$/.test(input.shortcode)) {
          errors.shortcode = 'Shortcode must be alphanumeric and under 15 characters';
          isValid = false;
        } else if (existingShortcodes.has(input.shortcode)) {
          errors.shortcode = 'Shortcode must be unique';
          isValid = false;
        } else {
          // Check if shortcode already exists in storage
          const existingUrls = JSON.parse(localStorage.getItem('shortened_urls') || '[]');
          if (existingUrls.some((url: ShortenedUrl) => url.shortcode === input.shortcode)) {
            errors.shortcode = 'Shortcode already exists';
            isValid = false;
          }
        }
        existingShortcodes.add(input.shortcode);
      }

      // Validate validity
      if (input.validity <= 0) {
        errors.validity = 'Validity must be a positive number';
        isValid = false;
      }

      return { ...input, errors };
    });

    setUrlInputs(updatedInputs);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;

    setIsSubmitting(true);

    try {
      const shortenedUrls: ShortenedUrl[] = [];

      for (const input of urlInputs) {
        let shortcode = input.shortcode;
        
        // Generate unique shortcode if not provided
        if (!shortcode) {
          const existingUrls = JSON.parse(localStorage.getItem('shortened_urls') || '[]');
          const existingShortcodes = new Set(existingUrls.map((url: ShortenedUrl) => url.shortcode));
          
          do {
            shortcode = generateShortcode();
          } while (existingShortcodes.has(shortcode));
        }
        
        const expiresAt = new Date(Date.now() + input.validity * 60 * 1000);
        
        const shortenedUrl: ShortenedUrl = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          originalUrl: input.url,
          shortcode,
          shortUrl: `${window.location.origin}/${shortcode}`,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
          clickCount: 0
        };

        await saveUrlToStorage(shortenedUrl);
        shortenedUrls.push(shortenedUrl);
      }

      onUrlsShortened(shortenedUrls);
      
      // Reset form
      setUrlInputs([
        { id: '1', url: '', shortcode: '', validity: 30, errors: {} }
      ]);
    } catch (error) {
      console.error('Error shortening URLs:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        {urlInputs.map((input, index) => (
          <div key={input.id} className="bg-gray-50/50 rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">URL {index + 1}</h3>
              {urlInputs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrlInput(input.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Link className="inline h-4 w-4 mr-1" />
                  Original URL
                </label>
                <input
                  type="url"
                  value={input.url}
                  onChange={(e) => updateUrlInput(input.id, 'url', e.target.value)}
                  placeholder="https://example.com/very-long-url"
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    input.errors.url 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                  } focus:outline-none focus:ring-4`}
                />
                {input.errors.url && (
                  <p className="mt-1 text-sm text-red-600">{input.errors.url}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="inline h-4 w-4 mr-1" />
                    Custom Shortcode (optional)
                  </label>
                  <input
                    type="text"
                    value={input.shortcode}
                    onChange={(e) => updateUrlInput(input.id, 'shortcode', e.target.value)}
                    placeholder="mylink"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      input.errors.shortcode 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-4`}
                  />
                  {input.errors.shortcode && (
                    <p className="mt-1 text-sm text-red-600">{input.errors.shortcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Validity (minutes)
                  </label>
                  <input
                    type="number"
                    value={input.validity}
                    onChange={(e) => updateUrlInput(input.id, 'validity', parseInt(e.target.value) || 0)}
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                      input.errors.validity 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                    } focus:outline-none focus:ring-4`}
                  />
                  {input.errors.validity && (
                    <p className="mt-1 text-sm text-red-600">{input.errors.validity}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addUrlInput}
            disabled={urlInputs.length >= 5}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
              urlInputs.length >= 5
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Add URL ({urlInputs.length}/5)</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Shortening...' : 'Shorten URLs'}
          </button>
        </div>
      </form>
    </div>
  );
};