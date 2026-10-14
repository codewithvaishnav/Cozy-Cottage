export type AtmosphericMood = 'golden' | 'dawn' | 'night' | 'autumn';
export type RenderStyle = 'pixar' | 'cel-shaded' | 'realistic';

export interface LandmarkHotspot {
  id: string;
  name: string;
  subtitle: string;
  category: 'Pool' | 'Bedrooms' | 'Villa' | 'Lawn' | 'Night' | 'Architecture' | 'Pool & Lounge' | 'Suites' | 'Garden & Lawn' | 'Night Illumination';
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
  description: string;
  elevation: string;
  yearBuilt: string;
  photoUrl: string;
  features: string[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'architecture' | 'harvest' | 'culinary' | 'lifestyle';
  fullUrl: string;
  thumbUrl: string;
  aspect: 'landscape' | 'portrait' | 'square';
  caption: string;
  location: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  exif: {
    camera: string;
    lens: string;
    aperture: string;
    shutter: string;
    iso: string;
  };
}

export interface CottageSuite {
  id: string;
  name: string;
  tagline: string;
  sqft: number;
  maxGuests: number;
  ratePerNight: number;
  description: string;
  image: string;
  additionalImages: string[];
  features: string[];
  amenities: string[];
  view: string;
}

export interface SeasonalHarvestItem {
  name: string;
  category: string;
  peakSeason: string;
  flavorProfile: string;
  culinaryUse: string;
  image: string;
}

export interface DailyRitual {
  time: string;
  period: string;
  title: string;
  description: string;
  iconName: string;
  location: string;
}

export interface BookingInquiryData {
  suiteId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  selectedExperiences: string[];
  dietaryNotes: string;
  specialRequests: string;
}
