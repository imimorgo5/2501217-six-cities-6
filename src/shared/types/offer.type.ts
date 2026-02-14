import {User} from './user.type.js';
import {City} from './city.type.js';
import {OfferType} from './offer-type.enum.js';
import {Convenience} from './convenience.enum.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewPath: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  conveniences: Convenience[];
  author: User;
  commentsCount: number;
  latitude: number;
  longitude: number;
}
