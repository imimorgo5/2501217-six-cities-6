import { BACKEND_URL, DEFAULT_OFFER_IMAGES } from './const';
import { Comment, NewOffer, Offer, UserRegister } from './types/types';

type BackendLocation = {
  latitude: number;
  longitude: number;
};

type BackendCity = {
  name: Offer['city']['name'];
  coordinates: BackendLocation;
};

type BackendUser = {
  id: string;
  name: string;
  email: string;
  avatarPath: string;
  type: 'ordinary' | 'pro';
};

type BackendOfferPreview = {
  id: string;
  title: string;
  postDate: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: Offer['type'];
  price: number;
  commentsCount: number;
  previewUrl: string;
  city: BackendCity;
};

type BackendOffer = BackendOfferPreview & {
  description: string;
  roomsCount: number;
  guestsCount: number;
  conveniences: string[];
  images: string[];
  author: BackendUser;
  coordinates: BackendLocation;
};

type BackendComment = {
  id: string;
  text: string;
  rating: number;
  createdAt: string;
  author: BackendUser;
};

const toAbsoluteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value, BACKEND_URL).toString();
};

const getDefaultImages = (): string[] => [...DEFAULT_OFFER_IMAGES];

const getOfferImages = (images?: string[]): string[] =>
  images && images.length === 6 ? images : getDefaultImages();

const mapUser = (user: BackendUser) => ({
  name: user.name,
  email: user.email,
  avatarUrl: toAbsoluteUrl(user.avatarPath),
  isPro: user.type === 'pro',
});

const mapOfferBase = (offer: BackendOfferPreview) => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: offer.city.name,
    location: offer.city.coordinates,
  },
  location: offer.city.coordinates,
  previewImage: toAbsoluteUrl(offer.previewUrl),
  type: offer.type,
  bedrooms: 0,
  description: '',
  goods: [],
  host: {
    name: '',
    email: '',
    avatarUrl: '',
    isPro: false,
  },
  images: [],
  maxAdults: 0,
});

export const adaptOfferPreview = (offer: BackendOfferPreview): Offer => mapOfferBase(offer);

export const adaptOffer = (offer: BackendOffer): Offer => ({
  ...mapOfferBase(offer),
  location: offer.coordinates,
  bedrooms: offer.roomsCount,
  description: offer.description,
  goods: offer.conveniences,
  host: mapUser(offer.author),
  images: offer.images.map(toAbsoluteUrl),
  maxAdults: offer.guestsCount,
});

export const adaptComment = (comment: BackendComment): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.createdAt,
  rating: comment.rating,
  user: mapUser(comment.author),
});

export const adaptNewOfferToApi = (offer: NewOffer) => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewUrl: offer.previewImage,
  images: getOfferImages(),
  isPremium: offer.isPremium,
  type: offer.type,
  roomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  conveniences: offer.goods,
  coordinates: offer.location,
});

export const adaptOfferToApiPatch = (offer: Offer) => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewUrl: offer.previewImage,
  images: getOfferImages(offer.images),
  isPremium: offer.isPremium,
  type: offer.type,
  roomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  conveniences: offer.goods,
  coordinates: offer.location,
});

export const adaptRegisterPayload = (user: UserRegister) => ({
  name: user.name,
  email: user.email,
  password: user.password,
  type: user.isPro ? 'pro' as const : 'ordinary' as const,
});
