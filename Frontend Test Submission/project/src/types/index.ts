export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortcode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt: string;
  clickCount: number;
}

export interface ClickData {
  shortcode: string;
  timestamp: string;
  referrer: string;
  location: string;
}

export interface LocationData {
  city: string;
  country: string;
  ip: string;
}