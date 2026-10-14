export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhoto?: string;
  authorUri?: string;
  rating: number;
  relativeTime: string;
  text: string;
  googleMapsUri?: string;
}

export interface GooglePlaceReviewsResponse {
  source: string;
  placeId: string;
  placeName: string;
  formattedAddress?: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string;
  reviews: GoogleReviewItem[];
  lastUpdated?: string;
  isLive?: boolean;
}

// Cozy Cottage Shamirpet (Near Silpa Whistling Woods, Uddamarri, Muduchintalapalli / Shamirpet)
const PLACE_ID = 'ChIJl23WKgB_yzsRHFOS0IbIp64';
const MAPS_URL = 'https://maps.google.com/?cid=12585248165060563740';

// Verified Google Reviews dataset for Cozy Cottage Shamirpet
const VERIFIED_FALLBACK: GooglePlaceReviewsResponse = {
  source: 'google_places_verified',
  placeId: PLACE_ID,
  placeName: 'Cozy Cottage',
  formattedAddress: 'Near Silpa Whistling Woods, Shamirpet / Muduchintalapalli, Telangana 508117',
  rating: 4.6,
  userRatingCount: 33,
  googleMapsUri: MAPS_URL,
  reviews: [
    {
      id: 'rev_cozy_1',
      authorName: 'Srikrishnan Varadharajan',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjVtC_AMCBwEwDpnv9Mi87fXSpZnaBXZrFYPwp4mfF4I1v7AI3I=s128-c0x00000000-cc-rp-mo-ba4',
      authorUri: 'https://www.google.com/maps/contrib/112804758517872301030/reviews',
      rating: 5,
      relativeTime: '7 months ago',
      text: 'We had an absolutely wonderful experience staying at Cozy Cottage-Farm House in Hyderabad. This spot is the perfect blend of comfort, space, and relaxation — especially great for group getaways!\n\nFrom the moment we arrived, check-in was a breeze thanks to the easy self check-in setup. The hosts were friendly and very responsive, which made everything smooth and stress-free.\n\nThe house itself is beautiful, spacious enough for large groups, and thoughtfully equipped with everything you need for a comfortable stay. The bedrooms were cozy, and the common areas were ideal for socializing and unwinding.\n\nOne of the highlights was definitely the private pool — we spent quality time relaxing and having fun there, which added a resort-like feel to our stay.\n\nWhether you’re planning a relaxing weekend with friends or a peaceful family staycation, this place ticks all the boxes. Highly recommended for anyone looking for a memorable, comfy, and fun farm-house experience!',
      googleMapsUri: MAPS_URL,
    },
    {
      id: 'rev_cozy_2',
      authorName: 'Raj Kumar',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjUKrl71VU1E2O7X0b7SjMiROr8IWZe9YXAsXSnmSIDsc8xurA-B=s128-c0x00000000-cc-rp-mo',
      authorUri: 'https://www.google.com/maps/contrib/104031432059821714706/reviews',
      rating: 5,
      relativeTime: '7 months ago',
      text: 'Had an amazing time at the farmhouse! It’s a really good place to relax and chill with friends and family. The swimming pool was clean and well-maintained — perfect for enjoying and cooling off. There’s plenty of open space to play cricket, which made the experience even more fun and active.\n\nOne of the best parts was the bonfire at night. It created such a cozy and enjoyable atmosphere. Overall, it’s a great place for a short getaway, parties, or weekend relaxation. Highly recommended for anyone looking to unwind and have a good time! 😊',
      googleMapsUri: MAPS_URL,
    },
    {
      id: 'rev_cozy_3',
      authorName: 'Rohith Munigala',
      authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjVs6YsJiDtw7xTprRp1T4jBbNySsYxJfpM6h1tIHTRbsHhQngo=s128-c0x00000000-cc-rp-mo',
      authorUri: 'https://www.google.com/maps/contrib/110855214592041315839/reviews',
      rating: 5,
      relativeTime: '4 months ago',
      text: 'Our stay at this farmhouse was absolutely wonderful. The place was clean, peaceful, and beautifully maintained with a perfect natural atmosphere. The hospitality was excellent, and every arrangement was thoughtfully done. It was the perfect getaway to relax and spend quality time with family. Highly recommended for anyone looking for a calm and refreshing experience.',
      googleMapsUri: MAPS_URL,
    },
  ],
};

export async function fetchGoogleReviews(): Promise<GooglePlaceReviewsResponse> {
  // If a custom API key is ever configured, attempt client-side Google Places API query
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri',
          'X-Goog-Maps-Solution-ID': 'gmp_git_agentskills_v1',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const reviews = Array.isArray(data.reviews)
          ? data.reviews.map((r: any, idx: number) => ({
              id: r.name || `rev_${idx}`,
              authorName: r.authorAttribution?.displayName || 'Google Verified Guest',
              authorPhoto: r.authorAttribution?.photoUri || '',
              authorUri: r.authorAttribution?.uri || data.googleMapsUri || MAPS_URL,
              rating: r.rating || 5,
              relativeTime: r.relativePublishTimeDescription || 'Recent stay',
              text: r.text?.text || r.originalText?.text || '',
              googleMapsUri: r.googleMapsUri || data.googleMapsUri || MAPS_URL,
            }))
          : VERIFIED_FALLBACK.reviews;

        return {
          source: 'google_places_api_live',
          placeId: data.id || PLACE_ID,
          placeName: data.displayName?.text || 'Cozy Cottage',
          formattedAddress: data.formattedAddress || VERIFIED_FALLBACK.formattedAddress,
          rating: data.rating || 4.6,
          userRatingCount: data.userRatingCount || 33,
          googleMapsUri: data.googleMapsUri || MAPS_URL,
          reviews,
          isLive: true,
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.debug('Google Places API call fallback', err);
    }
  }

  // Instant response with verified Google reviews for Cozy Cottage Shamirpet
  return VERIFIED_FALLBACK;
}
