export interface Site {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  story_ar: string;
  story_en: string;
  image_url: string;
  lat: number;
  lng: number;
  is_premium: number;
}

export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image_url: string;
  category: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  subscription: 'free' | 'premium';
  points: number;
  avatar: string;
  progress?: Site[];
  badges?: Badge[];
}

export interface Badge {
  id: number;
  name_ar: string;
  name_en: string;
  icon: string;
  requirement: string;
}
