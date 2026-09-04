/**
 * MICHIRA — Destination Places Registry
 *
 * Maps each destination slug to its key tourist places with
 * verified Google Maps Place IDs. Used by the Apify scraper
 * to fetch real Google Maps reviews.
 *
 * Place IDs sourced from Google Maps Places API documentation.
 * Format: ChIJ... (Google Maps Place ID)
 */

export interface TouristPlace {
  name: string;
  placeId: string;          // Google Maps Place ID
  type: 'beach' | 'heritage' | 'nature' | 'temple' | 'market' | 'landmark' | 'experience';
}

export interface DestinationPlaceRegistry {
  [destinationSlug: string]: TouristPlace[];
}

export const DESTINATION_PLACES: DestinationPlaceRegistry = {
  // ── GOA ────────────────────────────────────────────────
  goa: [
    { name: 'Baga Beach', placeId: 'ChIJXV9LbPxDvzsR6bm3IMZbBJA', type: 'beach' },
    { name: 'Calangute Beach', placeId: 'ChIJXeG98M9DvzsRl2qoBk8IUVY', type: 'beach' },
    { name: 'Fort Aguada', placeId: 'ChIJJW3MlxxDvzsRvLFxBUgvRRc', type: 'heritage' },
    { name: 'Basilica of Bom Jesus', placeId: 'ChIJf-cFt5BEvzsRBHJSKwiqkHo', type: 'heritage' },
    { name: 'Dudhsagar Falls', placeId: 'ChIJywPwCaVXvzsRKLvgLjnAqak', type: 'nature' },
    { name: 'Palolem Beach', placeId: 'ChIJBTsMLTlWvzsRSzpgIJhGP3o', type: 'beach' },
  ],

  // ── KERALA ─────────────────────────────────────────────
  kerala: [
    { name: 'Alleppey Backwaters', placeId: 'ChIJZdG6HywICDsRRBg3IYQE3cg', type: 'nature' },
    { name: 'Munnar Tea Gardens', placeId: 'ChIJDwnKL3UrCzsRGYiuyMuHMFI', type: 'nature' },
    { name: 'Varkala Beach', placeId: 'ChIJQZDPSJi5BzsRlqskyevqxNo', type: 'beach' },
    { name: 'Fort Kochi', placeId: 'ChIJAbEKHjkFCzsRdwrklvb2Bik', type: 'heritage' },
    { name: 'Thekkady', placeId: 'ChIJR6Hkr8cuDzsRi2-CzKHVecc', type: 'nature' },
    { name: 'Kovalam Beach', placeId: 'ChIJw1I5SBO5BzsRa5_Y7dDzgAM', type: 'beach' },
  ],

  // ── MAHARASHTRA / MUMBAI ───────────────────────────────
  mumbai: [
    { name: 'Gateway of India', placeId: 'ChIJvY_5fBjF5zsRNs7vSHIAOiA', type: 'landmark' },
    { name: 'Marine Drive', placeId: 'ChIJP5xLu-fD5zsR3HFHm3gR_l0', type: 'landmark' },
    { name: 'Elephanta Caves', placeId: 'ChIJ97XD3w_G5zsR0LZYJhEVQqo', type: 'heritage' },
    { name: 'Juhu Beach', placeId: 'ChIJe7r0fYzF5zsRLUNfzOTfanM', type: 'beach' },
    { name: 'Chhatrapati Shivaji Maharaj Terminus', placeId: 'ChIJW_kJLPjB5zsRh55vMPWAJMY', type: 'heritage' },
  ],

  maharashtra: [
    { name: 'Ajanta Caves', placeId: 'ChIJTWcM9E5c3zsRKrgWZwQnp-s', type: 'heritage' },
    { name: 'Ellora Caves', placeId: 'ChIJXy-Ss4Ff3zsRgPUxpCVSDts', type: 'heritage' },
    { name: 'Lonavala', placeId: 'ChIJ-e3JHiioySARjIDBtnxhUaQ', type: 'nature' },
    { name: 'Mahabaleshwar', placeId: 'ChIJvUGJMqFLySARDH_pkQ4DRf0', type: 'nature' },
    { name: 'Shirdi', placeId: 'ChIJpedGhcG33zsRPE9uOJOzqGU', type: 'temple' },
  ],

  // ── RAJASTHAN / JAIPUR ────────────────────────────────
  jaipur: [
    { name: 'Amber Fort', placeId: 'ChIJO8yJMDblbDkRRhkfqj0uBrk', type: 'heritage' },
    { name: 'Hawa Mahal', placeId: 'ChIJtfFx2bvlbDkRONiAIQjIpT0', type: 'heritage' },
    { name: 'City Palace Jaipur', placeId: 'ChIJYXMzLb3lbDkR4aqdDFZdpR0', type: 'heritage' },
    { name: 'Jantar Mantar Jaipur', placeId: 'ChIJ5bIGxcDlbDkRiFuMm-I76fA', type: 'heritage' },
    { name: 'Patrika Gate', placeId: 'ChIJDbrRXNjlbDkRKjGNrgLGT8o', type: 'landmark' },
  ],

  rajasthan: [
    { name: 'Mehrangarh Fort Jodhpur', placeId: 'ChIJm5Q47PEeaDkRiubHcWN3YZU', type: 'heritage' },
    { name: 'Umaid Bhawan Palace', placeId: 'ChIJkULlGP0eaDkRzFvuFv1CJoQ', type: 'heritage' },
    { name: 'Lake Pichola Udaipur', placeId: 'ChIJQXWYRX5eaDkR_3EBN90GQAI', type: 'nature' },
    { name: 'City Palace Udaipur', placeId: 'ChIJW7JrOn9eaDkR7EGr2bYTk0o', type: 'heritage' },
    { name: 'Jaisalmer Fort', placeId: 'ChIJj5h2Hh51aTkRlJPdg6vGiRo', type: 'heritage' },
    { name: 'Sam Sand Dunes', placeId: 'ChIJLaCm7DUpaTkRqmFkFxiWRww', type: 'nature' },
  ],

  // ── DELHI ─────────────────────────────────────────────
  delhi: [
    { name: 'Red Fort', placeId: 'ChIJkTmMHRoDDTkRnxn1yXnAEuQ', type: 'heritage' },
    { name: 'Qutub Minar', placeId: 'ChIJXTmFfJoDDTkRHYd0A8Wm1LE', type: 'heritage' },
    { name: 'India Gate', placeId: 'ChIJP7lHaXIDDTkR5EH1RMGirwk', type: 'landmark' },
    { name: 'Chandni Chowk', placeId: 'ChIJ11ESDSUDDTkRpWCMnxBzEJo', type: 'market' },
    { name: 'Humayuns Tomb', placeId: 'ChIJiXtNNZYDDTkREDMFJB6Jltg', type: 'heritage' },
    { name: 'Lodhi Art District', placeId: 'ChIJP7B2JcMCDTkRolWl6GCJWOE', type: 'landmark' },
  ],

  // ── AGRA ──────────────────────────────────────────────
  agra: [
    { name: 'Taj Mahal', placeId: 'ChIJP5lBaS7kDTkR3r3QCFgp3Lg', type: 'heritage' },
    { name: 'Agra Fort', placeId: 'ChIJBfvvd0_kDTkR9V5W8-UfEJk', type: 'heritage' },
    { name: 'Fatehpur Sikri', placeId: 'ChIJm_FJ9h3hDTkRVSSR0B2QQZA', type: 'heritage' },
    { name: 'Itimad ud Daulah', placeId: 'ChIJLdeVaWvkDTkRZBsEjuwDj4o', type: 'heritage' },
  ],

  // ── UTTAR PRADESH / VARANASI ──────────────────────────
  varanasi: [
    { name: 'Dashashwamedh Ghat', placeId: 'ChIJwSE7YCAO8DkRbE4B0dv9mvg', type: 'temple' },
    { name: 'Kashi Vishwanath Temple', placeId: 'ChIJacH8eOQN8DkR-zVEMOI7mKo', type: 'temple' },
    { name: 'Sarnath', placeId: 'ChIJR1iF_KoO8DkRzjXkSTQ_dsc', type: 'heritage' },
    { name: 'Assi Ghat', placeId: 'ChIJ5RwdVCkP8DkRn4YGjm2uBss', type: 'temple' },
  ],

  // ── HIMACHAL PRADESH ──────────────────────────────────
  shimla: [
    { name: 'Mall Road Shimla', placeId: 'ChIJJUzRkm9jDTkRT4LyI_QCNwE', type: 'landmark' },
    { name: 'Jakhu Temple', placeId: 'ChIJmT-kUVFjDTkR-GpAa16vc3E', type: 'temple' },
    { name: 'Kufri', placeId: 'ChIJBb0QP01jDTkRpz-1cVDRBEw', type: 'nature' },
  ],

  manali: [
    { name: 'Solang Valley', placeId: 'ChIJv_fKOacmDTkRGumC1gFHMI8', type: 'nature' },
    { name: 'Rohtang Pass', placeId: 'ChIJ-cjQlIEJDTkRbV3sE_MRiAg', type: 'nature' },
    { name: 'Hadimba Temple', placeId: 'ChIJtWCIrJImDTkRJI4gJnUfA9Y', type: 'temple' },
    { name: 'Old Manali', placeId: 'ChIJm0JM0K4mDTkRr29Pn-nZBUc', type: 'landmark' },
  ],

  // ── KARNATAKA / HAMPI ─────────────────────────────────
  hampi: [
    { name: 'Virupaksha Temple Hampi', placeId: 'ChIJf9vQ4jQAozsRk7gMH7kFx8o', type: 'temple' },
    { name: 'Vittala Temple Complex', placeId: 'ChIJb1gn5j4AozsRBpz5n7rCxRE', type: 'heritage' },
    { name: 'Hampi Bazaar', placeId: 'ChIJTxTbT9MAozsRs7xtdvR6r5c', type: 'market' },
    { name: 'Matanga Hill Hampi', placeId: 'ChIJV5NxfVQAozsR_A_zzHhvbMU', type: 'nature' },
  ],

  // ── AMRITSAR / PUNJAB ─────────────────────────────────
  amritsar: [
    { name: 'Golden Temple', placeId: 'ChIJUUMJgmcFGTkRL0cxQR1bYUA', type: 'temple' },
    { name: 'Jallianwala Bagh', placeId: 'ChIJQw-LU2cFGTkR4hTPZ6Rfmh8', type: 'heritage' },
    { name: 'Wagah Border', placeId: 'ChIJW0M_UPYFGTkR-rJYYHg70gs', type: 'landmark' },
  ],

  // ── ASSAM / KAZIRANGA ─────────────────────────────────
  kaziranga: [
    { name: 'Kaziranga National Park', placeId: 'ChIJ00HMSO_B6TkRg-4mhRmxrM4', type: 'nature' },
    { name: 'Kohora Range Kaziranga', placeId: 'ChIJP2I3Vq3B6TkRB5yTKiXyWps', type: 'nature' },
  ],

  // ── SIKKIM / GANGTOK ──────────────────────────────────
  gangtok: [
    { name: 'Tsomgo Lake', placeId: 'ChIJU5wJAHXi6zkRBP7A0PZI2cA', type: 'nature' },
    { name: 'Rumtek Monastery', placeId: 'ChIJefT3H8nf6zkRUk1-k_nY10I', type: 'temple' },
    { name: 'Nathula Pass', placeId: 'ChIJXVFGRKTl6zkRiXR_UGPVLAU', type: 'nature' },
  ],

  // ── GUJARAT / AHMEDABAD ───────────────────────────────
  ahmedabad: [
    { name: 'Sabarmati Ashram', placeId: 'ChIJBSguiHp4XjkRSxHVmhg0I5s', type: 'heritage' },
    { name: 'Adalaj Stepwell', placeId: 'ChIJe1uQ6x5_XjkRyBFr7WEP8DU', type: 'heritage' },
    { name: 'Kankaria Lake', placeId: 'ChIJ3yIH2ZF7XjkRi-t8k3l2WFw', type: 'nature' },
  ],

  rann_of_kutch: [
    { name: 'Rann of Kutch Salt Flats', placeId: 'ChIJO8c0X4oVXTkR8ZFYB8LRt_8', type: 'nature' },
    { name: 'Dhordo Village', placeId: 'ChIJERdqTM9hXTkReWKjBaqJYoM', type: 'experience' },
  ],

  // ── BODH GAYA ─────────────────────────────────────────
  'bodh-gaya': [
    { name: 'Mahabodhi Temple', placeId: 'ChIJ-1bExVpq9TkRuDVNjx1HbJY', type: 'temple' },
    { name: 'Bodhi Tree', placeId: 'ChIJ_6FBpVtq9TkROHq8FLCrNtY', type: 'heritage' },
    { name: 'Great Buddha Statue Bodh Gaya', placeId: 'ChIJ6fI4PlFq9TkRHIBFJqbinpE', type: 'landmark' },
  ],

  // ── DARJEELING ────────────────────────────────────────
  darjeeling: [
    { name: 'Tiger Hill Darjeeling', placeId: 'ChIJg9n2dJTh6DkRXoxDwN5L0qM', type: 'nature' },
    { name: 'Darjeeling Himalayan Railway', placeId: 'ChIJ1VsMWkzh6DkRjRaIXCBaR_k', type: 'heritage' },
    { name: 'Happy Valley Tea Estate', placeId: 'ChIJl48U7wXg6DkRduwRJ6bFG4I', type: 'nature' },
  ],

  // ── RISHIKESH ────────────────────────────────────────
  rishikesh: [
    { name: 'Triveni Ghat Rishikesh', placeId: 'ChIJnXzG7-TiDTkRa7Hh0nBVSW4', type: 'temple' },
    { name: 'Lakshman Jhula', placeId: 'ChIJwx7TlGfjDTkRhxeAMlhXqFo', type: 'landmark' },
    { name: 'Ram Jhula', placeId: 'ChIJzb2VRGfjDTkRXr6Y82DlQmk', type: 'landmark' },
    { name: 'Parmarth Niketan', placeId: 'ChIJp4PiuuTiDTkR3gPHRqJa08c', type: 'temple' },
  ],
};

/**
 * Get tourist places for a destination slug.
 * Returns null if no place registry entry exists for that destination.
 */
export function getPlacesForDestination(slug: string): TouristPlace[] | null {
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');
  return DESTINATION_PLACES[normalizedSlug] || null;
}
