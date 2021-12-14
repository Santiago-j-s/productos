import { API_URL } from "~/constants";
import getCotization from "./getCotization";

interface ApiProduct {
  id: string;
  name: string;
  price: number;
  presentation: string;
  brand: string;
  photo: string;
  originalPrice: number;
  updateAt: string;
}

interface ApiResponseProducts {
  products: ApiProduct[];
  page: number;
  per_page: number;
  page_count: number;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  showOriginalPrice: boolean;
  photo: string;
}

export interface Products {
  page: number;
  per_page: number;
  isLastPage: boolean;
  products: Product[];
}

function getPhotoWithCache(photo: string) {
  const photoUrl = new URL(photo);
  const photoUrlParts = photoUrl.pathname.split("/");
  const product = photoUrlParts[photoUrlParts.length - 1];

  return `/images/${product}`;
}

export default async function getProducts(page = 1): Promise<Products> {
  const productosUrl = `${API_URL}/products?page=${page}`;

  const response = await fetch(productosUrl, {
    method: "GET",
  });

  const [data, cotization]: [ApiResponseProducts, number] = await Promise.all([
    response.json(),
    getCotization(),
  ]);

  return {
    page: data.page,
    per_page: data.per_page,
    isLastPage: data.page_count === data.page,
    products: data.products.map(
      ({ id, name, price, originalPrice, photo }) => ({
        id,
        name,
        price: price.toFixed(2),
        priceInDollars: (price / cotization).toFixed(2),
        originalPrice: originalPrice.toFixed(2),
        showOriginalPrice: originalPrice > price,
        photo: getPhotoWithCache(photo),
      })
    ),
  };
}
