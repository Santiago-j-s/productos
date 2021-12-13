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
  page_count: number;
  products: Product[];
}

export default async function getProducts(): Promise<Products> {
  const baseUrl = "https://challenge-api.aerolab.co";
  const productosUrl = `${baseUrl}/products`;

  const response = await fetch(productosUrl, {
    method: "GET",
  });

  const data: ApiResponseProducts = await response.json();

  return {
    page: data.page,
    per_page: data.per_page,
    page_count: data.page_count,
    products: data.products.map(
      ({ id, name, price, originalPrice, photo }) => ({
        id,
        name,
        price: price.toFixed(2),
        originalPrice: originalPrice.toFixed(2),
        showOriginalPrice: originalPrice > price,
        photo,
      })
    ),
  };
}
