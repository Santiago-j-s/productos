import { LoaderFunction } from "remix";
import { json } from "remix";

interface Producto {
  id: string;
  name: string;
  price: number;
  presentation: string;
  brand: string;
  photo: string;
  originalPrice: number;
  updateAt: string;
}

interface ResponseProductos {
  productos: Producto[];
  page: number;
  per_page: number;
  page_count: number;
}

const baseUrl = "https://challenge-api.aerolab.co";
const productosUrl = `${baseUrl}/products`;

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export const loader: LoaderFunction = async () => {
  const response = await fetch(productosUrl, {
    method: "GET",
  });

  const data: ResponseProductos = await response.json();

  // https://remix.run/api/remix#json
  return json(data);
};

export default function Index() {
  return <main></main>;
}
