import { photos, fetchPhotos, PhotoType } from './photos';

export type Product = PhotoType;
export { photos, fetchPhotos };
export const fetchProducts = fetchPhotos;
