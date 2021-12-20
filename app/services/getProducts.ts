import dayjs from "dayjs";
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
  updatedAt: string;
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
  priceInDollars: string;
  showOriginalPrice: boolean;
  photo: string;
  isRecent: boolean;
}

export interface Products {
  page: number;
  per_page: number;
  isLastPage: boolean;
  products: Product[];
}

/**
 * Replaces imgs urls with my own service who has cache-control header
 * on /images/{id_product}.{png,webp}
 */
function getPhotoWithCache(photo: string) {
  const photoUrl = new URL(photo);
  const photoUrlParts = photoUrl.pathname.split("/");
  const product = photoUrlParts[photoUrlParts.length - 1];

  return `/images/${product}`;
}

function prepareProduct(
  { id, name, price, originalPrice, photo, updatedAt }: ApiProduct,
  cotization: number
): Product {
  // a recent product is a product which was updated
  // in the last month
  const oneMonthAgo = dayjs().subtract(1, "month");

  return {
    id,
    name,
    price: price.toFixed(2),
    originalPrice: originalPrice.toFixed(2),
    priceInDollars: (price / cotization).toFixed(2),
    showOriginalPrice: originalPrice > price,
    photo: getPhotoWithCache(photo),
    isRecent: dayjs(updatedAt).isAfter(oneMonthAgo),
  };
}

const kvPrefix = "page";

export default async function getProducts(page = 1): Promise<Products> {
  const productosUrl = `${API_URL}/slow/products?page=${page}`;

  const cached = await KV.get(`${kvPrefix}:${page}`);
  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(productosUrl, { method: "GET" });

  const [data, cotization]: [ApiResponseProducts, number] = await Promise.all([
    response.json(),
    getCotization(),
  ]);

  const productsData = {
    page: data.page,
    per_page: data.per_page,
    isLastPage: data.page_count === data.page,
    products: data.products
      .map((product) => prepareProduct(product, cotization))
      .filter((p) => p.isRecent),
  };

  KV.put(`${kvPrefix}:${page}`, JSON.stringify(productsData), {
    expirationTtl: 3600,
  });

  return productsData;
}
