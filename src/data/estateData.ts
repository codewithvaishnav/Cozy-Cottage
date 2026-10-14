import { CottageSuite, DailyRitual, GalleryPhoto, LandmarkHotspot, SeasonalHarvestItem } from '../types';

export const LANDMARK_HOTSPOTS: LandmarkHotspot[] = [
  {
    id: 'master_suites',
    name: 'Poolside View from Bedroom',
    subtitle: 'Direct Walk-Out to Pool Deck',
    category: 'Bedrooms',
    cameraPosition: [8, 8, 14],
    targetPosition: [2, 2.5, -2],
    description: 'Air-conditioned luxury suites featuring floor-to-ceiling garden views, dark hardwood entrance doors opening directly onto the pool deck, and warm amber evening ambient lighting.',
    elevation: 'Courtyard Level',
    yearBuilt: '2024',
    photoUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    features: ['Direct Pool Deck Walkout', 'Dark Timber Architectural Doors', 'Warm Dimmable Sconce Lighting', 'En-Suite Rain Shower Sanctuary']
  },
  {
    id: 'geometric_villa',
    name: 'Kitchen Entrance',
    subtitle: 'Cottage Kitchen & Dining Entrance',
    category: 'Villa',
    cameraPosition: [-6.0, 2.5, 14.2],
    targetPosition: [-6.0, 2.3, 5.5],
    description: 'Vibrant sunshine yellow gable facade and slate grey architectural accent featuring the kitchen entrance door, panoramic glazed window, overhead canopy shelf, and stone walkway.',
    elevation: 'Main Residence Level',
    yearBuilt: '2024 Custom Design',
    photoUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    features: ['Vibrant Yellow & Slate Geometric Murals', '4 Prominent White Structural Pillars', 'Dark Charcoal Pitched Gable Roofs', 'Large Panoramic White-Trim Windows']
  }
];

export const HIGH_RES_GALLERY: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'The L-Shaped Pool Villa at Daylight',
    category: 'architecture',
    fullUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    aspect: 'landscape',
    caption: 'The vibrant yellow and slate geometric facade bathed in natural sunlight with the crystal blue swimming pool and pillared veranda porch.',
    location: 'Central Pool Courtyard',
    season: 'Summer',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 24-70mm f/2.8 GM II',
      aperture: 'f/5.6',
      shutter: '1/320s',
      iso: '100'
    }
  },
  {
    id: 'photo-2',
    title: 'Night Pool Glow & Cyan Pillar Sconces',
    category: 'lifestyle',
    fullUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    aspect: 'landscape',
    caption: 'Dramatic evening illumination featuring turquoise LED up-down pillar lights, submerged pool floodlights, and perimeter wall glow.',
    location: 'Poolside Veranda',
    season: 'Summer',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 16-35mm f/2.8 GM',
      aperture: 'f/2.8',
      shutter: '1/30s',
      iso: '800'
    }
  },
  {
    id: 'photo-3',
    title: 'Crystal Clear Azure Water & Stone Edge',
    category: 'architecture',
    fullUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
    aspect: 'portrait',
    caption: 'Close-up perspective of the turquoise pool tiles, stainless steel ladder, dark granite ledge, and pristine water ripples.',
    location: 'Pool Deck',
    season: 'Spring',
    exif: {
      camera: 'Leica Q3',
      lens: 'Summilux 28mm f/1.7',
      aperture: 'f/2.8',
      shutter: '1/500s',
      iso: '100'
    }
  },
  {
    id: 'photo-4',
    title: 'Covered Veranda with Potted Tropical Flora',
    category: 'lifestyle',
    fullUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    aspect: 'landscape',
    caption: 'The sheltered corridor lined with white pillars, warm wooden ceiling, terracotta planters, and outdoor lounge seating.',
    location: 'Veranda Walkway',
    season: 'Summer',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 35mm f/1.4 GM',
      aperture: 'f/2.0',
      shutter: '1/200s',
      iso: '125'
    }
  },
  {
    id: 'photo-5',
    title: 'Sunset Over the Emerald Lawn & Geometric Gables',
    category: 'harvest',
    fullUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    aspect: 'landscape',
    caption: 'Golden hour sunlight warming the bright yellow architectural wing, manicured lawn, and surrounding open skies.',
    location: 'Front Garden',
    season: 'Autumn',
    exif: {
      camera: 'Hasselblad 907X',
      lens: 'XCD 45mm f/4',
      aperture: 'f/8.0',
      shutter: '1/60s',
      iso: '64'
    }
  },
  {
    id: 'photo-6',
    title: 'Master Bedroom Suite Walkout',
    category: 'culinary',
    fullUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2400&q=90',
    thumbUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    aspect: 'square',
    caption: 'Inviting contemporary bedroom suite with plush linens, wooden finishes, and direct visual access to the shimmering pool.',
    location: 'Poolside Bedroom Suite',
    season: 'Winter',
    exif: {
      camera: 'Sony A7R V',
      lens: 'FE 50mm f/1.2 GM',
      aperture: 'f/2.0',
      shutter: '1/160s',
      iso: '200'
    }
  }
];

export const COTTAGE_SUITES: CottageSuite[] = [
  {
    id: 'poolside-grand-villa',
    name: 'The Entire Whistling Woods Pool Villa',
    tagline: 'Private Exclusive Estate with 35ft Swimming Pool',
    sqft: 3200,
    maxGuests: 12,
    ratePerNight: 450,
    description: 'Experience total privacy with the entire L-shaped modern farmhouse villa, featuring multiple air-conditioned master bedrooms, direct walkout to the private 35ft azure swimming pool, covered pillared veranda, and lush green lawn for gatherings.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
    additionalImages: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Exclusive private access to the 35ft swimming pool',
      'Vibrant geometric architectural design with white columns',
      'Spacious manicured lawn for open-air barbecues and events',
      'Smart night lighting with vibrant cyan pillar sconces and underwater pool glow'
    ],
    amenities: [
      'Private Swimming Pool',
      'Air Conditioning in All Rooms',
      'High-Speed Wi-Fi',
      'Covered Veranda Lounge',
      'Outdoor Barbecue & Dining Area',
      'Full Kitchen & Caretaker Support',
      'Private Parking & Perimeter Security'
    ],
    view: '360° Private Pool, Veranda & Garden View'
  },
  {
    id: 'azure-pool-master-suite',
    name: 'The Azure Poolside Master Suite',
    tagline: 'Step Directly from Your Bed into the Pool',
    sqft: 650,
    maxGuests: 3,
    ratePerNight: 160,
    description: 'A luxurious master bedroom suite with king-size bedding, large picture windows framing the courtyard, and solid timber doors opening directly onto the veranda and swimming pool deck.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
    additionalImages: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Direct poolside walkout access',
      'King-size pillowtop mattress with premium linens',
      'En-suite modern bathroom with rain shower',
      'Dedicated work desk and coffee bar'
    ],
    amenities: [
      'King Bed',
      'En-Suite Bath',
      'Pool Access',
      'Wi-Fi',
      'Mini Bar',
      'Smart TV'
    ],
    view: 'Direct Swimming Pool & Veranda View'
  },
  {
    id: 'sunflower-gable-suite',
    name: 'The Sunflower Gable Garden Suite',
    tagline: 'Tranquil Corner with Sunlit Garden Panoramas',
    sqft: 580,
    maxGuests: 3,
    ratePerNight: 140,
    description: 'Located in the signature yellow gable wing, offering bright morning sunlight, scenic lawn perspectives, high timber ceilings, and a private covered entrance porch.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    additionalImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Vaulted ceiling with warm wood details',
      'Panoramic picture window facing the lawn',
      'Private shaded seating porch',
      'Organic botanical bath amenities'
    ],
    amenities: [
      'Queen Bed',
      'En-Suite Bath',
      'Lawn View',
      'Wi-Fi',
      'Tea Station'
    ],
    view: 'Emerald Lawn & Palm Grove View'
  }
];

export const SEASONAL_HARVEST: SeasonalHarvestItem[] = [
  {
    name: 'Estate Coconut & Palm Nectar',
    category: 'Tropical Orchard',
    peakSeason: 'Year-Round',
    flavorProfile: 'Sweet, crisp, mineral-rich, refreshing hydration',
    culinaryUse: 'Fresh morning welcome drinks, chilled poolside refreshments, and artisan cocktails',
    image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Heirloom Mangoes & Guavas',
    category: 'Fruit Orchards',
    peakSeason: 'Summer',
    flavorProfile: 'Intensely fragrant, honeyed sweetness with tropical zest',
    culinaryUse: 'Fresh breakfast fruit platters, homemade sorbets, and farm jams',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Organic Garden Herbs & Mint',
    category: 'Potted Herb Garden',
    peakSeason: 'Monsoon / Autumn',
    flavorProfile: 'Peppery, aromatic spearmint, basil, and lemongrass',
    culinaryUse: 'Poolside mojitos, herbal tisanes, and fresh evening barbecue marinades',
    image: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Farm-Fresh Wood-Fired Barbecue',
    category: 'Culinary Hearth',
    peakSeason: 'All Seasons',
    flavorProfile: 'Smoky, charred hickory, slow-roasted spices and grilled vegetables',
    culinaryUse: 'Evening lawn barbecues paired with craft beverages beside the glowing pool',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  }
];

export const DAILY_RITUALS: DailyRitual[] = [
  {
    time: '07:30 AM',
    period: 'Morning Radiance',
    title: 'Sunrise Pool Swim & Lawn Yoga',
    description: 'Begin the day with a refreshing swim in the crystal azure pool, followed by morning yoga on the dew-kissed emerald lawn with chilled fresh coconut water.',
    iconName: 'Sun',
    location: 'Pool Deck & Lawn'
  },
  {
    time: '01:00 PM',
    period: 'Midday Leisure',
    title: 'Veranda Siesta & Cool Plunge',
    description: 'Relax in the shade of the pillared veranda with chilled beverages, board games, or float lazily on the pool while soaking in the tropical breeze.',
    iconName: 'Waves',
    location: 'Covered Veranda Lounge'
  },
  {
    time: '05:30 PM',
    period: 'Golden Twilight',
    title: 'Sunset Garden Stroll & Lawn Games',
    description: 'As golden rays light up the yellow geometric facade, enjoy badminton, photography, and open-air conversation in the expansive front garden.',
    iconName: 'Sunset',
    location: 'Emerald Front Lawn'
  },
  {
    time: '08:00 PM',
    period: 'Starlit Evening',
    title: 'Luminous Pool Party & Barbecue Hearth',
    description: 'The estate comes alive with vibrant cyan pillar sconces and underwater pool lights. Enjoy a wood-fired outdoor barbecue with music under the starlit sky.',
    iconName: 'Flame',
    location: 'Luminous Poolside'
  }
];
