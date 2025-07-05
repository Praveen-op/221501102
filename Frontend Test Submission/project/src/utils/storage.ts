import { ShortenedUrl, ClickData } from '../types';

const URLS_KEY = 'shortened_urls';
const CLICKS_KEY = 'click_data';

export const saveUrlToStorage = (url: ShortenedUrl): void => {
  const existingUrls = getStoredUrls();
  const updatedUrls = [...existingUrls, url];
  localStorage.setItem(URLS_KEY, JSON.stringify(updatedUrls));
};

export const getStoredUrls = (): ShortenedUrl[] => {
  const storedUrls = localStorage.getItem(URLS_KEY);
  return storedUrls ? JSON.parse(storedUrls) : [];
};

export const addClickData = (clickData: ClickData): void => {
  const existingClicks = getClickData();
  const updatedClicks = [...existingClicks, clickData];
  localStorage.setItem(CLICKS_KEY, JSON.stringify(updatedClicks));
  
  // Also update the click count in the URL
  const urls = getStoredUrls();
  const updatedUrls = urls.map(url => 
    url.shortcode === clickData.shortcode 
      ? { ...url, clickCount: url.clickCount + 1 }
      : url
  );
  localStorage.setItem(URLS_KEY, JSON.stringify(updatedUrls));
};

export const getClickData = (): ClickData[] => {
  const storedClicks = localStorage.getItem(CLICKS_KEY);
  return storedClicks ? JSON.parse(storedClicks) : [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(URLS_KEY);
  localStorage.removeItem(CLICKS_KEY);
};